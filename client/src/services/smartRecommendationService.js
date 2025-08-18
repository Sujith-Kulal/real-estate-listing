// Smart Recommendation Service for BHUMI
// This service calculates Transit Score and Livability Score based on property location

class SmartRecommendationService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  // Calculate Transit Score (0-10)
  async calculateTransitScore(latitude, longitude) {
    try {
      // In a real implementation, this would call Google Places API
      // For now, we'll use mock data and distance calculations
      
      const mockTransitData = [
        { name: 'Kittaganuru Bus Stop', lat: 12.9716, lng: 77.5946, type: 'bus', weight: 0.3 },
        { name: 'K R Puram Bus Depot', lat: 12.9716, lng: 77.5946, type: 'bus', weight: 0.25 },
        { name: 'Hiranandahalli Bus Stop', lat: 12.9716, lng: 77.5946, type: 'bus', weight: 0.2 },
        { name: 'Channenahalli Station', lat: 12.9716, lng: 77.5946, type: 'train', weight: 0.15 },
        { name: 'Cheemasandra Gate', lat: 12.9716, lng: 77.5946, type: 'bus', weight: 0.1 }
      ];

      let totalScore = 0;
      const transitDetails = [];

      for (const transit of mockTransitData) {
        const distance = this.calculateDistance(latitude, longitude, transit.lat, transit.lng);
        const score = this.calculateTransitPointScore(distance, transit.weight);
        totalScore += score;

        transitDetails.push({
          name: transit.name,
          distance: `${distance.toFixed(1)} km`,
          time: this.estimateTravelTime(distance),
          type: transit.type,
          score: score.toFixed(1)
        });
      }

      // Normalize score to 0-10 scale
      const finalScore = Math.min(10, Math.max(0, totalScore));
      
      return {
        score: Math.round(finalScore * 10) / 10,
        details: transitDetails,
        breakdown: {
          busStops: transitDetails.filter(t => t.type === 'bus').length,
          trainStations: transitDetails.filter(t => t.type === 'train').length,
          averageDistance: (transitDetails.reduce((sum, t) => sum + parseFloat(t.distance), 0) / transitDetails.length).toFixed(1)
        }
      };
    } catch (error) {
      console.error('Error calculating transit score:', error);
      return this.getFallbackTransitScore();
    }
  }

  // Calculate Livability Score (0-10)
  async calculateLivabilityScore(latitude, longitude) {
    try {
      const mockAmenitiesData = [
        { name: 'City Market', lat: 12.9716, lng: 77.5946, type: 'shopping', weight: 0.2 },
        { name: 'Apollo Hospital', lat: 12.9716, lng: 77.5946, type: 'hospital', weight: 0.25 },
        { name: 'St. Joseph School', lat: 12.9716, lng: 77.5946, type: 'school', weight: 0.2 },
        { name: 'Food Court', lat: 12.9716, lng: 77.5946, type: 'restaurant', weight: 0.15 },
        { name: 'Central Park', lat: 12.9716, lng: 77.5946, type: 'park', weight: 0.1 },
        { name: 'Bank ATM', lat: 12.9716, lng: 77.5946, type: 'bank', weight: 0.1 }
      ];

      let totalScore = 0;
      const livabilityDetails = [];

      for (const amenity of mockAmenitiesData) {
        const distance = this.calculateDistance(latitude, longitude, amenity.lat, amenity.lng);
        const score = this.calculateLivabilityPointScore(distance, amenity.weight);
        totalScore += score;

        livabilityDetails.push({
          name: amenity.name,
          distance: `${distance.toFixed(1)} km`,
          type: amenity.type,
          score: score.toFixed(1)
        });
      }

      // Normalize score to 0-10 scale
      const finalScore = Math.min(10, Math.max(0, totalScore));
      
      return {
        score: Math.round(finalScore * 10) / 10,
        details: livabilityDetails,
        breakdown: {
          hospitals: livabilityDetails.filter(a => a.type === 'hospital').length,
          schools: livabilityDetails.filter(a => a.type === 'school').length,
          shopping: livabilityDetails.filter(a => a.type === 'shopping').length,
          restaurants: livabilityDetails.filter(a => a.type === 'restaurant').length,
          parks: livabilityDetails.filter(a => a.type === 'park').length
        }
      };
    } catch (error) {
      console.error('Error calculating livability score:', error);
      return this.getFallbackLivabilityScore();
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Calculate transit score based on distance and weight
  calculateTransitPointScore(distance, weight) {
    if (distance <= 1) return weight * 10; // Excellent: 0-1 km
    if (distance <= 3) return weight * 8;  // Good: 1-3 km
    if (distance <= 5) return weight * 6;  // Fair: 3-5 km
    if (distance <= 8) return weight * 4;  // Poor: 5-8 km
    return weight * 2; // Very poor: >8 km
  }

  // Calculate livability score based on distance and weight
  calculateLivabilityPointScore(distance, weight) {
    if (distance <= 0.5) return weight * 10; // Excellent: 0-0.5 km
    if (distance <= 1.5) return weight * 8;  // Good: 0.5-1.5 km
    if (distance <= 3) return weight * 6;    // Fair: 1.5-3 km
    if (distance <= 5) return weight * 4;    // Poor: 3-5 km
    return weight * 2; // Very poor: >5 km
  }

  // Estimate travel time based on distance
  estimateTravelTime(distance) {
    if (distance <= 2) return `${Math.ceil(distance * 3)} mins`; // Walking
    if (distance <= 5) return `${Math.ceil(distance * 2)} mins`; // Bus
    if (distance <= 10) return `${Math.ceil(distance * 1.5)} mins`; // Bus/Train
    return `${Math.ceil(distance * 1.2)} mins`; // Long distance
  }

  // Get comprehensive scores for a property
  async getPropertyScores(latitude, longitude) {
    try {
      const [transitResult, livabilityResult] = await Promise.all([
        this.calculateTransitScore(latitude, longitude),
        this.calculateLivabilityScore(latitude, longitude)
      ]);

      return {
        transit: transitResult,
        livability: livabilityResult,
        overall: {
          score: Math.round(((transitResult.score + livabilityResult.score) / 2) * 10) / 10,
          grade: this.getScoreGrade((transitResult.score + livabilityResult.score) / 2)
        }
      };
    } catch (error) {
      console.error('Error getting property scores:', error);
      return this.getFallbackScores();
    }
  }

  // Get score grade (A+, A, B+, B, C, D)
  getScoreGrade(score) {
    if (score >= 9) return 'A+';
    if (score >= 8) return 'A';
    if (score >= 7) return 'B+';
    if (score >= 6) return 'B';
    if (score >= 5) return 'C';
    return 'D';
  }

  // Fallback methods for when API calls fail
  getFallbackTransitScore() {
    return {
      score: 6.2,
      details: [
        { name: 'Nearby Bus Stop', distance: '3.0 km', time: '10 mins', type: 'bus' },
        { name: 'Local Station', distance: '5.5 km', time: '15 mins', type: 'train' }
      ],
      breakdown: { busStops: 1, trainStations: 1, averageDistance: '4.3' }
    };
  }

  getFallbackLivabilityScore() {
    return {
      score: 8.5,
      details: [
        { name: 'Local Market', distance: '2.0 km', type: 'shopping' },
        { name: 'Community Hospital', distance: '4.0 km', type: 'hospital' },
        { name: 'Public School', distance: '1.5 km', type: 'school' }
      ],
      breakdown: { hospitals: 1, schools: 1, shopping: 1, restaurants: 0, parks: 0 }
    };
  }

  getFallbackScores() {
    return {
      transit: this.getFallbackTransitScore(),
      livability: this.getFallbackLivabilityScore(),
      overall: { score: 7.4, grade: 'B+' }
    };
  }

  // Future: Integrate with Google Places API
  async getNearbyPlaces(latitude, longitude, type, radius = 5000) {
    if (!this.apiKey) {
      console.warn('Google Maps API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby places');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      return [];
    }
  }
}

export default new SmartRecommendationService();
