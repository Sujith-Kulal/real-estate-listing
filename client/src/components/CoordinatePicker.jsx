import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSearch, FaCrosshairs } from 'react-icons/fa';

const CoordinatePicker = ({ onCoordinatesChange, initialCoordinates = null }) => {
  const [coordinates, setCoordinates] = useState(
    initialCoordinates || { lat: 20.5937, lon: 78.9629 }
  );
  const [searchAddress, setSearchAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle coordinate input changes
  const handleCoordinateChange = (field, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newCoordinates = { ...coordinates, [field]: numValue };
    setCoordinates(newCoordinates);
    onCoordinatesChange(newCoordinates);
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setCoordinates(newCoordinates);
        onCoordinatesChange(newCoordinates);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your current location. Please enter coordinates manually.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Search for coordinates by address (using a free geocoding service)
  const searchByAddress = async () => {
    if (!searchAddress.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Using OpenStreetMap Nominatim API (free, no key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Address search failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newCoordinates = {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon)
        };
        setCoordinates(newCoordinates);
        onCoordinatesChange(newCoordinates);
        setSearchAddress('');
      } else {
        setError('Address not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Address search error:', error);
      setError('Failed to search for address. Please enter coordinates manually.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchByAddress();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-green-600" />
        Location Coordinates
      </h3>

      {/* Coordinate Inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="0.0001"
            value={coordinates.lat}
            onChange={(e) => handleCoordinateChange('lat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 20.5937"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="0.0001"
            value={coordinates.lon}
            onChange={(e) => handleCoordinateChange('lon', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 78.9629"
          />
        </div>
      </div>

      {/* Current Location Button */}
      <div className="mb-6">
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <FaCrosshairs className="mr-2" />
          {isLoading ? 'Getting Location...' : 'Use Current Location'}
        </button>
      </div>

      {/* Address Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search by Address
        </label>
        <div className="flex">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Enter city, address, or landmark..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={searchByAddress}
            disabled={isLoading || !searchAddress.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Current Coordinates Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Current Selection:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Latitude:</span>
            <span className="ml-2 font-mono text-gray-800">
              {coordinates.lat.toFixed(6)}°
            </span>
          </div>
          <div>
            <span className="text-gray-600">Longitude:</span>
            <span className="ml-2 font-mono text-gray-800">
              {coordinates.lon.toFixed(6)}°
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 How to use:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Enter coordinates manually for precise location</li>
          <li>• Use "Current Location" to get your GPS coordinates</li>
          <li>• Search by address to find coordinates automatically</li>
          <li>• Coordinates will be used to analyze nearby transport facilities</li>
        </ul>
      </div>
    </div>
  );
};

export default CoordinatePicker;
