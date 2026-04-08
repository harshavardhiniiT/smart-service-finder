import { Link } from 'react-router-dom';
import './NearbyShopCard.css';

function NearbyShopCard({ shop, distance }) {
  return (
    <div className="nearby-card" id={`nearby-card-${shop.id}`}>
      <div className="nearby-card-top">
        <div className="nearby-card-badge">{shop.category}</div>
        <div className="nearby-card-distance">
          <span className="nearby-distance-icon">📏</span>
          {distance} km
        </div>
      </div>

      <h3 className="nearby-card-name">{shop.name}</h3>

      <div className="nearby-card-rating">
        <span className="nearby-card-stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`star ${i <= Math.round(shop.rating) ? 'filled' : ''}`}>★</span>
          ))}
        </span>
        <span className="nearby-card-rating-value">{shop.rating}</span>
      </div>

      <div className="nearby-card-address">
        <span>📍</span>
        <span>{shop.address}</span>
      </div>

      <Link to={`/nearby/${shop.id}`} className="nearby-card-btn" id={`view-nearby-${shop.id}`}>
        View Details
      </Link>
    </div>
  );
}

export default NearbyShopCard;
