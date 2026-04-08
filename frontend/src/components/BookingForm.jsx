import { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
];

function BookingForm({ shop, onClose, onBooked }) {
  const [formData, setFormData] = useState({
    userName: '',
    address: '',
    selectedDate: '',
    selectedTime: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        userName: formData.userName,
        address: formData.address,
        shopId: shop._id,
        selectedDate: formData.selectedDate,
        selectedTime: formData.selectedTime
      });
      setSuccess(true);
      if (onBooked) onBooked(formData.userName);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to book service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal-close" onClick={onClose} aria-label="Close">×</button>

        {success ? (
          <div className="booking-success">
            <span className="booking-success-icon">✅</span>
            <h3 className="booking-success-title">Booking Confirmed!</h3>
            <p className="booking-success-text">
              Your service with <strong>{shop.name}</strong> has been booked for{' '}
              <strong>{formData.selectedDate}</strong> at <strong>{formData.selectedTime}</strong>.
            </p>
            <button className="booking-success-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="booking-modal-title">📅 Book Service</h2>
            <p className="booking-modal-subtitle">at {shop.name}</p>

            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-field">
                <label htmlFor="booking-userName">Your Name</label>
                <input
                  type="text"
                  id="booking-userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="booking-field">
                <label htmlFor="booking-address">Your Address</label>
                <input
                  type="text"
                  id="booking-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="booking-field">
                <label htmlFor="booking-date">Service Date</label>
                <input
                  type="date"
                  id="booking-date"
                  name="selectedDate"
                  value={formData.selectedDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <div className="booking-field">
                <label htmlFor="booking-time">Time Slot</label>
                <select
                  id="booking-time"
                  name="selectedTime"
                  value={formData.selectedTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time slot</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {error && <p className="booking-error">{error}</p>}

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Booking...' : '📅 Book Service'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingForm;
