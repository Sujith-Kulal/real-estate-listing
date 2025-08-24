import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';

dotenv.config();

const fixExistingListings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB!');

    // Find all listings that need fixing
    const listingsToFix = await Listing.find({
      $or: [
        { plotArea: { $exists: false } },
        { plotArea: null },
        { plotArea: undefined },
        { pricePerSqft: { $exists: false } },
        { totalPrice: { $exists: false } }
      ]
    });

    console.log(`Found ${listingsToFix.length} listings to fix`);

    if (listingsToFix.length === 0) {
      console.log('✅ All listings are already properly configured!');
      return;
    }

    // Fix each listing
    let fixedCount = 0;
    
    for (const listing of listingsToFix) {
      try {
        // Set default values for missing fields
        const updates = {};
        
        // Set default plot area if missing
        if (!listing.plotArea || listing.plotArea === null || listing.plotArea === undefined) {
          updates.plotArea = 1000; // Default 1000 sq ft
          console.log(`📏 Setting plot area for "${listing.name}" to 1000 sq ft`);
        }
        
        // Set default price per sqft if missing
        if (!listing.pricePerSqft) {
          const defaultPricePerSqft = listing.type === 'rent' ? 50 : 5000;
          updates.pricePerSqft = defaultPricePerSqft;
          console.log(`💰 Setting price per sqft for "${listing.name}" to ₹${defaultPricePerSqft}`);
        }
        
        // Calculate and set total price
        const plotArea = updates.plotArea || listing.plotArea;
        const pricePerSqft = updates.pricePerSqft || listing.pricePerSqft;
        const totalPrice = plotArea * pricePerSqft;
        updates.totalPrice = totalPrice;
        
        // Set other missing fields with defaults
        if (!listing.ownerType) {
          updates.ownerType = 'individual';
        }
        
        if (listing.boundaryWall === undefined || listing.boundaryWall === null) {
          updates.boundaryWall = false;
        }
        
        // Update the listing
        await Listing.findByIdAndUpdate(listing._id, updates);
        
        fixedCount++;
        console.log(`✅ Fixed listing: ${listing.name}`);
        console.log(`   - Plot Area: ${plotArea} sq ft`);
        console.log(`   - Price per sq ft: ₹${pricePerSqft.toLocaleString('en-IN')}`);
        console.log(`   - Total Price: ₹${totalPrice.toLocaleString('en-IN')}`);
        console.log(`   - Owner Type: ${updates.ownerType || listing.ownerType}`);
        console.log(`   - Boundary Wall: ${updates.boundaryWall !== undefined ? updates.boundaryWall : listing.boundaryWall ? 'Yes' : 'No'}`);
        
      } catch (error) {
        console.error(`❌ Error fixing listing ${listing._id}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully fixed ${fixedCount} out of ${listingsToFix.length} listings!`);
    console.log('📝 Note: You may want to manually review and adjust the values for accuracy.');

  } catch (error) {
    console.error('Error fixing listings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

fixExistingListings();








