
import { useState, useEffect, useRef } from 'react';
import NearbyTransport from '../components/NearbyTransport';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    ownerType: 'individual',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    plotArea: '',
    // Don't initialize sale-specific fields for rent listings
    pricePerSqft: '',
    totalPrice: '',
    // Initialize rent-specific fields
    monthlyRent: '',
    deposit: '',
    possessionDate: '',
    boundaryWall: false,
    latitude: null,
    longitude: null,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Calculate total price whenever plot area or price per sqft changes (for sale)
  useEffect(() => {
    if (formData.type === 'sale' && formData.plotArea && formData.pricePerSqft) {
      const total = parseFloat(formData.plotArea) * parseFloat(formData.pricePerSqft);
      setFormData(prev => ({
        ...prev,
        totalPrice: total.toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        totalPrice: ''
      }));
    }
  }, [formData.plotArea, formData.pricePerSqft, formData.type]);

  // Set owner details from current user when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        ownerName: currentUser.username || '',
        ownerEmail: currentUser.email || '',
        ownerPhone: currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  // Initialize OpenStreetMap with Leaflet
  useEffect(() => {
    const initMap = async () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => createMap();
          document.head.appendChild(script);
        } else {
          createMap();
        }
      }
    };

    const createMap = () => {
      if (window.L && mapRef.current) {
        // Start with a world view
        const map = window.L.map(mapRef.current).setView([20, 0], 2);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Store map reference
        mapInstanceRef.current = map;

        // Don't add a marker initially - let user place it or search for city
        map.on('click', (event) => {
          const position = event.latlng;
          
          // Remove existing marker if any
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          
          // Add new marker at clicked location
          markerRef.current = window.L.marker(position, {
            draggable: true,
            title: 'Selected Location'
          }).addTo(map);

          // Update coordinates
          setFormData(prev => ({
            ...prev,
            latitude: position.lat,
            longitude: position.lng,
          }));

          // Update coordinates when marker is dragged
          markerRef.current.on('dragend', (event) => {
            const newPosition = event.target.getLatLng();
            setFormData(prev => ({
              ...prev,
              latitude: newPosition.lat,
              longitude: newPosition.lng,
            }));
          });
        });

        // Add instructions
        const instructions = window.L.control({ position: 'topright' });
        instructions.onAdd = function() {
          const div = window.L.DomUtil.create('div', 'info');
          div.innerHTML = '<strong>Search for a city or click on the map to select location</strong>';
          return div;
        };
        instructions.addTo(map);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Search for city coordinates using OpenStreetMap Nominatim API
  const searchByAddress = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          
          // Update form data with coordinates
          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lon,
            address: location.display_name || searchAddress
          }));
          
          // Center map on the found location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lon], 13);
            
            // Create or update marker
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lon]);
            } else {
              // Create new marker if none exists
              markerRef.current = window.L.marker([lat, lon], {
                draggable: true,
                title: 'Selected Location'
              }).addTo(mapInstanceRef.current);
              
              // Add drag event listener
              markerRef.current.on('dragend', (event) => {
                const newPosition = event.target.getLatLng();
                setFormData(prev => ({
                  ...prev,
                  latitude: newPosition.lat,
                  longitude: newPosition.lng,
                }));
              });
            }
          }
          
          // Clear search input
          setSearchAddress('');
        } else {
          setError('City not found. Please try a different search term.');
        }
      }
    } catch (error) {
      console.error('Error searching for city:', error);
      setError('Failed to search for city. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSubmit = async () => {
    if (files.length === 0 || files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload up to 6 images');
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    const formDataObj = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataObj.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(data),
        }));
      } else {
        setImageUploadError('Image upload failed');
      }
    } catch (err) {
      setImageUploadError('Image upload failed');
    }

    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      // Clear conflicting fields when type changes
      const newType = id;
      setFormData(prev => {
        const newData = { ...prev, type: newType };
        
        if (newType === 'rent') {
          // Clear sale-specific fields
          newData.pricePerSqft = '';
          newData.totalPrice = '';
        } else {
          // Clear rent-specific fields
          newData.monthlyRent = '';
          newData.deposit = '';
          newData.possessionDate = '';
        }
        
        return newData;
      });
    } else if (id === 'boundaryWall') {
      setFormData({ ...formData, [id]: checked });
    } else if (['text', 'number', 'textarea', 'select', 'email', 'tel', 'date'].includes(type)) {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setError('You must upload at least one image');
    }

    if (!formData.latitude || !formData.longitude) {
      return setError('Please select a location on the map');
    }

    if (!formData.plotArea) {
      return setError('Please enter plot area');
    }

    // Validate sale-specific fields
    if (formData.type === 'sale') {
      if (!formData.pricePerSqft) {
        return setError('Please enter price per sqft for sale');
      }
    }

    // Validate rent-specific fields
    if (formData.type === 'rent') {
      if (!formData.monthlyRent) {
        return setError('Please enter monthly rent');
      }
      if (!formData.deposit) {
        return setError('Please enter deposit amount');
      }
      if (!formData.possessionDate) {
        return setError('Please select possession date');
      }
    }

    // Validate owner contact details
    if (formData.ownerType === 'individual') {
      if (!formData.ownerName || !formData.ownerEmail || !formData.ownerPhone) {
        return setError('Please fill in all owner contact details');
      }
    }

    setLoading(true);
    setError(false);

    try {
      // Clean the data based on listing type before sending
      const cleanedData = {
        ...formData,
        userRef: currentUser._id,
      };

      // Remove sale-specific fields for rent listings
      if (formData.type === 'rent') {
        delete cleanedData.pricePerSqft;
        delete cleanedData.totalPrice;
      }

      // Remove rent-specific fields for sale listings
      if (formData.type === 'sale') {
        delete cleanedData.monthlyRent;
        delete cleanedData.deposit;
        delete cleanedData.possessionDate;
      }

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        return setError(data.message);
      }

      // Navigate to home page instead of listing page
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

      <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-6'>
        {/* LEFT FORM */}
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address with Pincode'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Listing Type */}
          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent'].map((field) => (
              <div key={field} className='flex gap-2'>
                <input
                  type='checkbox'
                  id={field}
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.type === field}
                />
                <span className='capitalize'>{field}</span>
              </div>
            ))}
          </div>

          {/* Owner Type */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='ownerType' className='font-medium'>Owner Type:</label>
            <select
              id='ownerType'
              className='border p-3 rounded-lg'
              value={formData.ownerType}
              onChange={handleChange}
              required
            >
              <option value='individual'>Individual</option>
              <option value='company'>Company</option>
              <option value='government'>Government</option>
              <option value='trust'>Trust</option>
            </select>
          </div>

          {/* Owner Details (Conditional) */}
          {formData.ownerType === 'individual' && (
            <>
              <input
                type='text'
                placeholder='Owner Name'
                className='border p-3 rounded-lg'
                id='ownerName'
                required
                onChange={handleChange}
                value={formData.ownerName}
              />
              <input
                type='email'
                placeholder='Owner Email'
                className='border p-3 rounded-lg'
                id='ownerEmail'
                required
                onChange={handleChange}
                value={formData.ownerEmail}
              />
              <input
                type='tel'
                placeholder='Owner Phone'
                className='border p-3 rounded-lg'
                id='ownerPhone'
                required
                onChange={handleChange}
                value={formData.ownerPhone}
              />
            </>
          )}

          {/* Plot Area */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='plotArea' className='font-medium'>Plot Area (in sq ft):</label>
            <input
              type='number'
              id='plotArea'
              min='1'
              max='1000000'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.plotArea}
              placeholder='Enter plot area in square feet'
            />
          </div>

          {/* Conditional Fields based on Listing Type */}
          {formData.type === 'sale' ? (
            <>
              {/* Price Per Sqft */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='pricePerSqft' className='font-medium'>Price Per Sqft (₹):</label>
                <input
                  type='number'
                  id='pricePerSqft'
                  min='1'
                  max='100000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.pricePerSqft}
                  placeholder='Enter price per square foot'
                />
              </div>

              {/* Total Price (Read-only) */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='totalPrice' className='font-medium'>Total Price (₹):</label>
                <input
                  type='text'
                  id='totalPrice'
                  readOnly
                  className='p-3 border border-gray-300 rounded-lg bg-gray-50'
                  value={formData.totalPrice ? `₹${parseFloat(formData.totalPrice).toLocaleString('en-IN')}` : ''}
                  placeholder='Calculated automatically'
                />
              </div>
            </>
          ) : (
            <>
              {/* Monthly Rent */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='monthlyRent' className='font-medium'>Monthly Rent (₹):</label>
                <input
                  type='number'
                  id='monthlyRent'
                  min='1'
                  max='1000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.monthlyRent}
                  placeholder='Enter monthly rent amount'
                />
              </div>

              {/* Deposit */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='deposit' className='font-medium'>Deposit (₹):</label>
                <input
                  type='number'
                  id='deposit'
                  min='1'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.deposit}
                  placeholder='Enter deposit amount'
                />
              </div>

              {/* Possession Date */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='possessionDate' className='font-medium'>Possession/Availability Date:</label>
                <input
                  type='date'
                  id='possessionDate'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.possessionDate}
                />
              </div>
            </>
          )}

          {/* Boundary Wall */}
          <div className='flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50'>
            <label className='font-medium text-gray-700'>Property Features:</label>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='boundaryWall'
                className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                onChange={handleChange}
                checked={formData.boundaryWall}
              />
              <span className='text-gray-700'>Boundary Wall</span>
            </div>
            <p className='text-xs text-gray-500'>Check this if the property has a boundary wall or fencing</p>
          </div>

          {/* Map Integration */}
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Select Location:</label>
            
            {/* Address Search */}
            <div className='flex flex-col gap-2 mb-4'>
              <label className='font-medium text-gray-700'>Search for City/Location:</label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder='Enter city name (e.g., Mumbai, Delhi, Bangalore)...'
                  className='flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  onKeyPress={(e) => e.key === 'Enter' && searchByAddress()}
                />
                <button
                  type='button'
                  onClick={searchByAddress}
                  disabled={isSearching || !searchAddress.trim()}
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              <p className='text-sm text-gray-600'>
                Search for a city to automatically center the map and set coordinates
              </p>
              
              {/* Popular Cities Quick Selection */}
              <div className='mt-2'>
                <p className='text-xs text-gray-500 mb-2'>Popular cities:</p>
                <div className='flex flex-wrap gap-2'>
                  {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'].map((city) => (
                    <button
                      key={city}
                      type='button'
                      onClick={() => {
                        setSearchAddress(city);
                        searchByAddress();
                      }}
                      className='px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border border-gray-300 transition-colors'
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div 
              ref={mapRef} 
              className='w-full h-64 border rounded-lg'
              style={{ minHeight: '256px' }}
            ></div>
            
            <p className='text-sm text-gray-600'>
              Click on the map or drag the marker to select the exact location
            </p>
            
            {formData.latitude && formData.longitude && (
              <div className='text-sm text-green-600 bg-green-50 p-2 rounded'>
                Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </div>
            )}

            {/* Coordinate validation warning */}
            {formData.latitude && formData.longitude && (
              <div className='text-sm text-orange-600 bg-orange-50 p-2 rounded border border-orange-200'>
                <strong>⚠️ Important:</strong> Make sure you've selected the actual property location, not a default location. 
                The transport score will only be accurate for real property coordinates.
              </div>
            )}

            {formData.latitude && formData.longitude && (
              <div className='mt-4'>
                <NearbyTransport latitude={formData.latitude} longitude={formData.longitude} radius={300} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
