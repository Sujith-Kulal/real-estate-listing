import fetch from 'node-fetch';
import { errorHandler } from '../utils/error.js';

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getNearbyTransport = async (req, res, next) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const userRadius = parseInt(req.query.radius || '300', 10);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return next(errorHandler(400, 'lat and lon query params are required'));
  }

  // Category-specific radii (meters) based on your scoring windows
  const RADII = {
    bus: Math.max(1000, userRadius), // ensure we cover up to 1km
    rail: 10000, // 10 km
    airport: 40000, // 40 km
    highway: 500, // 500 m
    ferry: 2000, // optional
  };

  const overpassUrl = 'https://overpass-api.de/api/interpreter';

  const query = `
    [out:json][timeout:25];
    (
      // Airports up to 40km
      node(around:${RADII.airport},${lat},${lon})[aeroway~"^(aerodrome|airport)$"];

      // Rail  up to 10km
      node(around:${RADII.rail},${lat},${lon})[railway~"^(station|halt|stop)$"];
      node(around:${RADII.rail},${lat},${lon})[railway~"^(tram_stop|subway_entrance)$"];

      // Bus stops up to 1km
      node(around:${RADII.bus},${lat},${lon})[highway=bus_stop];

      // Major highways up to 500m
      way(around:${RADII.highway},${lat},${lon})[highway~"^(motorway|trunk|primary)$"];

      // Optional
      node(around:${RADII.ferry},${lat},${lon})[amenity=ferry_terminal];
    );
    out center 200;
  `;

  try {
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: query }).toString(),
    });

    if (!response.ok) {
      return next(errorHandler(502, `Overpass error: ${response.status}`));
    }

    const data = await response.json();
    const elements = Array.isArray(data.elements) ? data.elements : [];

    const categorize = (el) => {
      const tags = el.tags || {};
      if (tags.aeroway === 'aerodrome' || tags.aeroway === 'airport') return 'airports';
      if (['station', 'halt', 'stop'].includes(tags.railway)) return 'railwayStations';
      if (tags.railway === 'tram_stop' || tags.railway === 'subway_entrance') return 'metroTram';
      if (tags.highway === 'bus_stop') return 'busStops';
      if (tags.amenity === 'ferry_terminal') return 'ferryTerminals';
      if (tags.highway && /^(motorway|trunk|primary)$/.test(tags.highway)) return 'majorHighways';
      if (tags.railway && /^(rail|tram|subway)$/.test(tags.railway)) return 'railLines';
      return 'other';
    };

    const results = {
      airports: [],
      railwayStations: [],
      metroTram: [],
      busStops: [],
      majorHighways: [],
      railLines: [],
      ferryTerminals: [],
      other: [],
    };

    for (const el of elements) {
      const center = el.center || { lat: el.lat, lon: el.lon };
      if (!center) continue;
      const dist = distanceInMeters(lat, lon, center.lat, center.lon);
      const name = (el.tags && (el.tags.name || el.tags.ref)) || 'Unnamed';
      const category = categorize(el);
      results[category].push({
        id: el.id,
        name,
        distanceMeters: Math.round(dist),
        tags: el.tags || {},
        lat: center.lat,
        lon: center.lon,
        type: el.type,
      });
    }

    // Simple transport score out of 10
    const counts = {
      airports: results.airports.length,
      railwayStations: results.railwayStations.length,
      metroTram: results.metroTram.length,
      busStops: results.busStops.length,
      majorHighways: results.majorHighways.length,
      ferryTerminals: results.ferryTerminals.length,
    };

    // Distance-weighted scoring per your spec
    const breakdown = {
      busStops: 0,
      railway: 0,
      airports: 0,
      highways: 0,
    };

    // Bus stops: boost quickly (<=1km)
    for (const b of results.busStops) {
      const d = b.distanceMeters;
      if (d <= 300) breakdown.busStops += 2.0;
      else if (d <= 600) breakdown.busStops += 1.5;
      else if (d <= 1000) breakdown.busStops += 1.0;
    }

    // Railway stations: 2–10km medium contribution
    const railAll = [...results.railwayStations, ...results.metroTram];
    for (const r of railAll) {
      const d = r.distanceMeters;
      if (d >= 2000 && d <= 5000) breakdown.railway += 2.0;
      else if (d > 5000 && d <= 10000) breakdown.railway += 1.0;
    }

    // Airports: 20–40km adds long-distance connectivity
    for (const a of results.airports) {
      const d = a.distanceMeters;
      if (d >= 20000 && d <= 30000) breakdown.airports += 2.0;
      else if (d > 30000 && d <= 40000) breakdown.airports += 1.0;
    }

    // Highways: 100–500m helps accessibility
    for (const h of results.majorHighways) {
      const d = h.distanceMeters;
      if (d >= 100 && d <= 300) breakdown.highways += 1.5;
      else if (d > 300 && d <= 500) breakdown.highways += 1.0;
    }

    const rawScore = breakdown.busStops + breakdown.railway + breakdown.airports + breakdown.highways;
    const score = Math.min(10, Number(rawScore.toFixed(1)));

    // Sort each category by distance ascending
    Object.values(results).forEach((arr) => Array.isArray(arr) && arr.sort((a, b) => a.distanceMeters - b.distanceMeters));

    return res.status(200).json({
      center: { lat, lon },
      radius: userRadius,
      score,
      counts,
      scoreBreakdown: breakdown,
      results,
    });
  } catch (error) {
    return next(error);
  }
};


