import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

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
              {listing.name} - Rs{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Rs{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
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






























// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper';
// import { useSelector } from 'react-redux';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css/bundle';

// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkedAlt,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from 'react-icons/fa';
// import Contact from '../components/Contact';



// export default function Listing() {
//   SwiperCore.use([Navigation]);
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false);
//   const params = useParams();
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchListing();
//   }, [params.listingId]);

//   return (
//     <main>
//       {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
//       {error && (
//         <p className='text-center my-7 text-2xl'>Something went wrong!</p>
//       )}
//       {listing && !loading && !error && (
//         <div>
//          <Swiper navigation>
//   {/* {listing.imageUrls.map((url) => (
//     <SwiperSlide key={url}>
//       <div className=' mt-10 flex items-center justify-center'>
//         <img
//           src={url}
//           alt='listing'
//           className='h-[500px] w-auto object-contain'
//         />
//       </div>
//     </SwiperSlide>
//   ))} */}

// {listing.imageUrls.map((filename) => (
//   <SwiperSlide key={filename}>
//     <div className='mt-10 flex items-center justify-center'>
//       <img
//         src={`http://localhost:3000/uploads/${filename}`}
//         alt='listing'
//         className='h-[500px] w-auto object-contain'
//       />
//     </div>
//   </SwiperSlide>
// ))}


// </Swiper>
//           <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
//             <FaShare
//               className='text-slate-500'
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setCopied(true);
//                 setTimeout(() => {
//                   setCopied(false);
//                 }, 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
//               Link copied!
//             </p>
//           )}
//           <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
//             <p className='text-2xl font-semibold'>
//               {listing.name} - Rs{' '}
//               {listing.offer
//                 ? listing.discountPrice.toLocaleString('en-US')
//                 : listing.regularPrice.toLocaleString('en-US')}
//               {listing.type === 'rent' && ' / month'}
//             </p>
//             <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
//               <FaMapMarkerAlt className='text-green-700' />
//               {listing.address}
//             </p>
//             <div className='flex gap-4'>
//               <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
//                 {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
//               </p>
//               {listing.offer && (
//                 <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
//                   Rs{+listing.regularPrice - +listing.discountPrice} OFF
//                 </p>
//               )}
//             </div>
//             <p className='text-slate-800'>
//               <span className='font-semibold text-black'>Description - </span>
//               {listing.description}
//             </p>
//             <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaBed className='text-lg' />
//                 {listing.bedrooms > 1
//                   ? `${listing.bedrooms} beds `
//                   : `${listing.bedrooms} bed `}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaBath className='text-lg' />
//                 {listing.bathrooms > 1
//                   ? `${listing.bathrooms} baths `
//                   : `${listing.bathrooms} bath `}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaParking className='text-lg' />
//                 {listing.parking ? 'Parking spot' : 'No Parking'}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaChair className='text-lg' />
//                 {listing.furnished ? 'Furnished' : 'Unfurnished'}
//               </li>
//             </ul>
//             {currentUser && listing.userRef !== currentUser._id && !contact && (
//               <button
//                 onClick={() => setContact(true)}
//                 className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
//               >
//                 Contact Seller
//               </button>
//             )}
//             {contact && <Contact listing={listing} />}
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
