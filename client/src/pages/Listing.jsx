import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import {
  FaUser,
  FaRuler,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaShare,
  FaGlobe,
  FaRupeeSign,
  FaHome,
  FaTag,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import NearbyTransport from '../components/NearbyTransport';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        
        if (!res.ok) {
          // Handle HTTP errors (404, 500, etc.)
          if (res.status === 404) {
            setError('Listing not found!');
          } else {
            setError('Something went wrong!');
          }
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        
        // Check if the response has an error message
        if (data.message && data.message.includes('not found')) {
          setError(data.message);
          setLoading(false);
          return;
        }
        
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError('Something went wrong!');
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <div className='text-center my-7'>
          <p className='text-2xl text-red-600 mb-4'>{error}</p>
          {error === 'Listing not found!' && (
            <div className='text-gray-600'>
              <p>This listing may not exist or may not be approved yet.</p>
              <p className='mt-2'>
                <Link to='/' className='text-green-600 hover:underline'>
                  ← Back to Home
                </Link>
              </p>
            </div>
          )}
        </div>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className='mt-10 flex items-center justify-center'>
                  <img
                    src={url}
                    alt='listing'
                    className='h-[500px] w-auto object-contain'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            {/* Listing Status Indicator */}
            {listing.status && (
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                listing.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : listing.status === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  listing.status === 'approved' 
                    ? 'bg-green-500' 
                    : listing.status === 'rejected' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
                }`}></span>
                Status: {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                {listing.status === 'rejected' && listing.adminNotes && (
                  <span className='ml-2 text-xs opacity-75'>
                    (Reason: {listing.adminNotes})
                  </span>
                )}
              </div>
            )}
            
            <p className='text-2xl font-semibold'>
              {listing.name}
            </p>
            
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
            </div>

            {/* Price Information */}
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
              <h3 className='text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2'>
                <FaRupeeSign className='text-blue-600' />
                Price Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <FaRupeeSign className='text-green-600' />
                  <span className='font-medium'>Price per sq ft:</span>
                  <span className='text-lg font-semibold text-green-700'>
                    ₹{listing.pricePerSqft?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaRupeeSign className='text-blue-600' />
                  <span className='font-medium'>Total Price:</span>
                  <span className='text-lg font-semibold text-blue-700'>
                    ₹{listing.totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
            
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            
            {/* Property Details */}
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                <FaHome className='text-gray-600' />
                Property Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <FaUser className='text-lg text-green-600' />
                    <span className='font-medium'>Owner Type:</span>
                    <span className='capitalize text-green-700'>{listing.ownerType}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaRuler className='text-lg text-blue-600' />
                    <span className='font-medium'>Plot Area:</span>
                    <span className='text-blue-700'>{listing.plotArea?.toLocaleString('en-IN')} sq ft</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaTag className='text-lg text-purple-600' />
                    <span className='font-medium'>Listing Type:</span>
                    <span className='capitalize text-purple-700'>{listing.type}</span>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <FaShieldAlt className='text-lg text-orange-600' />
                    <span className='font-medium'>Boundary Wall:</span>
                    <span className={listing.boundaryWall ? 'text-green-700' : 'text-red-700'}>
                      {listing.boundaryWall ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {listing.latitude && listing.longitude && (
                    <div className='flex items-center gap-2'>
                      <FaGlobe className='text-lg text-purple-600' />
                      <span className='font-medium'>Coordinates:</span>
                      <span className='text-xs text-purple-700'>
                        {listing.latitude.toFixed(6)}, {listing.longitude.toFixed(6)}
                      </span>
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <FaMapMarkerAlt className='text-lg text-red-600' />
                    <span className='font-medium'>Location:</span>
                    <span className='text-red-700 text-sm'>{listing.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Transport */}
            <div className='bg-white p-4 rounded-lg border'>
              <h3 className='text-lg font-semibold mb-2'>Nearby Transport (within 300m)</h3>
              <NearbyTransport latitude={listing.latitude} longitude={listing.longitude} radius={300} />
            </div>

            {/* Additional Information */}
            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <h3 className='text-lg font-semibold text-green-800 mb-3'>Quick Summary</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
                <div className='bg-white p-3 rounded-lg shadow-sm'>
                  <div className='text-2xl font-bold text-blue-600'>{listing.plotArea?.toLocaleString('en-IN')}</div>
                  <div className='text-sm text-gray-600'>Square Feet</div>
                </div>
                <div className='bg-white p-3 rounded-lg shadow-sm'>
                  <div className='text-2xl font-bold text-green-600'>₹{listing.pricePerSqft?.toLocaleString('en-IN')}</div>
                  <div className='text-sm text-gray-600'>Per Sq Ft</div>
                </div>
                <div className='bg-white p-3 rounded-lg shadow-sm'>
                  <div className='text-2xl font-bold text-purple-600'>₹{listing.totalPrice?.toLocaleString('en-IN')}</div>
                  <div className='text-sm text-gray-600'>Total Price</div>
                </div>
              </div>
            </div>
            
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact Seller
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
