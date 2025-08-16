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

    // Create a test listing
    const testListing = new Listing({
      name: 'Test Land Plot',
      description: 'This is a test listing to verify the system works properly.',
      address: '123 Test Street, Test City',
      regularPrice: 50000,
      discountPrice: 45000,
      bathrooms: 2,
      bedrooms: 3,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
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
    console.log('  - Price: $', testListing.regularPrice);
    console.log('  - Owner:', testUser.email);

  } catch (error) {
    console.error('Error creating test listing:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestListing();
