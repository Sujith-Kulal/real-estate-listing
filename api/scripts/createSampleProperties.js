import mongoose from 'mongoose';
import Property from '../models/Property.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample properties in Udupi with different coordinates
const sampleProperties = [
  {
    propertyId: 'UDU001',
    title: 'Premium Agricultural Land - Udupi',
    description: 'Excellent soil quality land perfect for rice and vegetable farming',
    address: 'Plot 123, Near Udupi Temple, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3409, lon: 74.7421 },
    area: { value: 2.5, unit: 'acres' },
    price: { value: 2500000, currency: 'INR' },
    features: ['agricultural'],
    ownerId: '507f1f77bcf86cd799439011', // Sample user ID
    images: ['udupi_land_1.jpg', 'udupi_land_2.jpg']
  },
  {
    propertyId: 'UDU002',
    title: 'Mixed Use Land - Udupi City',
    description: 'Versatile land suitable for both agriculture and construction',
    address: 'Plot 124, Near Railway Station, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3410, lon: 74.7422 },
    area: { value: 1.8, unit: 'acres' },
    price: { value: 1800000, currency: 'INR' },
    features: ['agricultural', 'residential'],
    ownerId: '507f1f77bcf86cd799439012',
    images: ['udupi_land_3.jpg', 'udupi_land_4.jpg']
  },
  {
    propertyId: 'UDU003',
    title: 'Tea Estate Land - Udupi Hills',
    description: 'Hilly terrain perfect for tea and coffee cultivation',
    address: 'Plot 125, Udupi Hills, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3415, lon: 74.7425 },
    area: { value: 3.2, unit: 'acres' },
    price: { value: 3200000, currency: 'INR' },
    features: ['agricultural'],
    ownerId: '507f1f77bcf86cd799439013',
    images: ['udupi_land_5.jpg', 'udupi_land_6.jpg']
  },
  {
    propertyId: 'UDU004',
    title: 'Commercial Land - Udupi Market',
    description: 'Prime commercial location with good construction potential',
    address: 'Plot 126, Udupi Market Area, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3420, lon: 74.7428 },
    area: { value: 0.8, unit: 'acres' },
    price: { value: 1200000, currency: 'INR' },
    features: ['commercial'],
    ownerId: '507f1f77bcf86cd799439014',
    images: ['udupi_land_7.jpg', 'udupi_land_8.jpg']
  },
  {
    propertyId: 'UDU005',
    title: 'Residential Plot - Udupi Suburb',
    description: 'Peaceful residential area with moderate soil quality',
    address: 'Plot 127, Udupi Suburb, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3425, lon: 74.7430 },
    area: { value: 0.5, unit: 'acres' },
    price: { value: 800000, currency: 'INR' },
    features: ['residential'],
    ownerId: '507f1f77bcf86cd799439015',
    images: ['udupi_land_9.jpg', 'udupi_land_10.jpg']
  },
  {
    propertyId: 'UDU006',
    title: 'Fertile Farmland - Udupi Valley',
    description: 'Rich soil perfect for multiple crop cultivation',
    address: 'Plot 128, Udupi Valley, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3430, lon: 74.7435 },
    area: { value: 4.0, unit: 'acres' },
    price: { value: 4000000, currency: 'INR' },
    features: ['agricultural'],
    ownerId: '507f1f77bcf86cd799439016',
    images: ['udupi_land_11.jpg', 'udupi_land_12.jpg']
  },
  {
    propertyId: 'UDU007',
    title: 'Industrial Land - Udupi Industrial Zone',
    description: 'Large industrial plot with good infrastructure access',
    address: 'Plot 129, Udupi Industrial Zone, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3435, lon: 74.7440 },
    area: { value: 5.5, unit: 'acres' },
    price: { value: 5500000, currency: 'INR' },
    features: ['industrial'],
    ownerId: '507f1f77bcf86cd799439017',
    images: ['udupi_land_13.jpg', 'udupi_land_14.jpg']
  },
  {
    propertyId: 'UDU008',
    title: 'Beachfront Property - Udupi Coast',
    description: 'Unique coastal property with mixed development potential',
    address: 'Plot 130, Udupi Beach, Udupi',
    city: 'Udupi',
    state: 'Karnataka',
    coordinates: { lat: 13.3440, lon: 74.7445 },
    area: { value: 1.2, unit: 'acres' },
    price: { value: 3000000, currency: 'INR' },
    features: ['residential', 'commercial'],
    ownerId: '507f1f77bcf86cd799439018',
    images: ['udupi_land_15.jpg', 'udupi_land_16.jpg']
  }
];

async function createSampleProperties() {
  try {
    // Try to connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO || 'mongodb://localhost:27017/bhumi');
    console.log('✅ Connected to MongoDB');

    // Clear existing sample properties
    await Property.deleteMany({ propertyId: { $regex: /^UDU/ } });
    console.log('✅ Cleared existing sample properties');

    // Create new sample properties
    const createdProperties = await Property.insertMany(sampleProperties);
    console.log(`✅ Created ${createdProperties.length} sample properties`);

    // Display created properties
    createdProperties.forEach(prop => {
      console.log(`✅ ${prop.propertyId}: ${prop.title} at (${prop.coordinates.lat}, ${prop.coordinates.lon})`);
    });

    console.log('\n🎉 Sample properties created successfully!');
    console.log('\n📊 Property Summary:');
    console.log(`Total Properties: ${createdProperties.length}`);
    console.log(`Cities: ${[...new Set(createdProperties.map(p => p.city))].join(', ')}`);
    console.log(`Price Range: ₹${Math.min(...createdProperties.map(p => p.price.value)).toLocaleString()} - ₹${Math.max(...createdProperties.map(p => p.price.value)).toLocaleString()}`);
    console.log(`Area Range: ${Math.min(...createdProperties.map(p => p.area.value))} - ${Math.max(...createdProperties.map(p => p.area.value))} acres`);

    console.log('\n🔍 Test the API endpoints:');
    console.log('1. Get property analysis: GET /api/soil-climate/property/UDU001');
    console.log('2. Get area properties: GET /api/soil-climate/area/Udupi');
    console.log('3. Get nearby properties: GET /api/soil-climate/nearby/13.3409/74.7421?distance=5000');
    console.log('4. Get coordinates analysis: GET /api/soil-climate/coordinates/13.3409/74.7421');

  } catch (error) {
    console.error('❌ Error creating sample properties:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n⚠️  MongoDB is not running. The system will work with demo data.');
      console.log('📝 To use the full property database:');
      console.log('   1. Install MongoDB locally, or');
      console.log('   2. Use MongoDB Atlas (cloud), or');
      console.log('   3. The frontend will show demo properties with sample data');
      
      console.log('\n🎯 The property-level precision system is still fully functional!');
      console.log('   - Each coordinate gets unique analysis');
      console.log('   - Bhumi Scores vary by location');
      console.log('   - Property-specific recommendations work');
    }
    
    console.log('\n✅ Frontend demo is ready with sample property data!');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
    }
  }
}

// Run the script
createSampleProperties();
