import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import './MyBookings.css';

function MyBookings() {
  const [userName, setUserName] = useState('');
  const [searchName, setSearchName] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const fetchBookings = async (name) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings?userName=${encodeURIComponent(name.trim())}`);
      setBookings(res.data);
      setSearchName(name.trim());
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(userName);
  };

  const handleComplete = async (bookingId, shopId, shopName) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/complete`);
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, bookingStatus: 'completed' } : b)
      );
      // Auto-open review modal
      setReviewTarget({ shopId, shopName, bookingId });
    } catch (err) {
      console.error('Error completing booking:', err);
      alert('Failed to mark as completed.');
    }
  };

  const closeReview = () => {
    setReviewTarget(null);
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        <Link to="/" className="back-button">← Back to Home</Link>

        <div className="my-bookings-header">
          <h1 className="my-bookings-title">📋 My Bookings</h1>
          <p className="my-bookings-subtitle">View and manage your service bookings</p>
        </div>

        <form className="my-bookings-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name to find bookings"
            className="my-bookings-search-input"
            required
          />
          <button type="submit" className="my-bookings-search-btn">Search</button>
        </form>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading bookings...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && searchName && bookings.length === 0 && (
          <div className="empty-container">
            <span className="empty-icon">📭</span>
            <p className="empty-title">No bookings found</p>
            <p className="empty-message">No bookings found for "{searchName}".</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-card-info">
                    <h3 className="booking-card-shop">
                      {booking.shopId?.name || 'Unknown Shop'}
                    </h3>
                    <span className="booking-card-service">
                      {booking.shopId?.serviceType || ''}
                    </span>
                  </div>
                  <span className={`booking-status-badge ${booking.bookingStatus}`}>
                    {booking.bookingStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                  </span>
                </div>

                <div className="booking-card-details">
                  <div className="booking-detail">
                    <span className="booking-detail-icon">📅</span>
                    <span>{booking.selectedDate}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="booking-detail-icon">🕐</span>
                    <span>{booking.selectedTime}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="booking-detail-icon">📍</span>
                    <span>{booking.address}</span>
                  </div>
                </div>

                {booking.bookingStatus === 'pending' && (
                  <button
                    className="booking-complete-btn"
                    onClick={() => handleComplete(
                      booking._id,
                      booking.shopId?._id,
                      booking.shopId?.name
                    )}
                  >
                    ✅ Mark as Completed
                  </button>
                )}

                {booking.bookingStatus === 'completed' && (
                  <button
                    className="booking-review-btn"
                    onClick={() => setReviewTarget({
                      shopId: booking.shopId?._id,
                      shopName: booking.shopId?.name,
                      bookingId: booking._id
                    })}
                  >
                    ⭐ Leave a Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {reviewTarget && (
          <ReviewForm
            shopId={reviewTarget.shopId}
            shopName={reviewTarget.shopName}
            userName={searchName}
            onClose={closeReview}
            onReviewSubmitted={closeReview}
          />
        )}
      </div>
    </div>
  );
}

export default MyBookings;
