const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings — Create a new booking
router.post('/', async (req, res) => {
  try {
    const { userName, address, shopId, selectedDate, selectedTime } = req.body;

    if (!userName || !address || !shopId || !selectedDate || !selectedTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const booking = new Booking({
      userName,
      address,
      shopId,
      selectedDate,
      selectedTime,
      bookingStatus: 'pending'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings — Get bookings (optional ?userName= filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userName) {
      filter.userName = new RegExp(`^${req.query.userName}$`, 'i');
    }

    const bookings = await Booking.find(filter)
      .populate('shopId', 'name serviceType address phone')
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/bookings/:id/complete — Mark booking as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: 'completed' },
      { new: true }
    ).populate('shopId', 'name serviceType address phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error completing booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
