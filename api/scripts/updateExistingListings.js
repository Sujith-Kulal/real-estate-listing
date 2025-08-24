import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';

dotenv.config();

const updateExistingListings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB!');

    // Find all listings that need updates
    const listingsToUpdate = await Listing.find({});

    console.log(`Found ${listingsToUpdate.length} listings to update`);

    if (listingsToUpdate.length === 0) {
      console.log('✅ No listings found!');
      return;
    }

    // Update each listing with new fields
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const listing of listingsToUpdate) {
      try {
        const updates = {};
        
        // Add owner contact details if missing
        if (!listing.ownerName) {
          updates.ownerName = 'Owner Name'; // Default placeholder
          console.log(`📝 Adding owner name for "${listing.name}"`);
        }
        
        if (!listing.ownerEmail) {
          updates.ownerEmail = 'owner@example.com'; // Default placeholder
          console.log(`📧 Adding owner email for "${listing.name}"`);
        }
        
        if (!listing.ownerPhone) {
          updates.ownerPhone = '0000000000'; // Default placeholder
          console.log(`📞 Adding owner phone for "${listing.name}"`);
        }

        // Add rent-specific fields if missing and it's a rent listing
        if (listing.type === 'rent') {
          if (!listing.monthlyRent) {
            updates.monthlyRent = 5000; // Default ₹5000 monthly rent
            console.log(`💰 Setting monthly rent for "${listing.name}" to ₹5000`);
          }
          
          if (!listing.deposit) {
            updates.deposit = 10000; // Default ₹10000 deposit
            console.log.log(`💳 Setting deposit for "${listing.name}" to ₹10000`);
          }
          
          if (!listing.possessionDate) {
            updates.possessionDate = new Date(); // Default to current date
            console.log(`📅 Setting possession date for "${listing.name}" to current date`);
          }
        }

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
          ...updates,
          pricePerSqft: defaultPricePerSqft,
          totalPrice: totalPrice
        });
        
        updatedCount++;
        console.log(`✅ Updated listing: ${listing.name}`);
        console.log(`   - Plot Area: ${plotArea} sq ft`);
        console.log(`   - Price per sq ft: ₹${defaultPricePerSqft.toLocaleString('en-IN')}`);
        console.log(`   - Total Price: ₹${totalPrice.toLocaleString('en-IN')}`);
        
      } catch (error) {
        console.error(`❌ Error updating listing ${listing.name}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} listings`);
    console.log(`⚠️  Skipped: ${skippedCount} listings`);
    console.log(`📝 Total processed: ${listingsToUpdate.length} listings`);

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

updateExistingListings();
