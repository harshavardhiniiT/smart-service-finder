import './GoogleMap.css';

function GoogleMap({ lat, lng, name }) {
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="google-map-section">
      <h2 className="google-map-title">
        📍 Location
      </h2>
      <div className="google-map-container">
        <iframe
          title={`Map of ${name || 'Shop'}`}
          src={mapSrc}
          className="google-map-iframe"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="google-map-link"
      >
        🗺️ Open in Google Maps →
      </a>
    </div>
  );
}

export default GoogleMap;
