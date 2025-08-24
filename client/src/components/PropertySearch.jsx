import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaSort, FaEye, FaChartLine } from 'react-icons/fa';

const PropertySearch = () => {
  const [searchCity, setSearchCity] = useState('Udupi');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 100,
    minPrice: 0,
    maxPrice: 10000000,
    features: []
  });

  // Sample properties for demo (replace with API call)
  const sampleProperties = [
    {
      id: 'UDU001',
      title: 'Premium Agricultural Land - Udupi',
      address: 'Plot 123, Near Udupi Temple, Udupi',
      coordinates: { lat: 13.3409, lon: 74.7421 },
      area: { value: 2.5, unit: 'acres' },
      price: { value: 2500000, currency: 'INR' },
      analysis: {
        status: 'Analysis Complete',
        bhumiScore: 85,
        category: 'Excellent',
        bestFor: ['Rice', 'Wheat', 'Vegetables'],
        constructionSuitability: 'Excellent for construction - flat terrain with good soil stability'
      },
      images: ['udupi_land_1.jpg']
    },
    {
      id: 'UDU002',
      title: 'Mixed Use Land - Udupi City',
      address: 'Plot 124, Near Railway Station, Udupi',
      coordinates: { lat: 13.3410, lon: 74.7422 },
      area: { value: 1.8, unit: 'acres' },
      price: { value: 1800000, currency: 'INR' },
      analysis: {
        status: 'Analysis Complete',
        bhumiScore: 72,
        category: 'Good',
        bestFor: ['Millets', 'Pulses', 'Oilseeds'],
        constructionSuitability: 'Good for construction - moderate slope, may require some grading'
      },
      images: ['udupi_land_3.jpg']
    },
    {
      id: 'UDU003',
      title: 'Tea Estate Land - Udupi Hills',
      address: 'Plot 125, Udupi Hills, Udupi',
      coordinates: { lat: 13.3415, lon: 74.7425 },
      area: { value: 3.2, unit: 'acres' },
      price: { value: 3200000, currency: 'INR' },
      analysis: {
        status: 'Analysis Complete',
        bhumiScore: 58,
        category: 'Moderate',
        bestFor: ['Tea', 'Coffee', 'Citrus fruits'],
        constructionSuitability: 'Challenging for construction - steep slope, requires significant engineering'
      },
      images: ['udupi_land_5.jpg']
    },
    {
      id: 'UDU004',
      title: 'Commercial Land - Udupi Market',
      address: 'Plot 126, Udupi Market Area, Udupi',
      coordinates: { lat: 13.3420, lon: 74.7428 },
      area: { value: 0.8, unit: 'acres' },
      price: { value: 1200000, currency: 'INR' },
      analysis: {
        status: 'Analysis Complete',
        bhumiScore: 78,
        category: 'Good',
        bestFor: ['Cotton', 'Sugarcane', 'Barley'],
        constructionSuitability: 'Excellent for construction - flat terrain with good soil stability'
      },
      images: ['udupi_land_7.jpg']
    }
  ];

  useEffect(() => {
    // Load sample properties (replace with API call)
    setProperties(sampleProperties);
  }, []);

  const searchProperties = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In production, this would call the API
      // const response = await fetch(`/api/soil-climate/area/${searchCity}?minScore=${filters.minScore}&maxScore=${filters.maxScore}`);
      // const data = await response.json();
      // setProperties(data.data.properties);
      
      // For demo, filter sample properties
      const filtered = sampleProperties.filter(prop => {
        const score = prop.analysis.bhumiScore;
        const price = prop.price.value;
        return score >= filters.minScore && 
               score <= filters.maxScore && 
               price >= filters.minPrice && 
               price <= filters.maxPrice;
      });
      
      setProperties(filtered);
    } catch (error) {
      setError('Failed to search properties');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🏠 Property Search with Transport Intelligence
        </h1>
        <p className="text-xl text-gray-600">
          Find properties in {searchCity} with detailed transport connectivity analysis and Transport Scores
        </p>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Transport Score</label>
            <input
              type="number"
              value={filters.minScore}
              onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Transport Score</label>
            <input
              type="number"
              value={filters.maxScore}
              onChange={(e) => setFilters({...filters, maxScore: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000000"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={searchProperties}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FaSearch className="mr-2" />
            {loading ? 'Searching...' : 'Search Properties'}
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Properties in {searchCity}
        </h2>
        <div className="text-gray-600">
          Found {properties.length} properties
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Property Image */}
            <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
              <FaMapMarkerAlt className="text-4xl text-green-600" />
            </div>
            
            {/* Property Details */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {property.title}
              </h3>
              
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-green-600" />
                  {property.address}
                </div>
                <div className="flex justify-between">
                  <span>{property.area.value} {property.area.unit}</span>
                  <span className="font-semibold">{formatPrice(property.price.value)}</span>
                </div>
              </div>

              {/* Bhumi Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Bhumi Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(property.analysis.bhumiScore)}`}>
                    {property.analysis.bhumiScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      property.analysis.bhumiScore >= 80 ? 'bg-green-500' : 
                      property.analysis.bhumiScore >= 60 ? 'bg-blue-500' : 
                      property.analysis.bhumiScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${property.analysis.bhumiScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {property.analysis.category} suitability
                </p>
              </div>

              {/* Best For */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Best For:</h4>
                <div className="flex flex-wrap gap-1">
                  {property.analysis.bestFor.map((crop, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Construction Assessment */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Construction:</h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {property.analysis.constructionSuitability}
                </p>
              </div>

              {/* Coordinates */}
              <div className="text-xs text-gray-500 mb-4">
                📍 {property.coordinates.lat.toFixed(6)}, {property.coordinates.lon.toFixed(6)}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  <FaEye className="inline mr-1" />
                  View Details
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <FaChartLine className="inline mr-1" />
                  Full Analysis
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {properties.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching properties...</p>
        </div>
      )}
    </div>
  );
};

export default PropertySearch;
