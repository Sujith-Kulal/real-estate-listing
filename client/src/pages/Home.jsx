import { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaHandshake, FaGlobe, FaChartLine, FaThermometerHalf, FaLeaf, FaCloudSun, FaRoad, FaBus, FaPlane } from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  SwiperCore.use([Navigation]);
  
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=4&sort=createdAt&order=desc');
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
 
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-700/20"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            Secure and Transparent <br />
            <span className="text-green-200">Land Exchange</span> System
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            BHUMI HUB revolutionizes land transactions with blockchain technology, ensuring transparency, security, and efficiency in every deal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              to="/search"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-green-800 font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore Lands
            </Link>
          </div>
          
          {/* Quality Assurance Note */}
          <div className="mt-8 text-center">
            <p className="text-green-100 text-sm opacity-90">
              ✨ All listings are quality-checked and approved by our admin team for your safety
            </p>
          </div>
        </div>
      </section>

             {/* Features Section */}
       <section className="py-20 bg-white">
         <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose BHUMI?</h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               We provide cutting-edge solutions for secure, transparent, and efficient land transactions
             </p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             
             
             <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FaHandshake className="text-3xl text-green-600" />
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparent Process</h3>
               <p className="text-gray-600">Complete visibility into every step of the transaction</p>
             </div>
             
             <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FaGlobe className="text-3xl text-green-600" />
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">Global Reach</h3>
               <p className="text-gray-600">Connect with buyers and sellers worldwide</p>
             </div>
             
             <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FaChartLine className="text-3xl text-green-600" />
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">Market Insights</h3>
               <p className="text-gray-600">Real-time data and analytics for informed decisions</p>
             </div>
           </div>
         </div>
       </section>

       {/* Transport Intelligence Section */}
       <section className="py-20 bg-gray-50">
         <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-gray-800 mb-4">Transport Intelligence</h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Discover nearby transport facilities including highways, bus stands, railway stations, and airports for every property location.
             </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FaRoad className="text-3xl text-blue-600" />
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Highway & Road Access</h3>
               <p className="text-gray-600 text-center mb-4">
                 Find properties with easy access to major highways and primary roads
               </p>
               <ul className="text-sm text-gray-500 space-y-2">
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                   Major highway proximity
                 </li>
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                   Primary road connectivity
                 </li>
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                   Distance-based scoring
                 </li>
               </ul>
             </div>
             
             <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FaBus className="text-3xl text-green-600" />
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Public Transport</h3>
               <p className="text-gray-600 text-center mb-4">
                 Locate properties near bus stands, railway stations, and metro stops
               </p>
               <ul className="text-sm text-gray-500 space-y-2">
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                   Bus stand accessibility
                 </li>
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                   Railway station proximity
                 </li>
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                   Metro connectivity
                 </li>
               </ul>
             </div>
             
             <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FaPlane className="text-3xl text-purple-600" />
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Airport Connectivity</h3>
               <p className="text-gray-600 text-center mb-4">
                 Find properties with easy access to airports and air travel facilities
               </p>
               <ul className="text-sm text-gray-500 space-y-2">
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                   Airport proximity
                 </li>
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                   Travel convenience
                 </li>
                 <li className="flex items-center">
                   <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                   Long-distance connectivity
                 </li>
               </ul>
             </div>
           </div>
           
           <div className="text-center mt-12">
             <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white max-w-4xl mx-auto">
               <h3 className="text-2xl font-bold mb-4">Powered by OpenStreetMap</h3>
               <p className="text-blue-100 mb-6">
                 Our platform integrates with OpenStreetMap to provide real-time transport facility data for every property location.
               </p>
               <div className="grid md:grid-cols-3 gap-6 text-center">
                 <div>
                   <div className="text-3xl font-bold text-blue-200">Real-time</div>
                   <div className="text-blue-100">Data Updates</div>
                 </div>
                 <div>
                   <div className="text-3xl font-bold text-blue-200">100%</div>
                   <div className="text-blue-100">Free Access</div>
                 </div>
                 <div>
                   <div className="text-3xl font-bold text-blue-200">Global</div>
                   <div className="text-blue-100">Coverage</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>

      {/* About Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">About BHUMI</h2>
              <p className="text-lg text-gray-600 mb-6">
                BHUMI HUB is a revolutionary land exchange platform that leverages cutting-edge blockchain technology to transform the traditional land marketplace. We provide a secure, transparent, and efficient platform for managing land listings and connecting genuine landowners with serious buyers.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our mission is to democratize land ownership by making the transaction process accessible, secure, and transparent for everyone involved.
              </p>
              <Link
                to="/about"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                Learn More
              </Link>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-green-100 mb-6">
                To create the world's most trusted and efficient land exchange platform, where every transaction is secure, transparent, and beneficial for all parties involved.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-green-100">Successful Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-green-100">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Offers Section */}
      {offerListings && offerListings.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Listings</h2>
              <p className="text-xl text-gray-600">Discover our latest premium land offerings</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/search?offer=true"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                View All Listings
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their land transactions with BHUMI. Get in touch with our team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              Contact Us
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
}
