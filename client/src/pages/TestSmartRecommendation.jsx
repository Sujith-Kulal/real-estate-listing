import React from 'react';
import SimpleTest from '../components/SimpleTest';
import SmartRecommendation from '../components/SmartRecommendation';
import CoordinatePicker from '../components/CoordinatePicker';

export default function TestSmartRecommendation() {
  const testListing = {
    name: 'Test Property',
    description: 'This is a test property to verify the Smart Recommendation system is working correctly.',
    coordinates: { latitude: 12.9716, longitude: 77.5946 }
  };

  const handleCoordinatesChange = (coordinates) => {
    console.log('Coordinates changed:', coordinates);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Smart Recommendation System Test
        </h1>
        
        <div className="space-y-8">
          {/* Simple Test Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Test 0: Simple Test Component
            </h2>
            <SimpleTest />
          </div>

          {/* Test SmartRecommendation Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Test 1: SmartRecommendation Component
            </h2>
            <SmartRecommendation listing={testListing} />
          </div>

          {/* Test CoordinatePicker Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Test 2: CoordinatePicker Component
            </h2>
            <CoordinatePicker 
              onCoordinatesChange={handleCoordinatesChange}
              initialCoordinates={{ latitude: 12.9716, longitude: 77.5946 }}
            />
          </div>

          {/* Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ Test Page Loaded Successfully
            </h3>
            <p className="text-green-700">
              If you can see this page and the components above, the basic Smart Recommendation system is working!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
