const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
}, { _id: false });

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serviceType: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  priceRange: { type: String, required: true },
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
