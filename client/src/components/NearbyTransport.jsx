import { useEffect, useState } from 'react';
import { FaTrain, FaBus, FaPlane, FaRoad, FaSubway, FaShip, FaStar } from 'react-icons/fa';

export default function NearbyTransport({ latitude, longitude, radius = 300 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNearby = async () => {
      if (!latitude || !longitude) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/transport/nearby?lat=${latitude}&lon=${longitude}&radius=${radius}`);
        if (!res.ok) throw new Error('Failed to fetch nearby transport');
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message || 'Failed to load nearby transport');
      } finally {
        setLoading(false);
      }
    };
    fetchNearby();
  }, [latitude, longitude, radius]);

  if (!latitude || !longitude) return null;

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-200'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-lg font-semibold text-gray-800'>Nearby Transport (within {radius}m)</h3>
        {data && (
          <div className='flex items-center gap-2 text-sm'>
            <FaStar className='text-yellow-500' />
            <span className='font-medium'>Transport Score:</span>
            <span className='px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold'>{data.score}/10</span>
          </div>
        )}
      </div>

      {loading && <p className='text-sm text-gray-600'>Loading nearby places…</p>}
      {error && <p className='text-sm text-red-600'>{error}</p>}

      {data && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Breakdown breakdown={data.scoreBreakdown} />
          <Category title='Airports' icon={<FaPlane className='text-blue-600' />} items={data.results.airports} />
          <Category title='Railway Stations' icon={<FaTrain className='text-gray-700' />} items={data.results.railwayStations} />
          <Category title='Metro/Tram' icon={<FaSubway className='text-purple-700' />} items={data.results.metroTram} />
          <Category title='Bus Stops' icon={<FaBus className='text-green-700' />} items={data.results.busStops} />
          <Category title='Major Highways' icon={<FaRoad className='text-orange-700' />} items={data.results.majorHighways} />
          <Category title='Ferry Terminals' icon={<FaShip className='text-indigo-700' />} items={data.results.ferryTerminals} />
        </div>
      )}
    </div>
  );
}

function Category({ title, icon, items }) {
  if (!items || items.length === 0) {
    return (
      <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
        <div className='flex items-center gap-2 mb-2'>
          {icon}
          <h4 className='font-medium text-gray-800'>{title}</h4>
        </div>
        <p className='text-xs text-gray-500'>No places found within 300m</p>
      </div>
    );
  }
  return (
    <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
      <div className='flex items-center gap-2 mb-2'>
        {icon}
        <h4 className='font-medium text-gray-800'>{title}</h4>
        <span className='ml-auto text-xs text-gray-500'>{items.length} nearby</span>
      </div>
      <ul className='text-sm text-gray-700 space-y-1 max-h-40 overflow-auto pr-1'>
        {items.slice(0, 6).map((it) => (
          <li key={`${title}-${it.id}`} className='flex items-center justify-between'>
            <span className='truncate'>{it.name}</span>
            <span className='text-xs text-gray-500'>{it.distanceMeters} m</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Breakdown({ breakdown }) {
  if (!breakdown) return null;
  const items = [
    { key: 'busStops', label: 'Bus Stops', color: 'bg-green-200 text-green-800' },
    { key: 'railway', label: 'Railway', color: 'bg-gray-200 text-gray-800' },
    { key: 'airports', label: 'Airports', color: 'bg-blue-200 text-blue-800' },
    { key: 'highways', label: 'Highways', color: 'bg-orange-200 text-orange-800' },
  ];
  return (
    <div className='bg-white p-3 rounded-lg border border-gray-200 md:col-span-2'>
      <h4 className='font-medium text-gray-800 mb-2'>Score Breakdown</h4>
      <div className='flex flex-wrap gap-2'>
        {items.map((it) => (
          <div key={it.key} className={`px-2 py-1 rounded ${it.color}`}>
            {it.label}: {breakdown[it.key] ?? 0}
          </div>
        ))}
      </div>
    </div>
  );
}


