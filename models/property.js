const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  id: String,
  title: String,
  type: String,
  price: Number,
  state: String,
  city: String,
  areaSqFt: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  furnished: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
  },
  availableFrom: {
    type: Date,
    default: Date.now,
  },
  listedBy: String,
  tags: [String],
  colorTheme: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  listingType: {
    type: String,
    enum: ['sale', 'rent'],
  },
  createdBy: String, 
});

module.exports = mongoose.model('Property', propertySchema);
