import React, { useState, useEffect } from 'react';
import { FaThermometerHalf, FaLeaf, FaCloudSun, FaTint, FaChartLine, FaMapMarkerAlt, FaHandshake, FaGlobe, FaChartLine as FaChartLineIcon, FaRedo, FaExclamationTriangle } from 'react-icons/fa';
import CoordinatePicker from '../components/CoordinatePicker';
import PropertySearch from '../components/PropertySearch';

const SoilClimateDemo = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: 20.5937, lon: 78.9629 });
  const [soilClimateData, setSoilClimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState('demo');

  // Fetch soil and climate data when coordinates change
  useEffect(() => {
    if (selectedCoordinates.lat && selectedCoordinates.lon) {
      fetchSoilClimateData();
    }
  }, [selectedCoordinates]);

  const fetchSoilClimateData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/soil-climate/demo`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSoilClimateData(result.data);
        setDataSource(result.data.dataSource || 'demo');
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching soil climate data:', error);
      setError('Failed to fetch soil and climate data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setSelectedCoordinates(newCoordinates);
  };

  const handleRefresh = () => {
    fetchSoilClimateData();
  };

  // Use fetched data or fallback to sample data
  const data = soilClimateData || {
    weather: {
      current: { temp: 28, humidity: 65, description: 'Partly cloudy' },
      forecast: [
        { date: '2024-01-15', temp: 28, description: 'Partly cloudy', icon: '02d', rain: 0 },
        { date: '2024-01-16', temp: 26, description: 'Light rain', icon: '10d', rain: 2.5 },
        { date: '2024-01-17', temp: 27, description: 'Clear', icon: '01d', rain: 0 },
        { date: '2024-01-18', temp: 29, description: 'Sunny', icon: '01d', rain: 0 },
        { date: '2024-01-19', temp: 25, description: 'Cloudy', icon: '03d', rain: 0 },
        { date: '2024-01-20', temp: 24, description: 'Rain', icon: '09d', rain: 8.0 },
        { date: '2024-01-21', temp: 26, description: 'Partly cloudy', icon: '02d', rain: 1.0 }
      ],
      tempVariation: 5,
      rainfall: 11.5
    },
    soil: {
      ph: 6.8,
      organicMatter: 2.5,
      clay: 25,
      silt: 35,
      sand: 40,
      moisture: 28,
      slope: 5,
      texture: 'Loamy'
    },
    bhumiScore: 85,
    recommendations: {
      crops: ['Rice', 'Wheat', 'Vegetables'],
      construction: 'Excellent for construction - flat terrain with good soil stability',
      general: 'Premium land with excellent agricultural and construction potential'
    },
    coordinates: { lat: 20.5937, lon: 78.9629 }
  };

  const { weather, soil, bhumiScore, recommendations, coordinates } = data;

  // Bhumi Score color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            🌱 Soil & Climate Intelligence Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Experience BHUMI's revolutionary land intelligence platform. See how we combine real-time soil data, 
            weather forecasts, and environmental analysis to help you make informed land decisions.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Coordinate Picker */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📍 Location Information
            </h2>
            <CoordinatePicker 
              onCoordinatesChange={handleCoordinatesChange}
              initialCoordinates={selectedCoordinates}
            />
          </div>

          {/* Current Selection Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Selected Location</h3>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FaRedo className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">Latitude</div>
                <div className="text-lg font-mono text-gray-800">{selectedCoordinates.lat.toFixed(4)}°</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Longitude</div>
                <div className="text-lg font-mono text-gray-800">{selectedCoordinates.lon.toFixed(4)}°</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600">Data Source</div>
                <div className="text-lg text-gray-800 capitalize">{dataSource}</div>
              </div>
            </div>
            
            {/* Data Source Indicator */}
            {dataSource === 'real' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-700">
                  <FaChartLine className="mr-2" />
                  <span className="text-sm font-medium">Real-time data from APIs</span>
                </div>
              </div>
            )}
            
            {dataSource === 'demo' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center text-yellow-700">
                  <FaExclamationTriangle className="mr-2" />
                  <span className="text-sm font-medium">Demo data (APIs not configured)</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Soil & Climate Data Display */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🌡️ Live Environmental Data {dataSource === 'real' ? '(Real-time)' : '(Demo)'}
          </h2>
          
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🌱 Soil & Climate Intelligence</h2>
                  <p className="text-green-100">Real-time environmental data for informed land decisions</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(bhumiScore)}`}>
                    {bhumiScore}
                  </div>
                  <div className="text-green-100 text-sm">Bhumi Score</div>
                </div>
              </div>
            </div>

            {/* Bhumi Score Gauge */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaChartLine className="mr-2 text-green-600" />
                Bhumi Suitability Score
              </h3>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(bhumiScore)} mb-4`}>
                  <span className={`text-3xl font-bold ${getScoreColor(bhumiScore)}`}>{bhumiScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      bhumiScore >= 80 ? 'bg-green-500' : 
                      bhumiScore >= 60 ? 'bg-yellow-500' : 
                      bhumiScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${bhumiScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {bhumiScore >= 80 ? 'Excellent' : 
                   bhumiScore >= 60 ? 'Good' : 
                   bhumiScore >= 40 ? 'Moderate' : 'Limited'} suitability
                </p>
              </div>
            </div>

            {/* Soil Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaLeaf className="mr-2 text-green-600" />
                Soil Quality Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Soil Type</span>
                    <span className="font-semibold text-gray-800">{soil.texture}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">pH Level</span>
                    <span className={`font-semibold ${
                      soil.ph >= 6.0 && soil.ph <= 7.5 ? 'text-green-600' : 
                      soil.ph >= 5.5 && soil.ph <= 8.0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {soil.ph.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Organic Matter</span>
                    <span className="font-semibold text-gray-800">{soil.organicMatter.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Moisture Level</span>
                    <span className="font-semibold text-gray-800">{soil.moisture.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Slope</span>
                    <span className="font-semibold text-gray-800">{soil.slope.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Composition</span>
                    <span className="font-semibold text-gray-800">
                      Clay: {soil.clay.toFixed(0)}% | Silt: {soil.silt.toFixed(0)}% | Sand: {soil.sand.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaThermometerHalf className="mr-2 text-green-600" />
                7-Day Weather Forecast
              </h3>
              <div className="grid grid-cols-7 gap-3">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaCloudSun className="text-gray-600 text-xl" />
                    </div>
                    <div className="font-semibold text-gray-800">{Math.round(day.temp)}°C</div>
                    <div className="text-xs text-gray-600">{day.description}</div>
                    {day.rain > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        <FaTint className="inline mr-1" />
                        {day.rain.toFixed(1)}mm
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Weather */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCloudSun className="mr-2 text-green-600" />
                Current Conditions
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FaThermometerHalf className="text-3xl text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{Math.round(weather.current.temp)}°C</div>
                  <div className="text-blue-600">Temperature</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FaTint className="text-3xl text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800">{weather.current.humidity}%</div>
                  <div className="text-green-600">Humidity</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <FaCloudSun className="text-3xl text-yellow-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-yellow-800 capitalize">{weather.current.description}</div>
                  <div className="text-yellow-600">Condition</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaLeaf className="mr-2 text-green-600" />
                Land Use Recommendations
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-green-600">🌾 Agricultural Recommendations</h4>
                  <div className="space-y-2">
                    {recommendations.crops.map((crop, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{crop}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-blue-600">🏗️ Construction Assessment</h4>
                  <p className="text-gray-700 p-3 bg-blue-50 rounded-lg">
                    {recommendations.construction}
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💡 General Assessment</h4>
                <p className="text-gray-700">{recommendations.general}</p>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Location Coordinates
              </h3>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-mono text-gray-800">
                  Latitude: {coordinates.lat.toFixed(4)}° | Longitude: {coordinates.lon.toFixed(4)}°
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {dataSource === 'real' 
                    ? 'Data sourced from OpenWeatherMap and SoilGrids APIs'
                    : 'Demo data for demonstration purposes'
                  }
                </p>
                {soilClimateData?.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(soilClimateData.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property-Level Precision Demo */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🏠 Property-Level Precision: Beyond City-Level Generalizations
          </h2>
          <p className="text-xl text-gray-600 text-center mb-8 max-w-4xl mx-auto">
            See how BHUMI provides individual property analysis instead of city-level generalizations. 
            Each land parcel gets its own unique Bhumi Score and recommendations.
          </p>
          
          <PropertySearch />
        </div>

        {/* Feature Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why This Feature Makes BHUMI Revolutionary
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">First in India</h3>
              <p className="text-gray-600">
                BHUMI is the first land platform in India to combine real estate with environmental intelligence
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Scientific Approach</h3>
              <p className="text-gray-600">
                Uses real scientific data from global APIs, not just estimates or assumptions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Decisions</h3>
              <p className="text-gray-600">
                Buyers can make informed decisions about land suitability for their specific needs
              </p>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">🔌 Powered by Global APIs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">OpenWeatherMap API</h3>
              <ul className="space-y-2 text-green-100">
                <li>• Real-time weather data</li>
                <li>• 7-day forecast predictions</li>
                <li>• Temperature and humidity monitoring</li>
                <li>• Rainfall predictions</li>
                <li>• Global coverage</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">SoilGrids API (ISRIC)</h3>
              <ul className="space-y-2 text-green-100">
                <li>• Soil composition analysis</li>
                <li>• pH levels and organic matter</li>
                <li>• Clay, silt, and sand percentages</li>
                <li>• Soil texture classification</li>
                <li>• Scientific soil mapping</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-green-100 mb-4">
              All data is fetched in real-time and processed using our proprietary Bhumi Score algorithm
            </p>
            <div className="inline-block bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <span className="font-semibold">100% Free for Users</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Experience the Future of Land Intelligence?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are already making smarter land decisions with BHUMI's 
            environmental intelligence platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg">
              Get Started with BHUMI
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-600 hover:text-white transition-colors font-semibold text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilClimateDemo;
