# Price Per Sqft Feature

This document describes the new price calculation feature added to the BHUMI land listing system.

## Overview

The system now supports automatic price calculations based on plot area and price per square foot. This allows users to:

1. Enter the plot area in square feet
2. Specify the price per square foot
3. View the automatically calculated total price
4. Display price information in listings and search results

## Features Added

### 1. Database Schema Updates
- Added `pricePerSqft` field (Number, required, min: 1)
- Added `totalPrice` field (Number, required, min: 1)
- Automatic calculation of total price = plot area × price per sqft

### 2. Create Listing Form
- New "Price Per Sqft" input field
- Real-time calculation of total price
- Read-only total price display with Indian currency formatting
- Form validation for price fields

### 3. Update Listing Form
- Same price functionality as create form
- Pre-populated with existing price data
- Real-time recalculation when values change

### 4. Listing Display
- Price information prominently displayed on listing pages
- Price per sqft and total price shown with currency symbols
- Indian number formatting (e.g., ₹1,00,000)

### 5. Search Results
- Price information displayed in listing cards
- Compact price display showing both per sqft and total
- Color-coded price information for better visibility

### 6. Navigation Changes
- After creating a listing, users are redirected to the home page
- After updating a listing, users are redirected to the home page

## Database Migration

### For Existing Listings

Run the migration script to add price information to existing listings:

```bash
cd api/scripts
node updateExistingListings.js
```

This script will:
- Find all listings without price information
- Add default price per sqft (₹5000 for sale, ₹50 for rent)
- Calculate and add total price
- Display summary of updated listings

### Default Pricing

- **Sale listings**: ₹5000 per sq ft
- **Rent listings**: ₹50 per sq ft

**Note**: These are default values. Users should manually review and adjust prices for accuracy.

## Usage

### Creating a New Listing

1. Fill in the basic listing information
2. Enter the plot area in square feet
3. Enter the price per square foot
4. The total price will be calculated automatically
5. Complete the rest of the form
6. Submit the listing
7. You'll be redirected to the home page

### Updating a Listing

1. Navigate to the listing you want to update
2. Click "Edit" or navigate to the update page
3. Modify the plot area or price per sqft as needed
4. The total price will update automatically
5. Save the changes
6. You'll be redirected to the home page

### Viewing Price Information

- **Individual Listing Page**: Full price details in a dedicated section
- **Search Results**: Compact price display in listing cards
- **Price Format**: Indian currency format with commas (e.g., ₹1,00,000)

## Technical Implementation

### Backend Changes

1. **Model Updates** (`api/models/listing.model.js`)
   - Added pricePerSqft and totalPrice fields
   - Validation for minimum values

2. **Controller Updates** (`api/controllers/listing.controller.js`)
   - Automatic total price calculation in create and update functions
   - Price validation

3. **Migration Script** (`api/scripts/updateExistingListings.js`)
   - Updates existing listings with default prices
   - Handles both sale and rent listings

### Frontend Changes

1. **CreateListing Component** (`client/src/pages/CreateListing.jsx`)
   - Added price input fields
   - Real-time calculation with useEffect
   - Form validation
   - Navigation to home page

2. **UpdateListing Component** (`client/src/pages/UpdateListing.jsx`)
   - Same price functionality as create form
   - Pre-population of existing data
   - Navigation to home page

3. **Listing Component** (`client/src/pages/Listing.jsx`)
   - Price information display section
   - Indian currency formatting
   - Responsive design

4. **ListingItem Component** (`client/src/components/ListingItem.jsx`)
   - Compact price display in search results
   - Color-coded price information

## Currency Formatting

The system uses Indian currency formatting:
- Symbol: ₹ (Rupee)
- Number formatting: 1,00,000 (with commas)
- Example: ₹1,00,000 for 100,000 rupees

## Validation

- Plot area: Minimum 1 sq ft, maximum 1,000,000 sq ft
- Price per sqft: Minimum ₹1, maximum ₹100,000
- Both fields are required for listing creation/update
- Total price is calculated automatically and cannot be manually edited

## Future Enhancements

Potential improvements for the price feature:

1. **Price Range Filtering**: Add price range filters to search
2. **Price History**: Track price changes over time
3. **Market Analysis**: Compare prices with similar properties
4. **Currency Support**: Support for multiple currencies
5. **Price Negotiation**: Built-in negotiation features
6. **Price Alerts**: Notify users of price changes

## Troubleshooting

### Common Issues

1. **Price not calculating**: Ensure both plot area and price per sqft are entered
2. **Invalid price format**: Check that only numbers are entered
3. **Migration script errors**: Ensure MongoDB connection and proper environment variables

### Support

For issues with the price feature, check:
1. Browser console for JavaScript errors
2. Server logs for backend errors
3. Database connection and schema validation
4. Form validation messages

## Testing

Test the price feature by:
1. Creating a new listing with price information
2. Updating an existing listing's price
3. Verifying price display in search results
4. Checking price formatting and calculations
5. Testing form validation and error messages

