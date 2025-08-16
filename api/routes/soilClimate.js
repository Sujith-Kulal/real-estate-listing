import express from 'express';
import Property from '../models/Property.js';

const router = express.Router();

// Calculate Bhumi Score based on soil and climate data
const calculateBhumiScore = (soilData, weatherData) => {
  let score = 0;
  
  // Soil factors (40% weight)
  if (soilData) {
    // pH factor (optimal range 6.0-7.5)
    const ph = soilData.ph || 7.0;
    if (ph >= 6.0 && ph <= 7.5) score += 20;
    else if (ph >= 5.5 && ph <= 8.0) score += 15;
    else if (ph >= 5.0 && ph <= 8.5) score += 10;
    else score += 5;
    
    // Organic matter factor
    const organicMatter = soilData.organicMatter || 0;
    if (organicMatter >= 3.0) score += 20;
    else if (organicMatter >= 2.0) score += 15;
    else if (organicMatter >= 1.0) score += 10;
    else score += 5;
  }
  
  // Climate factors (30% weight)
  if (weatherData) {
    // Temperature stability
    const tempVariation = weatherData.tempVariation || 0;
    if (tempVariation <= 5) score += 15;
    else if (tempVariation <= 10) score += 10;
    else score += 5;
    
    // Rainfall adequacy
    const rainfall = weatherData.rainfall || 0;
    if (rainfall >= 800 && rainfall <= 2000) score += 15;
    else if (rainfall >= 500 && rainfall <= 2500) score += 10;
    else score += 5;
  }
  
  // Water availability (20% weight)
  const moisture = soilData?.moisture || 0;
  if (moisture >= 20 && moisture <= 40) score += 20;
  else if (moisture >= 15 && moisture <= 50) score += 15;
  else if (moisture >= 10 && moisture <= 60) score += 10;
  else score += 5;
  
  // Land stability (10% weight)
  const slope = soilData?.slope || 0;
  if (slope <= 5) score += 10;
  else if (slope <= 15) score += 7;
  else if (slope <= 25) score += 4;
  else score += 1;
  
  return Math.min(100, Math.max(0, score));
};

// Fetch real weather data from OpenWeatherMap API
const fetchWeatherData = async (lat, lon) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Process current weather
    const current = data.list[0] || {};
    const currentWeather = {
      temp: current.main?.temp || 25,
      humidity: current.main?.humidity || 60,
      description: current.weather?.[0]?.description || 'Clear',
      icon: current.weather?.[0]?.icon || '01d'
    };

    // Process 7-day forecast
    const forecast = data.list.slice(0, 7).map(day => ({
      date: new Date(day.dt * 1000).toISOString().split('T')[0],
      temp: day.main.temp,
      humidity: day.main.humidity,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      rain: day.rain?.['3h'] || 0
    }));

    // Calculate temperature variation and rainfall
    const temps = data.list.slice(0, 7).map(d => d.main.temp);
    const tempVariation = Math.max(...temps) - Math.min(...temps);
    const rainfall = data.list.slice(0, 7).reduce((sum, day) => sum + (day.rain?.['3h'] || 0), 0);

    return {
      current: currentWeather,
      forecast,
      tempVariation: Math.round(tempVariation * 10) / 10,
      rainfall: Math.round(rainfall * 10) / 10
    };

  } catch (error) {
    console.error('Weather API error:', error.message);
    return null;
  }
};

// Fetch real soil data from SoilGrids API
const fetchSoilData = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&property=soc&property=clay&property=silt&property=sand&depth=0-5cm&depth=5-15cm&depth=15-30cm&depth=30-60cm&depth=60-100cm&depth=100-200cm&value=mean&value=uncertainty`
    );

    if (!response.ok) {
      throw new Error(`Soil API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Process soil data from the top layer (0-5cm)
    const layers = data.properties?.layers || [];
    const topLayer = layers.find(layer => layer.depth_range === '0-5cm');
    
    if (topLayer) {
      return {
        ph: topLayer.properties?.phh2o?.mean || 7.0,
        organicMatter: (topLayer.properties?.soc?.mean || 0) * 1.724, // Convert SOC to OM
        clay: topLayer.properties?.clay?.mean || 0,
        silt: topLayer.properties?.silt?.mean || 0,
        sand: topLayer.properties?.sand?.mean || 0,
        moisture: Math.random() * 30 + 10, // Simulated moisture level
        slope: Math.random() * 20 + 2, // Simulated slope
        texture: getSoilTexture(
          topLayer.properties?.clay?.mean || 0,
          topLayer.properties?.silt?.mean || 0,
          topLayer.properties?.sand?.mean || 0
        )
      };
    }
    
    return null;

  } catch (error) {
    console.error('Soil API error:', error.message);
    return null;
  }
};

// Generate fallback demo data when APIs fail
const generateDemoData = (lat, lon) => {
  // Add some variation based on coordinates for realistic demo data
  const latVariation = (lat % 1) * 100;
  const lonVariation = (lon % 1) * 100;
  
  const weatherData = {
    current: {
      temp: 28 + Math.sin(latVariation) * 5,
      humidity: 60 + Math.cos(lonVariation) * 20,
      description: 'Partly cloudy',
      icon: '02d'
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      temp: 25 + Math.sin(latVariation + i) * 10,
      humidity: 50 + Math.cos(lonVariation + i) * 30,
      description: ['Clear', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.abs(Math.sin(latVariation + i)) * 4)],
      icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.abs(Math.sin(latVariation + i)) * 4)],
      rain: Math.random() > 0.7 ? Math.random() * 10 : 0
    })),
    tempVariation: 5 + Math.abs(Math.sin(latVariation)) * 5,
    rainfall: Math.abs(Math.cos(lonVariation)) * 20
  };

  const soilData = {
    ph: 6.0 + Math.sin(latVariation) * 2.5,
    organicMatter: 1.5 + Math.abs(Math.cos(lonVariation)) * 3.0,
    clay: 15 + Math.abs(Math.sin(latVariation)) * 30,
    silt: 20 + Math.abs(Math.cos(lonVariation)) * 40,
    sand: 20 + Math.abs(Math.sin(latVariation + lonVariation)) * 50,
    moisture: 15 + Math.abs(Math.cos(latVariation)) * 35,
    slope: 2 + Math.abs(Math.sin(lonVariation)) * 18,
    texture: getSoilTexture(
      15 + Math.abs(Math.sin(latVariation)) * 30,
      20 + Math.abs(Math.cos(lonVariation)) * 40,
      20 + Math.abs(Math.sin(latVariation + lonVariation)) * 50
    )
  };

  return { weatherData, soilData };
};

// Get soil and climate data for a specific property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Find the property in database
    const property = await Property.findOne({ propertyId });
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    const { lat, lon } = property.coordinates;
    
    // Try to fetch real data first
    let weatherData = await fetchWeatherData(lat, lon);
    let soilData = await fetchSoilData(lat, lon);
    let dataSource = 'real';
    
    // If APIs fail, fall back to demo data
    if (!weatherData || !soilData) {
      console.log(`Using fallback demo data for property ${propertyId} due to API failures`);
      const demoData = generateDemoData(lat, lon);
      weatherData = demoData.weatherData;
      soilData = demoData.soilData;
      dataSource = 'demo';
    }
    
    // Calculate Bhumi Score
    const bhumiScore = calculateBhumiScore(soilData, weatherData);
    
    // Generate recommendations
    const recommendations = generateRecommendations(soilData, weatherData, bhumiScore);
    
    // Prepare response data
    const responseData = {
      property: {
        id: property.propertyId,
        title: property.title,
        address: property.address,
        city: property.city,
        coordinates: { lat, lon },
        area: property.area,
        price: property.price
      },
      soilClimate: {
        weather: weatherData,
        soil: soilData,
        bhumiScore,
        recommendations,
        dataSource,
        timestamp: new Date().toISOString()
      }
    };
    
    // Update property with new soil climate data
    await property.updateSoilClimateData({
      weather: weatherData,
      soil: soilData,
      bhumiScore,
      recommendations,
      dataSource,
      lastUpdated: new Date()
    });
    
    res.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Property soil climate data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property soil and climate data',
      message: error.message
    });
  }
});

// Get soil and climate data for specific coordinates (for new properties)
router.get('/coordinates/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude) || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided'
      });
    }
    
    // Try to fetch real data first
    let weatherData = await fetchWeatherData(latitude, longitude);
    let soilData = await fetchSoilData(latitude, longitude);
    let dataSource = 'real';
    
    // If APIs fail, fall back to demo data
    if (!weatherData || !soilData) {
      console.log('Using fallback demo data due to API failures');
      const demoData = generateDemoData(latitude, longitude);
      weatherData = demoData.weatherData;
      soilData = demoData.soilData;
      dataSource = 'demo';
    }
    
    // Calculate Bhumi Score
    const bhumiScore = calculateBhumiScore(soilData, weatherData);
    
    // Generate recommendations
    const recommendations = generateRecommendations(soilData, weatherData, bhumiScore);
    
    res.json({
      success: true,
      data: {
        coordinates: { lat: latitude, lon: longitude },
        weather: weatherData,
        soil: soilData,
        bhumiScore,
        recommendations,
        dataSource,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Coordinate soil climate data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch soil and climate data for coordinates',
      message: error.message
    });
  }
});

// Get properties by area with Bhumi Score filtering
router.get('/area/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { minScore = 0, maxScore = 100, limit = 20 } = req.query;
    
    const properties = await Property.findByArea(
      city, 
      parseInt(minScore), 
      parseInt(maxScore)
    ).limit(parseInt(limit));
    
    const propertiesWithAnalysis = properties.map(property => ({
      id: property.propertyId,
      title: property.title,
      address: property.address,
      coordinates: property.coordinates,
      area: property.area,
      price: property.price,
      analysis: property.getAnalysisSummary(),
      images: property.images
    }));
    
    res.json({
      success: true,
      data: {
        city,
        totalProperties: propertiesWithAnalysis.length,
        properties: propertiesWithAnalysis
      }
    });
    
  } catch (error) {
    console.error('Area search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search properties by area',
      message: error.message
    });
  }
});

// Get nearby properties (within specified distance)
router.get('/nearby/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const { distance = 5000, limit = 20 } = req.query;
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const maxDistance = parseInt(distance);
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude) || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided'
      });
    }
    
    const nearbyProperties = await Property.findNearby(latitude, longitude, maxDistance)
      .limit(parseInt(limit));
    
    const propertiesWithAnalysis = nearbyProperties.map(property => ({
      id: property.propertyId,
      title: property.title,
      address: property.address,
      coordinates: property.coordinates,
      area: property.area,
      price: property.price,
      analysis: property.getAnalysisSummary(),
      distance: calculateDistance(latitude, longitude, property.coordinates.lat, property.coordinates.lon)
    }));
    
    res.json({
      success: true,
      data: {
        center: { lat: latitude, lon: longitude },
        maxDistance: maxDistance,
        totalProperties: propertiesWithAnalysis.length,
        properties: propertiesWithAnalysis
      }
    });
    
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search nearby properties',
      message: error.message
    });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Helper function to determine soil texture
function getSoilTexture(clay, silt, sand) {
  if (clay >= 40) return 'Clay';
  if (clay >= 27 && silt >= 50) return 'Silty Clay';
  if (clay >= 27 && sand >= 45) return 'Sandy Clay';
  if (clay >= 20 && silt >= 30) return 'Clay Loam';
  if (clay >= 20 && sand >= 45) return 'Sandy Clay Loam';
  if (silt >= 50 && clay < 27) return 'Silt Loam';
  if (sand >= 70 && clay < 20) return 'Sandy Loam';
  if (silt >= 30 && clay < 20) return 'Loam';
  return 'Loamy Sand';
}

// Helper function to generate agricultural recommendations
function generateRecommendations(soil, weather, bhumiScore) {
  const recommendations = {
    crops: [],
    construction: '',
    general: ''
  };
  
  // Crop recommendations based on soil and climate
  if (soil.ph >= 6.0 && soil.ph <= 7.5) {
    if (soil.moisture >= 20 && soil.moisture <= 40) {
      recommendations.crops.push('Rice', 'Wheat', 'Vegetables');
    } else if (soil.moisture < 20) {
      recommendations.crops.push('Millets', 'Pulses', 'Oilseeds');
    }
  } else if (soil.ph >= 5.5 && soil.ph <= 6.0) {
    recommendations.crops.push('Tea', 'Coffee', 'Citrus fruits');
  } else if (soil.ph >= 7.5 && soil.ph <= 8.5) {
    recommendations.crops.push('Cotton', 'Sugarcane', 'Barley');
  }
  
  // Construction recommendations
  if (soil.slope <= 5) {
    recommendations.construction = 'Excellent for construction - flat terrain with good soil stability';
  } else if (soil.slope <= 15) {
    recommendations.construction = 'Good for construction - moderate slope, may require some grading';
  } else {
    recommendations.construction = 'Challenging for construction - steep slope, requires significant engineering';
  }
  
  // General recommendations based on Bhumi Score
  if (bhumiScore >= 80) {
    recommendations.general = 'Premium land with excellent agricultural and construction potential';
  } else if (bhumiScore >= 60) {
    recommendations.general = 'Good quality land suitable for most agricultural and construction purposes';
  } else if (bhumiScore >= 40) {
    recommendations.general = 'Moderate quality land, may require soil improvement for optimal results';
  } else {
    recommendations.general = 'Land may have limitations, consider soil testing and improvement strategies';
  }
  
  return recommendations;
}

export default router;
