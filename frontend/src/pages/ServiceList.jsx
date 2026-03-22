import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LocationContext } from '../App';
import ShopCard from '../components/ShopCard';
import './ServiceList.css';

function ServiceList() {
  const { type } = useParams();
  const { location } = useContext(LocationContext);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetchShops();
  }, [type, location]);

  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { service: type };
      if (location) {
        params.lat = location.lat;
        params.lng = location.lng;
      }
      const res = await axios.get('http://localhost:5000/api/shops', { params });
      setShops(res.data);
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError('Failed to load shops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const topRatedThreshold = useMemo(() => {
    if (shops.length === 0) return 5;
    const sorted = [...shops].sort((a, b) => b.rating - a.rating);
    return sorted[0]?.rating || 5;
  }, [shops]);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      if (shop.rating < ratingFilter) return false;
      if (priceFilter !== 'all') {
        const match = shop.priceRange.match(/₹(\d+)/);
        const minPrice = match ? parseInt(match[1]) : 0;
        if (priceFilter === 'budget' && minPrice > 500) return false;
        if (priceFilter === 'mid' && (minPrice <= 500 || minPrice > 1000)) return false;
        if (priceFilter === 'premium' && minPrice <= 1000) return false;
      }
      return true;
    });
  }, [shops, ratingFilter, priceFilter]);

  return (
    <div className="service-list-page">
      <div className="container">
        <Link to="/" className="back-button">← Back to Services</Link>

        <div className="page-header">
          <h1 className="page-title">{decodeURIComponent(type)}</h1>
          <p className="page-subtitle">
            {filteredShops.length} provider{filteredShops.length !== 1 ? 's' : ''} found near you
          </p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Min Rating</label>
            <div className="filter-options">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  className={`filter-btn ${ratingFilter === r ? 'active' : ''}`}
                  onClick={() => setRatingFilter(r)}
                >
                  {r === 0 ? 'All' : `${r}+ ★`}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Price</label>
            <div className="filter-options">
              {[
                { value: 'all', label: 'All' },
                { value: 'budget', label: 'Budget' },
                { value: 'mid', label: 'Mid-Range' },
                { value: 'premium', label: 'Premium' }
              ].map((p) => (
                <button
                  key={p.value}
                  className={`filter-btn ${priceFilter === p.value ? 'active' : ''}`}
                  onClick={() => setPriceFilter(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Finding nearby providers...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button className="error-retry-btn" onClick={fetchShops}>
              Try Again
            </button>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="empty-container">
            <span className="empty-icon">🏪</span>
            <p className="empty-title">No shops found</p>
            <p className="empty-message">
              Try adjusting your filters or search for a different service.
            </p>
          </div>
        ) : (
          <div className="shops-grid">
            {filteredShops.map((shop) => (
              <ShopCard
                key={shop._id}
                shop={shop}
                isTopRated={shop.rating >= topRatedThreshold && shop.rating >= 4.5}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceList;
