import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Basic Property Information
  propertyId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  
  // Precise Coordinates (Critical for accuracy)
  coordinates: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    lon: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  
  // Property Details
  area: {
    value: Number,
    unit: {
      type: String,
      enum: ['acres', 'sqft', 'sqm', 'hectares'],
      default: 'acres'
    }
  },
  price: {
    value: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Soil & Climate Data (Property-specific)
  soilClimateData: {
    lastUpdated: Date,
    dataSource: {
      type: String,
      enum: ['real', 'demo', 'fallback'],
      default: 'demo'
    },
    soil: {
      ph: Number,
      organicMatter: Number,
      clay: Number,
      silt: Number,
      sand: Number,
      moisture: Number,
      slope: Number,
      texture: String
    },
    weather: {
      current: {
        temp: Number,
        humidity: Number,
        description: String
      },
      forecast: [{
        date: Date,
        temp: Number,
        humidity: Number,
        description: String,
        rain: Number
      }],
      tempVariation: Number,
      rainfall: Number
    },
    bhumiScore: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendations: {
      crops: [String],
      construction: String,
      general: String
    }
  },
  
  // Property Features
  features: [{
    type: String,
    enum: ['agricultural', 'residential', 'commercial', 'industrial', 'mixed']
  }],
  
  // Owner Information
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['available', 'sold', 'under-contract', 'reserved'],
    default: 'available'
  },
  
  // Images
  images: [String],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
propertySchema.index({ coordinates: '2dsphere' });
propertySchema.index({ city: 1, status: 1 });
propertySchema.index({ 'soilClimateData.bhumiScore': -1 });

// Virtual for Bhumi Score category
propertySchema.virtual('bhumiScoreCategory').get(function() {
  const score = this.soilClimateData?.bhumiScore;
  if (!score) return 'Not Available';
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Limited';
});

// Method to update soil climate data
propertySchema.methods.updateSoilClimateData = async function(newData) {
  this.soilClimateData = {
    ...newData,
    lastUpdated: new Date()
  };
  return this.save();
};

// Method to get property analysis summary
propertySchema.methods.getAnalysisSummary = function() {
  const data = this.soilClimateData;
  if (!data || !data.bhumiScore) {
    return {
      status: 'Analysis Pending',
      message: 'Soil and climate analysis not yet completed for this property'
    };
  }
  
  return {
    status: 'Analysis Complete',
    bhumiScore: data.bhumiScore,
    category: this.bhumiScoreCategory,
    bestFor: data.recommendations?.crops?.slice(0, 3) || [],
    constructionSuitability: data.recommendations?.construction || 'Not assessed',
    lastUpdated: data.lastUpdated
  };
};

// Static method to find properties by area
propertySchema.statics.findByArea = function(city, minScore = 0, maxScore = 100) {
  return this.find({
    city: new RegExp(city, 'i'),
    'soilClimateData.bhumiScore': { $gte: minScore, $lte: maxScore },
    status: 'available'
  }).sort({ 'soilClimateData.bhumiScore': -1 });
};

// Static method to find properties by coordinates (nearby search)
propertySchema.statics.findNearby = function(lat, lon, maxDistance = 5000) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'available'
  }).limit(20);
};

const Property = mongoose.model('Property', propertySchema);

export default Property;
