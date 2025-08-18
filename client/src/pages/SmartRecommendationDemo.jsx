import { useState } from 'react';
import SmartRecommendation from '../components/SmartRecommendation';

export default function SmartRecommendationDemo() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const sampleProperties = [
    {
      _id: '1',
      name: 'Luxury Villa in Whitefield',
      description: 'Beautiful 4BHK villa with modern amenities, located in the heart of Whitefield. Perfect for families looking for luxury living with excellent connectivity.',
      address: 'Whitefield, Bangalore, Karnataka',
      city: 'Bangalore',
      area: 'Whitefield',
      coordinates: { latitude: 12.9692, longitude: 77.7499 },
      regularPrice: 25000000,
      type: 'sale',
      bedrooms: 4,
      bathrooms: 3,
      parking: true,
      furnished: true,
      imageUrls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500']
    },
    {
      _id: '2',
      name: 'Modern Apartment in Koramangala',
      description: 'Contemporary 2BHK apartment in Koramangala with all modern facilities. Great investment opportunity with high rental yield.',
      address: 'Koramangala, Bangalore, Karnataka',
      city: 'Bangalore',
      area: 'Koramangala',
      coordinates: { latitude: 12.9349, longitude: 77.6055 },
      regularPrice: 8500000,
      type: 'sale',
      bedrooms: 2,
      bathrooms: 2,
      parking: true,
      furnished: false,
      imageUrls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500']
    },
    {
      _id: '3',
      name: 'Cozy Studio in Indiranagar',
      description: 'Compact studio apartment perfect for young professionals. Located in the trendy Indiranagar area with great nightlife and restaurants.',
      address: 'Indiranagar, Bangalore, Karnataka',
      city: 'Bangalore',
      area: 'Indiranagar',
      coordinates: { latitude: 12.9789, longitude: 77.5917 },
      regularPrice: 4500000,
      type: 'sale',
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      furnished: true,
      imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Smart Recommendation System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience BHUMI's advanced property scoring system that provides Transit Score and Livability Score 
            to help you make informed real estate decisions.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            How Smart Recommendation Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                📍
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Location Analysis</h3>
              <p className="text-gray-600">
                Our system analyzes the exact coordinates of your property to understand its geographical context.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                🌿
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Score Calculation</h3>
              <p className="text-gray-600">
                We calculate Transit Score and Livability Score based on proximity to amenities and transit options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                ⭐
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Smart Insights</h3>
              <p className="text-gray-600">
                Get detailed breakdowns and recommendations to make the best property decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Properties */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Sample Properties with Smart Scores
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sampleProperties.map((property) => (
              <div 
                key={property._id}
                className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedProperty?._id === property._id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <img 
                  src={property.imageUrls[0]} 
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{property.bedrooms} Beds • {property.bedrooms} Baths</span>
                    <span className="font-semibold text-green-600">
                      Rs. {property.regularPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    📍
                    <span>{property.area}, {property.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendation Display */}
        {selectedProperty && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Smart Recommendation for: {selectedProperty.name}
            </h2>
            <SmartRecommendation listing={selectedProperty} />
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Why Choose Smart Recommendation?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">For Buyers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Make informed decisions based on data-driven scores</li>
                <li>• Understand neighborhood livability and connectivity</li>
                <li>• Compare properties objectively</li>
                <li>• Save time in property research</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">For Sellers</h3>
              <ul className="text-gray-600">
                <li>• Showcase your property's advantages</li>
                <li>• Increase buyer confidence with transparency</li>
                <li>• Highlight neighborhood benefits</li>
                <li>• Stand out from competitors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to Experience Smart Recommendations?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your property listing with coordinates and get instant Smart Recommendation scores!
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Create Listing
          </button>
        </div>
      </div>
    </div>
  );
}
