import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ServiceList from './pages/ServiceList';
import ShopDetails from './pages/ShopDetails';
import MyBookings from './pages/MyBookings';
import NearbyShopDetails from './pages/NearbyShopDetails';
import './App.css';

export const LocationContext = createContext(null);

function Navbar({ location }) {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">🔍</span>
          Smart Service Finder
        </Link>
        <div className="navbar-right">
          <Link to="/my-bookings" className="navbar-link" id="nav-my-bookings">
            📋 My Bookings
          </Link>
          <div className="navbar-location">
            <span className="loc-dot"></span>
            {location
              ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
              : '📍 Detecting location...'}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setLocationError(err.message);
          // Default to Chennai
          setLocation({ lat: 13.0827, lng: 80.2707 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocation({ lat: 13.0827, lng: 80.2707 });
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, locationError }}>
      <Router>
        <ScrollToTop />
        <Navbar location={location} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service/:type" element={<ServiceList />} />
            <Route path="/shop/:id" element={<ShopDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/nearby/:id" element={<NearbyShopDetails />} />
          </Routes>
        </main>
      </Router>
    </LocationContext.Provider>
  );
}

export default App;
