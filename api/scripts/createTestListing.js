import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';

dotenv.config();

const createTestListing = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB!');

    // First, check if we have any users
    const users = await User.find({});
    if (users.length === 0) {
      console.log('❌ No users found! Create a user first.');
      return;
    }

    // Use the first user as the listing owner
    const testUser = users[0];
    console.log('Using user:', testUser.email);

    // Check if test listing already exists
    const existingListing = await Listing.findOne({ name: 'Test Land Plot' });
    if (existingListing) {
      console.log('✅ Test listing already exists!');
      return;
    }

    // Create a test listing with new structure including price information
    const plotArea = 2500; // 2500 sq ft
    const pricePerSqft = 8000; // ₹8000 per sq ft
    const totalPrice = plotArea * pricePerSqft;

    const testListing = new Listing({
      name: 'Test Land Plot',
      description: 'This is a test listing to verify the system works properly.',
      address: '123 Test Street, Test City, Karnataka',
      type: 'sale',
      ownerType: 'individual',
      plotArea: plotArea,
      pricePerSqft: pricePerSqft,
      totalPrice: totalPrice,
      boundaryWall: true,
      latitude: 12.9716,
      longitude: 77.5946, // Bangalore coordinates
      imageUrls: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      ],
      userRef: testUser._id,
      status: 'approved' // Set to approved so it shows up immediately
    });

    await testListing.save();
    console.log('✅ Test listing created successfully!');
    console.log('  - Name:', testListing.name);
    console.log('  - Status:', testListing.status);
    console.log('  - Type:', testListing.type);
    console.log('  - Owner Type:', testListing.ownerType);
    console.log('  - Plot Area:', testListing.plotArea, 'sq ft');
    console.log('  - Price per sq ft: ₹', testListing.pricePerSqft.toLocaleString('en-IN'));
    console.log('  - Total Price: ₹', testListing.totalPrice.toLocaleString('en-IN'));
    console.log('  - Boundary Wall:', testListing.boundaryWall ? 'Yes' : 'No');
    console.log('  - Location:', testListing.latitude, ',', testListing.longitude);
    console.log('  - Owner:', testUser.email);

  } catch (error) {
    console.error('Error creating test listing:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestListing();
