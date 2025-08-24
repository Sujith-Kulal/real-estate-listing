import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaUser, FaRuler, FaShieldAlt, FaRupeeSign, FaTag, FaStar, FaBus, FaTrain, FaPlane, FaRoad } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function ListingItem({ listing }) {
  const [transportScore, setTransportScore] = useState(null);
  const [loadingTransport, setLoadingTransport] = useState(false);

  useEffect(() => {
    const fetchTransportScore = async () => {
      if (!listing.latitude || !listing.longitude) return;
      
      // Check for default/placeholder coordinates
      const defaultCoords = [
        [0, 0],           // Null Island
        [12.9716, 77.5946], // Bangalore (common default)
        [40.7128, -74.0060], // New York (common default)
        [51.5074, -0.1278],  // London (common default)
        [35.6762, 139.6503], // Tokyo (common default)
      ];

      const isDefaultCoord = defaultCoords.some(([dlat, dlon]) => 
        Math.abs(listing.latitude - dlat) < 0.001 && Math.abs(listing.longitude - dlon) < 0.001
      );

      if (isDefaultCoord) {
        setTransportScore(null);
        return;
      }
      
      setLoadingTransport(true);
      try {
        const response = await fetch(`/api/transport/nearby?lat=${listing.latitude}&lon=${listing.longitude}&radius=300`);
        if (response.ok) {
          const data = await response.json();
          // Only set score if it's not a default coordinate message
          if (!data.message) {
            setTransportScore(data.score);
          } else {
            setTransportScore(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch transport score:', error);
        setTransportScore(null);
      } finally {
        setLoadingTransport(false);
      }
    };

    fetchTransportScore();
  }, [listing.latitude, listing.longitude]);

  // Get transport score color based on score
  const getTransportScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-blue-600 bg-blue-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls?.[0]
              ? listing.imageUrls[0]
              : 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300'
        />

        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          
          {/* Listing Type Badge */}
          <div className='flex items-center gap-2 mt-2'>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              listing.type === 'sale' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Price Information */}
          <div className='bg-blue-50 p-2 rounded-lg mt-2'>
            {listing.type === 'sale' ? (
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div className='flex items-center gap-1'>
                  <FaRupeeSign className='text-green-600 text-xs' />
                  <span className='text-gray-600'>Per sq ft:</span>
                  <span className='font-semibold text-green-700'>
                    ₹{listing.pricePerSqft?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <FaRupeeSign className='text-blue-600 text-xs' />
                  <span className='text-gray-600'>Total:</span>
                  <span className='font-semibold text-blue-700'>
                    ₹{listing.totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div className='flex items-center gap-1'>
                  <FaRupeeSign className='text-green-600 text-xs' />
                  <span className='text-gray-600'>Monthly:</span>
                  <span className='font-semibold text-green-700'>
                    ₹{listing.monthlyRent?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <FaRupeeSign className='text-blue-600 text-xs' />
                  <span className='text-gray-600'>Deposit:</span>
                  <span className='font-semibold text-blue-700'>
                    ₹{listing.deposit?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className='text-slate-700 flex flex-col gap-2 mt-2'>
            <div className='flex items-center justify-between text-xs'>
              <div className='flex items-center gap-1'>
                <FaUser className='text-green-600' />
                <span className='capitalize'>{listing.ownerType}</span>
              </div>
              <div className='flex items-center gap-1'>
                <FaTag className='text-purple-600' />
                <span className='capitalize'>{listing.type}</span>
              </div>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <FaRuler className='text-blue-600' />
              <span>{listing.plotArea?.toLocaleString('en-IN')} sq ft</span>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <FaShieldAlt className={`${listing.boundaryWall ? 'text-green-600' : 'text-red-600'}`} />
              <span className={listing.boundaryWall ? 'text-green-700' : 'text-red-700'}>
                Boundary Wall: {listing.boundaryWall ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Transport Score */}
          <div className='bg-gray-50 p-2 rounded-lg mt-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FaStar className='text-yellow-500' />
                <span className='text-xs text-gray-600'>Transport Score</span>
              </div>
              {loadingTransport ? (
                <div className='text-xs text-gray-500'>Loading...</div>
              ) : transportScore !== null ? (
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getTransportScoreColor(transportScore)}`}>
                  {transportScore}/10
                </div>
              ) : (
                <div className='text-xs text-gray-400'>N/A</div>
              )}
            </div>
            {transportScore !== null && (
              <div className='flex items-center gap-3 mt-2 text-xs text-gray-600'>
                <div className='flex items-center gap-1'>
                  <FaBus className='text-green-600' />
                  <span>Bus</span>
                </div>
                <div className='flex items-center gap-1'>
                  <FaTrain className='text-blue-600' />
                  <span>Rail</span>
                </div>
                <div className='flex items-center gap-1'>
                  <FaPlane className='text-purple-600' />
                  <span>Air</span>
                </div>
                <div className='flex items-center gap-1'>
                  <FaRoad className='text-orange-600' />
                  <span>Road</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
