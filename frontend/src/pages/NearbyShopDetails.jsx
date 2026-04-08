import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { LocationContext } from '../App';
import nearbyShops from '../data/nearbyShops';
import { calculateDistance } from '../utils/distance';
import GoogleMap from '../components/GoogleMap';
import './NearbyShopDetails.css';

function StarRating({ rating }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </span>
  );
}

function NearbyShopDetails() {
  const { id } = useParams();
  const { location } = useContext(LocationContext);

  const shop = nearbyShops.find((s) => s.id === id);

  if (!shop) {
    return (
      <div className="nearby-details-page">
        <div className="container">
          <Link to="/" className="back-button">← Back to Home</Link>
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">Shop not found.</p>
            <Link to="/" className="error-retry-btn">Browse Services</Link>
          </div>
        </div>
      </div>
    );
  }

  const distance = location
    ? calculateDistance(location.lat, location.lng, shop.lat, shop.lng)
    : null;

  return (
    <div className="nearby-details-page">
      <div className="container">
        <Link to="/" className="back-button">← Back to Nearby Services</Link>

        {/* Hero */}
        <div className="shop-hero">
          <div className="shop-hero-content">
            <div className="shop-hero-badge">{shop.category}</div>
            <h1 className="shop-hero-name">{shop.name}</h1>
            <div className="shop-hero-rating">
              <StarRating rating={shop.rating} />
              <span className="shop-hero-rating-value">{shop.rating}</span>
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
          {distance !== null && (
            <div className="info-card">
              <div className="info-card-icon">📏</div>
              <div className="info-card-label">Distance</div>
              <div className="info-card-value nearby-distance-value">{distance} km away</div>
            </div>
          )}
        </div>

        {/* Description */}
        {shop.description && (
          <div className="nearby-description-section">
            <h2 className="nearby-description-title">About</h2>
            <p className="nearby-description-text">{shop.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="cta-section">
          <a href={`tel:${shop.phone}`} className="cta-button cta-call-btn">
            📞 Call {shop.name}
          </a>
        </div>

        {/* Google Map */}
        <GoogleMap lat={shop.lat} lng={shop.lng} name={shop.name} />
      </div>
    </div>
  );
}

export default NearbyShopDetails;
