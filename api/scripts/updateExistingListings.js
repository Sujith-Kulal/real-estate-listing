import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';

dotenv.config();

const updateExistingListings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB!');

    // Find all listings that don't have pricePerSqft or totalPrice
    const listingsToUpdate = await Listing.find({
      $or: [
        { pricePerSqft: { $exists: false } },
        { totalPrice: { $exists: false } }
      ]
    });

    console.log(`Found ${listingsToUpdate.length} listings to update`);

    if (listingsToUpdate.length === 0) {
      console.log('✅ All listings already have price information!');
      return;
    }

    // Update each listing with default price values
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const listing of listingsToUpdate) {
      try {
        // Check if plotArea is valid
        const plotArea = parseFloat(listing.plotArea);
        if (isNaN(plotArea) || plotArea <= 0) {
          console.log(`⚠️  Skipping listing: ${listing.name} - Invalid plot area: ${listing.plotArea}`);
          skippedCount++;
          continue;
        }
        
        // Set default price per sqft based on listing type and location
        let defaultPricePerSqft = 5000; // Default ₹5000 per sq ft
        
        // Adjust price based on listing type
        if (listing.type === 'rent') {
          defaultPricePerSqft = 50; // ₹50 per sq ft for rent
        }
        
        // Calculate total price
        const totalPrice = plotArea * defaultPricePerSqft;
        
        // Update the listing
        await Listing.findByIdAndUpdate(listing._id, {
          pricePerSqft: defaultPricePerSqft,
          totalPrice: totalPrice
        });
        
        updatedCount++;
        console.log(`✅ Updated listing: ${listing.name}`);
        console.log(`   - Plot Area: ${plotArea} sq ft`);
        console.log(`   - Price per sq ft: ₹${defaultPricePerSqft.toLocaleString('en-IN')}`);
        console.log(`   - Total Price: ₹${totalPrice.toLocaleString('en-IN')}`);
        
      } catch (error) {
        console.error(`❌ Error updating listing ${listing._id}:`, error.message);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} out of ${listingsToUpdate.length} listings!`);
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} listings due to invalid data`);
    }
    console.log('📝 Note: You may want to manually review and adjust the prices for accuracy.');

  } catch (error) {
    console.error('Error updating listings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateExistingListings();
