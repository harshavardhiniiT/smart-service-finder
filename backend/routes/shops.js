const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// Haversine-inspired Euclidean approximation — returns km
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 111; // ~111 km per degree of latitude
  const dLat = lat2 - lat1;
  const dLng = (lng2 - lng1) * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
  return Math.sqrt(dLat * dLat + dLng * dLng) * R;
}

// GET /api/shops
// Query: service, lat, lng
router.get('/', async (req, res) => {
  try {
    const { service, lat, lng } = req.query;

    if (!service) {
      return res.status(400).json({ message: 'service query parameter is required' });
    }

    const filter = { serviceType: new RegExp(`^${service}$`, 'i') };
    const shops = await Shop.find(filter).lean();

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const hasLocation = !isNaN(userLat) && !isNaN(userLng);

    const results = shops.map((shop) => {
      let distance = null;
      if (hasLocation) {
        distance = calculateDistance(userLat, userLng, shop.location.lat, shop.location.lng);
        distance = Math.round(distance * 10) / 10; // round to 1 decimal
      }
      return { ...shop, distance };
    });

    if (hasLocation) {
      results.sort((a, b) => a.distance - b.distance);
    }

    res.json(results);
  } catch (err) {
    console.error('Error fetching shops:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/shops/:id
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).lean();
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (err) {
    console.error('Error fetching shop:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/shops/:id/reviews — Add a review to a shop
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user, rating, comment } = req.body;

    if (!user || !rating) {
      return res.status(400).json({ message: 'user and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shop.reviews.push({ user, rating, comment: comment || '' });

    // Recalculate average rating
    const totalRating = shop.reviews.reduce((sum, r) => sum + r.rating, 0);
    shop.rating = Math.round((totalRating / shop.reviews.length) * 10) / 10;

    await shop.save();
    res.status(201).json(shop);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
