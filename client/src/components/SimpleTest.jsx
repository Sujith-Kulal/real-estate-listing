import React from 'react';

export default function SimpleTest() {
  return (
    <div className="p-8 bg-blue-100 rounded-lg">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">
        ✅ Simple Test Component Working!
      </h1>
      <p className="text-blue-700">
        If you can see this, React is rendering correctly and the issue is likely in the Smart Recommendation components.
      </p>
      <div className="mt-4 p-4 bg-white rounded border">
        <h2 className="font-semibold mb-2">Test Status:</h2>
        <ul className="text-sm space-y-1">
          <li>✅ React rendering: Working</li>
          <li>✅ Tailwind CSS: Working</li>
          <li>✅ Component structure: Working</li>
        </ul>
      </div>
    </div>
  );
}
