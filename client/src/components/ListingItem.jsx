import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaUser, FaRuler, FaShieldAlt, FaRupeeSign, FaTag } from 'react-icons/fa';

export default function ListingItem({ listing }) {
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
            {listing.boundaryWall && (
              <div className='flex items-center gap-2 text-xs'>
                <FaShieldAlt className='text-orange-600' />
                <span>Boundary Wall</span>
              </div>
            )}
          </div>

          {/* Quick Summary */}
          <div className='bg-gray-50 p-2 rounded-lg mt-2'>
            <div className='grid grid-cols-3 gap-2 text-center text-xs'>
              <div>
                <div className='font-bold text-blue-600'>{listing.plotArea?.toLocaleString('en-IN')}</div>
                <div className='text-gray-500'>Sq Ft</div>
              </div>
              <div>
                <div className='font-bold text-green-600'>₹{listing.pricePerSqft?.toLocaleString('en-IN')}</div>
                <div className='text-gray-500'>Per Sq Ft</div>
              </div>
              <div>
                <div className='font-bold text-purple-600'>₹{listing.totalPrice?.toLocaleString('en-IN')}</div>
                <div className='text-gray-500'>Total</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
