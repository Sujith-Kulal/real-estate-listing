import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    ownerType: 'individual',
    plotArea: '',
    pricePerSqft: '',
    totalPrice: '',
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

  // Calculate total price whenever plot area or price per sqft changes
  useEffect(() => {
    if (formData.plotArea && formData.pricePerSqft) {
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
  }, [formData.plotArea, formData.pricePerSqft]);

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
        const defaultLocation = [12.9716, 77.5946]; // Bangalore coordinates
        
        const map = window.L.map(mapRef.current).setView(defaultLocation, 12);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const marker = window.L.marker(defaultLocation, {
          draggable: true,
          title: 'Selected Location'
        }).addTo(map);

        // Update coordinates when marker is dragged
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          setFormData(prev => ({
            ...prev,
            latitude: position.lat,
            longitude: position.lng,
          }));
        });

        // Update coordinates when map is clicked
        map.on('click', (event) => {
          const position = event.latlng;
          marker.setLatLng(position);
          setFormData(prev => ({
            ...prev,
            latitude: position.lat,
            longitude: position.lng,
          }));
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
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

  // Search for coordinates by address
  const searchByAddress = async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    setError('');

    try {
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
          lng: parseFloat(result.lon)
        };
        
        setFormData(prev => ({
          ...prev,
          latitude: newCoordinates.lat,
          longitude: newCoordinates.lng,
        }));

        // Update map and marker
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([newCoordinates.lat, newCoordinates.lng], 15);
          markerRef.current.setLatLng([newCoordinates.lat, newCoordinates.lng]);
        }
        
        setSearchAddress('');
      } else {
        setError('Address not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Address search error:', error);
      setError('Failed to search for address. Please select location manually on the map.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      
      // Map old data structure to new structure if needed
      const updatedData = {
        ...data,
        ownerType: data.ownerType || 'individual',
        plotArea: data.plotArea || '',
        pricePerSqft: data.pricePerSqft || '',
        totalPrice: data.totalPrice || '',
        boundaryWall: data.boundaryWall || false,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      };
      
      setFormData(updatedData);
      
      // Update map if coordinates exist
      if (updatedData.latitude && updatedData.longitude && mapInstanceRef.current && markerRef.current) {
        const coords = [updatedData.latitude, updatedData.longitude];
        mapInstanceRef.current.setView(coords, 15);
        markerRef.current.setLatLng(coords);
      }
    };

    fetchListing();
  }, [params.listingId]);

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
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (id === 'boundaryWall') {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (['text', 'number', 'textarea', 'select'].includes(type)) {
      setFormData((prev) => ({ ...prev, [id]: value }));
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

    if (!formData.plotArea || !formData.pricePerSqft) {
      return setError('Please enter both plot area and price per sqft');
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
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
      <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>

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

          {/* Boundary Wall */}
          <div className='flex gap-2 items-center'>
            <input
              type='checkbox'
              id='boundaryWall'
              className='w-5'
              onChange={handleChange}
              checked={formData.boundaryWall}
            />
            <span>Boundary Wall</span>
          </div>

          {/* Map Integration */}
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Select Location:</label>
            
            {/* Address Search */}
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder='Search by address, city, or landmark...'
                className='flex-1 p-2 border border-gray-300 rounded-lg'
                onKeyPress={(e) => e.key === 'Enter' && searchByAddress()}
              />
              <button
                type='button'
                onClick={searchByAddress}
                disabled={isSearching || !searchAddress.trim()}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
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
            {loading ? 'Updating...' : 'Update listing'}
          </button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
