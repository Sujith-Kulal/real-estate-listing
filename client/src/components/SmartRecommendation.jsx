import { useState } from 'react';

export default function SmartRecommendation({ listing }) {
  const [transitScore, setTransitScore] = useState(6.2);
  const [livabilityScore, setLivabilityScore] = useState(8.5);
  const [loading, setLoading] = useState(false);

  // Simple mock data for testing
  const transitDetails = [
    { name: 'Kittaganuru Bus Stop', distance: '3.4 km', time: '10 mins', type: 'bus' },
    { name: 'K R Puram Bus Depot', distance: '3.0 km', time: '9 mins', type: 'bus' },
    { name: 'Hiranandahalli Bus Stop', distance: '5.5 km', time: '10 mins', type: 'bus' }
  ];

  const livabilityDetails = [
    { name: 'City Market', distance: '2.1 km', type: 'shopping' },
    { name: 'Apollo Hospital', distance: '4.5 km', type: 'hospital' },
    { name: 'St. Joseph School', distance: '1.8 km', type: 'school' }
  ];

  const overallScore = 7.4;
  const overallGrade = 'B+';

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-100 border-green-500';
    if (score >= 6) return 'bg-yellow-100 border-yellow-500';
    return 'bg-red-100 border-red-500';
  };

  const getScoreTextColor = (score) => {
    if (score >= 8) return 'text-green-700';
    if (score >= 6) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'hospital': return '🏥';
      case 'school': return '🏫';
      case 'shopping': return '🛒';
      case 'restaurant': return '🍽️';
      case 'park': return '🌳';
      case 'bank': return '🏦';
      default: return '🚗';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-20 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-red-500 pb-2">
          Description
        </h3>
        
        {/* Smart Recommendation Section */}
        <div className="text-right">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Smart Recommendation</h4>
          <div className="flex gap-4">
            {/* Transit Score */}
            <div className={`${getScoreBgColor(transitScore)} border-2 rounded-lg p-3 text-center min-w-[80px]`}>
              <div className="text-white text-xl mx-auto mb-1">🌿</div>
              <div className="bg-white rounded px-2 py-1">
                <span className={`text-lg font-bold ${getScoreTextColor(transitScore)}`}>
                  {transitScore}
                </span>
              </div>
            </div>
            
            {/* Livability Score */}
            <div className={`${getScoreBgColor(livabilityScore)} border-2 rounded-lg p-3 text-center min-w-[80px]`}>
              <div className="text-white text-xl mx-auto mb-1">🚗</div>
              <div className="bg-white rounded px-2 py-1">
                <span className={`text-lg font-bold ${getScoreTextColor(livabilityScore)}`}>
                  {livabilityScore}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Powered By: Smart Recommendation</p>
        </div>
      </div>

      {/* Description Content */}
      <div className="text-gray-700 leading-relaxed mb-6">
        {listing?.description || 'Property description will appear here.'}
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-blue-800">Overall Property Score</h5>
            <p className="text-sm text-blue-600">Combined transit and livability assessment</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">{overallScore}/10</div>
            <div className="text-lg font-semibold text-blue-600">Grade: {overallGrade}</div>
          </div>
        </div>
      </div>

      {/* Detailed Scores Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Transit Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🚌 Transit Score: {transitScore}/10
          </h5>
          <div className="space-y-2">
            {transitDetails.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getIconForType(item.type)}
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <div className="text-gray-600">
                  {item.distance} | {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Livability Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🌿 Livability Score: {livabilityScore}/10
          </h5>
          <div className="space-y-2">
            {livabilityDetails.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getIconForType(item.type)}
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <div className="text-gray-600">
                  {item.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h6 className="font-semibold text-blue-800 mb-2">How are these scores calculated?</h6>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Transit Score:</strong> Based on proximity to bus stops, train stations, metro stations, and travel time to major transit hubs.</p>
          <p><strong>Livability Score:</strong> Based on nearby amenities like hospitals, schools, markets, restaurants, and recreational facilities.</p>
          <p><strong>Overall Score:</strong> Combined assessment of both transit accessibility and neighborhood livability.</p>
        </div>
      </div>
    </div>
  );
}
