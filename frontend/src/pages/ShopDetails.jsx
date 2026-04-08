import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import GoogleMap from '../components/GoogleMap';
import './ShopDetails.css';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : ''}`}>★</span>
    );
  }
  return <span className="stars">{stars}</span>;
}

function ShopDetails() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchShop();
  }, [id]);

  const fetchShop = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/shops/${id}`);
      setShop(res.data);
    } catch (err) {
      console.error('Error fetching shop:', err);
      setError('Failed to load shop details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="shop-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading shop details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="shop-details-page">
        <div className="container">
          <Link to="/" className="back-button">← Back to Services</Link>
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error || 'Shop not found.'}</p>
            <Link to="/" className="error-retry-btn">Browse Services</Link>
          </div>
        </div>
      </div>
    );
  }

  const avgReviewRating = shop.reviews?.length
    ? (shop.reviews.reduce((sum, r) => sum + r.rating, 0) / shop.reviews.length).toFixed(1)
    : shop.rating;

  return (
    <div className="shop-details-page">
      <div className="container">
        <Link to={`/service/${encodeURIComponent(shop.serviceType)}`} className="back-button">
          ← Back to {shop.serviceType}
        </Link>

        {/* Header */}
        <div className="shop-hero">
          <div className="shop-hero-content">
            <div className="shop-hero-badge">{shop.serviceType}</div>
            <h1 className="shop-hero-name">{shop.name}</h1>
            <div className="shop-hero-rating">
              <StarRating rating={shop.rating} />
              <span className="shop-hero-rating-value">{shop.rating}</span>
              <span className="shop-hero-review-count">
                ({shop.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">📍</div>
            <div className="info-card-label">Address</div>
            <div className="info-card-value">{shop.address}</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">📞</div>
            <div className="info-card-label">Phone</div>
            <a href={`tel:${shop.phone}`} className="info-card-value info-card-phone">
              {shop.phone}
            </a>
          </div>
          <div className="info-card">
            <div className="info-card-icon">💰</div>
            <div className="info-card-label">Price Range</div>
            <div className="info-card-value">{shop.priceRange}</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">⭐</div>
            <div className="info-card-label">Avg. Rating</div>
            <div className="info-card-value">{avgReviewRating} / 5</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <button
            className="cta-button cta-book-btn"
            id="book-service-btn"
            onClick={() => setShowBooking(true)}
          >
            📅 Book Service
          </button>
          <a href={`tel:${shop.phone}`} className="cta-button cta-call-btn" id="call-shop-btn">
            📞 Call {shop.name}
          </a>
        </div>

        {/* Google Map */}
        {shop.location && (
          <GoogleMap lat={shop.location.lat} lng={shop.location.lng} name={shop.name} />
        )}

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="reviews-title">
            Customer Reviews
            <span className="reviews-count">{shop.reviews?.length || 0}</span>
          </h2>

          {shop.reviews && shop.reviews.length > 0 ? (
            <div className="reviews-list">
              {shop.reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="review-meta">
                      <span className="review-user">{review.user}</span>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-container">
              <span className="empty-icon">💬</span>
              <p className="empty-title">No reviews yet</p>
              <p className="empty-message">Be the first to leave a review!</p>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <BookingForm
            shop={shop}
            onClose={() => setShowBooking(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ShopDetails;
