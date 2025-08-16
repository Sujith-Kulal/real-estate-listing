# 🌱 BHUMI Soil & Climate API Integration Setup Guide

## 🎯 Overview
This guide will help you set up the full API integration for BHUMI's Soil & Climate Intelligence feature, replacing demo data with real-time environmental data from global APIs.

## 📋 Prerequisites
- Node.js installed (v16 or higher)
- MongoDB running locally or cloud instance
- Basic understanding of environment variables

## 🔑 Step 1: Get API Keys

### OpenWeatherMap API Key
1. **Sign up**: Go to [OpenWeatherMap](https://openweathermap.org/api) and create a free account
2. **Get API Key**: Navigate to "My API Keys" in your dashboard
3. **Free Tier**: Includes 1,000 calls/day (sufficient for development)
4. **Copy Key**: Save your API key for the next step

### Google Maps API Key (Optional - for enhanced mapping)
1. **Google Cloud Console**: Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. **Create Project**: Create a new project or select existing one
3. **Enable APIs**: Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. **Create Credentials**: Create an API key
5. **Restrict Key**: Restrict to your domain for security

## ⚙️ Step 2: Configure Environment Variables

### Create `.env` file in the `api` directory:
```bash
# MongoDB Connection
MONGO=mongodb://localhost:27017/bhumi

# API Keys
OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Important Notes:
- **Never commit** `.env` files to version control
- Replace `your_actual_openweather_api_key_here` with your real OpenWeatherMap API key
- The Google Maps key is optional - the system works without it

## 🚀 Step 3: Install Dependencies

Navigate to the `api` directory and install required packages:

```bash
cd api
npm install node-fetch@2
```

## 🔧 Step 4: Test the Integration

### Start the Server
```bash
cd api
npm run dev
```

### Test the API Endpoint
```bash
curl http://localhost:3000/api/soil-climate/demo
```

You should see a response with real data if your API keys are configured correctly.

## 📊 Step 5: Understanding the Data Flow

### How It Works:
1. **User selects coordinates** using the CoordinatePicker component
2. **Frontend calls** `/api/soil-climate/:listingId` endpoint
3. **Backend fetches** real data from:
   - OpenWeatherMap API (weather data)
   - SoilGrids API (soil composition)
4. **Data is processed** and Bhumi Score calculated
5. **Fallback system** provides demo data if APIs fail

### Data Sources:
- **Weather Data**: OpenWeatherMap 5-day forecast API
- **Soil Data**: ISRIC SoilGrids global soil database
- **Fallback**: Generated demo data when APIs are unavailable

## 🛠️ Step 6: Customization Options

### Modify API Endpoints
Edit `api/routes/soilClimate.js` to:
- Change coordinate sources
- Modify Bhumi Score calculation
- Add new data sources
- Customize recommendations

### Frontend Customization
Edit `client/src/components/CoordinatePicker.jsx` to:
- Add map integration
- Modify coordinate input methods
- Change UI styling

## 🚨 Troubleshooting

### Common Issues:

#### 1. "OpenWeatherMap API key not configured"
- Check your `.env` file exists in the `api` directory
- Verify the API key is correct and not wrapped in quotes
- Restart the server after making changes

#### 2. "Weather API request failed: 401"
- Your OpenWeatherMap API key is invalid
- Check if you've exceeded the free tier limit
- Verify the key is active in your OpenWeatherMap dashboard

#### 3. "Soil API request failed: 429"
- SoilGrids API has rate limiting
- Wait a few minutes and try again
- Consider implementing request caching

#### 4. Frontend shows "Demo data (APIs not configured)"
- Check browser console for errors
- Verify server is running on port 3000
- Check CORS settings in your server

### Debug Steps:
1. Check server console for error messages
2. Verify API keys in `.env` file
3. Test API endpoints directly with curl/Postman
4. Check browser network tab for failed requests

## 🔒 Security Considerations

### API Key Security:
- Never expose API keys in frontend code
- Use environment variables for all sensitive data
- Consider implementing API key rotation
- Monitor API usage to prevent abuse

### Rate Limiting:
- OpenWeatherMap: 1,000 calls/day (free tier)
- SoilGrids: 10 requests/minute
- Implement caching for production use

## 📈 Production Deployment

### Environment Setup:
```bash
# Production .env
NODE_ENV=production
MONGO=your_production_mongodb_url
OPENWEATHER_API_KEY=your_production_key
GOOGLE_MAPS_API_KEY=your_production_key
PORT=3000
```

### Performance Optimization:
- Implement Redis caching for API responses
- Add request rate limiting
- Use CDN for static assets
- Monitor API usage and costs

## 🎉 Success Indicators

You'll know the integration is working when:
- ✅ API endpoint returns real weather data
- ✅ Soil composition data is accurate
- ✅ Bhumi Score calculations are realistic
- ✅ Frontend displays "Real-time data from APIs"
- ✅ No more "Demo data" warnings

## 📚 Additional Resources

### API Documentation:
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [SoilGrids API Docs](https://www.isric.org/explore/soilgrids/soilgrids-rest-api)
- [Google Maps API Docs](https://developers.google.com/maps/documentation)

### Support:
- Check the troubleshooting section above
- Review server console logs
- Test API endpoints individually
- Verify environment variable configuration

## 🚀 Next Steps

After successful setup:
1. **Test with different coordinates** to verify accuracy
2. **Customize Bhumi Score algorithm** for your specific needs
3. **Add more data sources** (e.g., elevation, water table)
4. **Implement caching** for better performance
5. **Add user location history** and favorites

---

**Need Help?** Check the troubleshooting section or review the server logs for specific error messages.
