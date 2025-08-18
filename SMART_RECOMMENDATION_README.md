# Smart Recommendation System for BHUMI

## Overview

The Smart Recommendation System is an advanced feature that provides **Transit Score** and **Livability Score** for properties, similar to NoBroker's system. It helps potential buyers make informed decisions by quantifying the practical aspects of living in a specific location.

## Features

### 🚌 Transit Score (0-10)
- **Purpose**: Measures property accessibility to public transportation
- **Factors**: Proximity to bus stops, train stations, metro stations
- **Calculation**: Based on distance and travel time estimates
- **Scoring**: Higher scores indicate better transit accessibility

### 🏠 Livability Score (0-10)
- **Purpose**: Measures overall quality of life and convenience
- **Factors**: Proximity to hospitals, schools, markets, restaurants, parks
- **Calculation**: Weighted scoring based on distance to amenities
- **Scoring**: Higher scores indicate better livability

### 📊 Overall Property Score
- **Combined Assessment**: Average of Transit and Livability scores
- **Grade System**: A+, A, B+, B, C, D based on overall score
- **Visual Indicators**: Color-coded scores for easy understanding

## Components

### 1. SmartRecommendation Component
- **Location**: `client/src/components/SmartRecommendation.jsx`
- **Purpose**: Displays scores and detailed breakdowns
- **Features**: 
  - Score visualization with color coding
  - Detailed transit and amenity information
  - Loading states and fallback scores
  - Responsive design

### 2. SmartRecommendationService
- **Location**: `client/src/services/smartRecommendationService.js`
- **Purpose**: Core scoring logic and calculations
- **Features**:
  - Distance calculations using Haversine formula
  - Score normalization and grading
  - Mock data for demonstration
  - Google Places API integration ready

### 3. CoordinatePicker Component
- **Location**: `client/src/components/CoordinatePicker.jsx`
- **Purpose**: Allows users to input property coordinates
- **Features**:
  - Search by location name
  - GPS location detection
  - Manual coordinate input
  - Coordinate validation
  - Address reverse geocoding

## Implementation Details

### Database Schema Updates
```javascript
// Added to listing.model.js
coordinates: {
  latitude: Number,
  longitude: Number
},
city: String,
area: String
```

### Scoring Algorithm

#### Transit Score Calculation
```javascript
// Distance-based scoring with weights
if (distance <= 1) return weight * 10;    // Excellent: 0-1 km
if (distance <= 3) return weight * 8;     // Good: 1-3 km
if (distance <= 5) return weight * 6;     // Fair: 3-5 km
if (distance <= 8) return weight * 4;     // Poor: 5-8 km
return weight * 2;                        // Very poor: >8 km
```

#### Livability Score Calculation
```javascript
// More stringent distance requirements for amenities
if (distance <= 0.5) return weight * 10;  // Excellent: 0-0.5 km
if (distance <= 1.5) return weight * 8;   // Good: 0.5-1.5 km
if (distance <= 3) return weight * 6;     // Fair: 1.5-3 km
if (distance <= 5) return weight * 4;     // Poor: 3-5 km
return weight * 2;                        // Very poor: >5 km
```

### Distance Calculation
Uses the **Haversine formula** to calculate accurate distances between coordinates:
```javascript
const R = 6371; // Earth's radius in kilometers
const dLat = deg2rad(lat2 - lat1);
const dLon = deg2rad(lon2 - lon1);
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;
```

## Usage

### For Property Sellers
1. **Create Listing**: Use the enhanced CreateListing page
2. **Add Coordinates**: Use CoordinatePicker to set exact location
3. **Automatic Scoring**: System calculates scores automatically
4. **Showcase Benefits**: Display scores to attract buyers

### For Property Buyers
1. **View Listings**: See Smart Recommendation scores on property pages
2. **Compare Properties**: Use scores to compare different locations
3. **Make Decisions**: Base decisions on data-driven insights
4. **Understand Neighborhood**: Get detailed breakdown of amenities

## Integration Points

### Frontend Routes
- **CreateListing**: Enhanced with coordinate picker
- **Listing**: Displays Smart Recommendation scores
- **SmartRecommendationDemo**: Showcase page for the system

### Backend APIs
- **Listing Creation**: Accepts coordinates and location data
- **Listing Retrieval**: Returns enhanced property information
- **Future**: Google Places API integration for real-time data

## Future Enhancements

### 1. Google Places API Integration
```javascript
// Real-time amenity data
const nearbyPlaces = await getNearbyPlaces(lat, lng, 'hospital', 5000);
```

### 2. Advanced Scoring Factors
- **Crime Rate**: Safety scoring
- **Air Quality**: Environmental factors
- **Noise Levels**: Traffic and urban noise
- **Green Spaces**: Parks and recreational areas

### 3. Machine Learning
- **User Preferences**: Personalized scoring
- **Market Trends**: Dynamic score adjustments
- **Predictive Analytics**: Future neighborhood development

## Configuration

### Environment Variables
```bash
# Add to .env file
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Google Places API Setup
1. Create Google Cloud Project
2. Enable Places API
3. Generate API key
4. Set billing and quotas

## Testing

### Sample Data
The system includes mock data for demonstration:
- **Transit**: Bus stops, train stations in Bangalore
- **Amenities**: Hospitals, schools, markets, restaurants
- **Properties**: Sample listings with coordinates

### Demo Page
Visit `/smart-recommendation-demo` to see the system in action with sample properties.

## Benefits

### For Users
- **Transparency**: Clear understanding of property advantages
- **Comparison**: Easy property comparison
- **Confidence**: Data-driven decision making
- **Time Saving**: Quick neighborhood assessment

### For Platform
- **Differentiation**: Unique feature in real estate market
- **User Engagement**: Increased time on platform
- **Data Quality**: Better property information
- **Competitive Advantage**: Advanced scoring system

## Technical Requirements

### Frontend
- React 18+
- Tailwind CSS
- React Icons
- Modern browser with geolocation support

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Coordinate validation
- Error handling for location services

### Performance
- Lazy loading of score calculations
- Caching of location data
- Optimized distance calculations
- Fallback scores for offline scenarios

## Support

For technical support or feature requests related to the Smart Recommendation system, please refer to the main project documentation or contact the development team.

---

**Note**: This system is designed to work with the existing BHUMI real estate platform and can be easily extended with additional scoring factors and data sources.
