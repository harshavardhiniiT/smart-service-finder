import { Link } from 'react-router-dom';
import './ShopCard.css';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i - 0.5 <= rating) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else {
      stars.push(<span key={i} className="star">★</span>);
    }
  }
  return <span className="stars">{stars}</span>;
}

function ShopCard({ shop, isTopRated }) {
  return (
    <div className="shop-card" id={`shop-card-${shop._id}`}>
      {isTopRated && (
        <div className="badge badge-top">🏆 Top Rated</div>
      )}
      <div className="shop-card-header">
        <div className="shop-card-info">
          <Link to={`/shop/${shop._id}`} className="shop-card-name">
            {shop.name}
          </Link>
          <div className="shop-card-rating">
            <StarRating rating={shop.rating} />
            <span className="rating-value">{shop.rating}</span>
            <span className="review-count">({shop.reviews?.length || 0} reviews)</span>
          </div>
        </div>
      </div>

      <div className="shop-card-details">
        <div className="shop-card-detail">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{shop.address}</span>
        </div>
        {shop.distance !== null && shop.distance !== undefined && (
          <div className="shop-card-detail">
            <span className="detail-icon">📏</span>
            <span className="detail-text distance-text">{shop.distance} km away</span>
          </div>
        )}
        <div className="shop-card-detail">
          <span className="detail-icon">💰</span>
          <span className="detail-text">{shop.priceRange}</span>
        </div>
      </div>

      <div className="shop-card-actions">
        <Link to={`/shop/${shop._id}`} className="btn-details" id={`view-details-${shop._id}`}>
          View Details
        </Link>
        <a href={`tel:${shop.phone}`} className="btn-call" id={`call-${shop._id}`}>
          📞 Call Now
        </a>
      </div>
    </div>
  );
}

export default ShopCard;
