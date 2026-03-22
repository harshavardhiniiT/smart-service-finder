import { Link } from 'react-router-dom';
import './CategoryCard.css';

const iconMap = {
  'AC Repair': '❄️',
  'Bike Repair': '🏍️',
  'Car Service': '🚗',
  'Electrician': '⚡',
  'Plumber': '🔧',
  'Laptop Repair': '💻',
  'Mobile Repair': '📱',
  'Cleaning Services': '🧹'
};

const colorMap = {
  'AC Repair': '#3b82f6',
  'Bike Repair': '#ef4444',
  'Car Service': '#f59e0b',
  'Electrician': '#fbbf24',
  'Plumber': '#06b6d4',
  'Laptop Repair': '#8b5cf6',
  'Mobile Repair': '#10b981',
  'Cleaning Services': '#ec4899'
};

function CategoryCard({ name }) {
  const icon = iconMap[name] || '🛠️';
  const color = colorMap[name] || '#6366f1';

  return (
    <Link to={`/service/${encodeURIComponent(name)}`} className="category-card" id={`category-${name.replace(/\s+/g,'-').toLowerCase()}`}>
      <div className="category-card-glow" style={{ background: `radial-gradient(circle, ${color}22 0%, transparent 70%)` }}></div>
      <div className="category-card-icon" style={{ background: `${color}18`, borderColor: `${color}40` }}>
        <span>{icon}</span>
      </div>
      <h3 className="category-card-title">{name}</h3>
      <div className="category-card-arrow" style={{ color }}>→</div>
    </Link>
  );
}

export default CategoryCard;
