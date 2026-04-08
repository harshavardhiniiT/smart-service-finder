import { useState, useMemo, useContext } from 'react';
import { LocationContext } from '../App';
import CategoryCard from '../components/CategoryCard';
import NearbyShopCard from '../components/NearbyShopCard';
import nearbyShops from '../data/nearbyShops';
import { calculateDistance } from '../utils/distance';
import './Home.css';

const categories = [
  'AC Repair',
  'Bike Repair',
  'Car Service',
  'Electrician',
  'Plumber',
  'Laptop Repair',
  'Mobile Repair',
  'Cleaning Services'
];

const NEARBY_RADIUS_KM = 10;

function Home() {
  const [search, setSearch] = useState('');
  const { location } = useContext(LocationContext);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    return categories.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const nearbyWithDistance = useMemo(() => {
    if (!location) return [];
    return nearbyShops
      .map((shop) => ({
        ...shop,
        distance: calculateDistance(location.lat, location.lng, shop.lat, shop.lng)
      }))
      .filter((shop) => shop.distance <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [location]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">✨ Find trusted professionals near you</div>
            <h1 className="hero-title">
              Find the <span className="gradient-text">Right Service</span>
              <br />for Every Need
            </h1>
            <p className="hero-subtitle">
              Browse from dozens of local service providers.
              Compare ratings, prices & reviews — all in one place.
            </p>
            <div className="hero-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                id="service-search"
                className="search-input"
                placeholder="Search for a service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>
          <div className="hero-decoration">
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
            <div className="hero-orb orb-3"></div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Services</h2>
            <p className="section-subtitle">
              {filtered.length} service{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {filtered.length > 0 ? (
            <div className="categories-grid">
              {filtered.map((name) => (
                <CategoryCard key={name} name={name} />
              ))}
            </div>
          ) : (
            <div className="empty-container">
              <span className="empty-icon">🔍</span>
              <p className="empty-title">No services match your search</p>
              <p className="empty-message">Try a different keyword</p>
            </div>
          )}
        </div>
      </section>

      {/* Nearby Services Section */}
      {nearbyWithDistance.length > 0 && (
        <section className="nearby-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">📍 Nearby Services</h2>
              <p className="section-subtitle">
                {nearbyWithDistance.length} service{nearbyWithDistance.length !== 1 ? 's' : ''} within {NEARBY_RADIUS_KM} km
              </p>
            </div>
            <div className="nearby-grid">
              {nearbyWithDistance.map((shop) => (
                <NearbyShopCard key={shop.id} shop={shop} distance={shop.distance} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
