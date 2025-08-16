import React, { useState, useEffect } from 'react';
import { FaThermometerHalf, FaLeaf, FaCloudSun, FaTint, FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';

const SoilClimateData = ({ listingId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSoilClimateData();
  }, [listingId]);

  const fetchSoilClimateData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/soil-climate/${listingId}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center text-red-600">
          <FaCloudSun className="text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Data Unavailable</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchSoilClimateData}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

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
              <img 
                src={`http://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={day.description}
                className="w-12 h-12 mx-auto mb-2"
              />
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
            Data sourced from OpenWeatherMap and SoilGrids APIs
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoilClimateData;
