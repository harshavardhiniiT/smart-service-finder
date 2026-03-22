const mongoose = require('mongoose');
const Shop = require('./models/Shop');

const MONGO_URI = 'mongodb://localhost:27017/smart-service-finder';

const shops = [
  // --- AC Repair ---
  {
    name: 'CoolBreeze AC Solutions',
    serviceType: 'AC Repair',
    location: { lat: 13.0827, lng: 80.2707 },
    address: '12, Anna Salai, T. Nagar, Chennai 600017',
    phone: '+919876543210',
    rating: 4.5,
    priceRange: '₹500 - ₹3000',
    reviews: [
      { user: 'Ravi K.', comment: 'Fixed my split AC in under an hour. Very professional!', rating: 5 },
      { user: 'Priya S.', comment: 'Good service but slightly expensive.', rating: 4 }
    ]
  },
  {
    name: 'ArcticAir Services',
    serviceType: 'AC Repair',
    location: { lat: 13.0674, lng: 80.2376 },
    address: '45, Velachery Main Rd, Velachery, Chennai 600042',
    phone: '+919876543211',
    rating: 4.2,
    priceRange: '₹400 - ₹2500',
    reviews: [
      { user: 'Karthik M.', comment: 'Quick response time. Technician was knowledgeable.', rating: 4 },
      { user: 'Anjali R.', comment: 'Affordable and reliable service.', rating: 5 }
    ]
  },
  // --- Bike Repair ---
  {
    name: 'SpeedWheels Garage',
    serviceType: 'Bike Repair',
    location: { lat: 13.0604, lng: 80.2496 },
    address: '78, Adyar Main Rd, Adyar, Chennai 600020',
    phone: '+919876543212',
    rating: 4.7,
    priceRange: '₹200 - ₹2000',
    reviews: [
      { user: 'Suresh P.', comment: 'Best bike mechanic in the area. Highly recommended!', rating: 5 },
      { user: 'Divya N.', comment: 'Fixed my brakes and chain perfectly.', rating: 5 }
    ]
  },
  {
    name: 'TwoWheeler Hub',
    serviceType: 'Bike Repair',
    location: { lat: 13.0878, lng: 80.2785 },
    address: '23, Poonamallee High Rd, Kilpauk, Chennai 600010',
    phone: '+919876543213',
    rating: 4.0,
    priceRange: '₹150 - ₹1500',
    reviews: [
      { user: 'Arun V.', comment: 'Decent service. Could improve on turnaround time.', rating: 3 },
      { user: 'Meena L.', comment: 'Fair prices and honest work.', rating: 4 }
    ]
  },
  // --- Car Service ---
  {
    name: 'DriveMax Auto Care',
    serviceType: 'Car Service',
    location: { lat: 13.0524, lng: 80.2508 },
    address: '90, Guindy Industrial Estate, Guindy, Chennai 600032',
    phone: '+919876543214',
    rating: 4.8,
    priceRange: '₹1000 - ₹8000',
    reviews: [
      { user: 'Vijay T.', comment: 'Top-notch car service. My car runs like new!', rating: 5 },
      { user: 'Lakshmi G.', comment: 'Premium quality service at reasonable prices.', rating: 5 }
    ]
  },
  {
    name: 'AutoElite Garage',
    serviceType: 'Car Service',
    location: { lat: 13.1067, lng: 80.2840 },
    address: '56, Perambur High Rd, Perambur, Chennai 600011',
    phone: '+919876543215',
    rating: 3.9,
    priceRange: '₹800 - ₹6000',
    reviews: [
      { user: 'Ramesh B.', comment: 'Good for basic servicing. A bit slow for major work.', rating: 4 },
      { user: 'Deepa K.', comment: 'Friendly staff, average service quality.', rating: 3 }
    ]
  },
  // --- Electrician ---
  {
    name: 'BrightSpark Electricals',
    serviceType: 'Electrician',
    location: { lat: 13.0735, lng: 80.2580 },
    address: '34, Nungambakkam High Rd, Nungambakkam, Chennai 600034',
    phone: '+919876543216',
    rating: 4.6,
    priceRange: '₹300 - ₹2000',
    reviews: [
      { user: 'Ganesh R.', comment: 'Fixed all my electrical issues in one visit. Excellent!', rating: 5 },
      { user: 'Kavitha S.', comment: 'Prompt and professional.', rating: 4 }
    ]
  },
  {
    name: 'VoltFix Services',
    serviceType: 'Electrician',
    location: { lat: 13.0450, lng: 80.2340 },
    address: '67, Pallavaram Main Rd, Chromepet, Chennai 600044',
    phone: '+919876543217',
    rating: 4.1,
    priceRange: '₹250 - ₹1800',
    reviews: [
      { user: 'Sanjay M.', comment: 'Reasonable rates. Good wiring work.', rating: 4 },
      { user: 'Nithya P.', comment: 'Had to call back for a minor fix but overall okay.', rating: 3 }
    ]
  },
  // --- Plumber ---
  {
    name: 'FlowRight Plumbing',
    serviceType: 'Plumber',
    location: { lat: 13.0900, lng: 80.2600 },
    address: '12, Chetpet Main Rd, Chetpet, Chennai 600031',
    phone: '+919876543218',
    rating: 4.4,
    priceRange: '₹300 - ₹2500',
    reviews: [
      { user: 'Mohan K.', comment: 'Fixed a major leak quickly. Very reliable.', rating: 5 },
      { user: 'Geetha V.', comment: 'Good work, but arrived late.', rating: 4 }
    ]
  },
  {
    name: 'PipeMaster Services',
    serviceType: 'Plumber',
    location: { lat: 13.0350, lng: 80.2450 },
    address: '89, Tambaram Main Rd, Tambaram, Chennai 600045',
    phone: '+919876543219',
    rating: 3.8,
    priceRange: '₹200 - ₹2000',
    reviews: [
      { user: 'Venkat S.', comment: 'Affordable plumbing solutions.', rating: 4 },
      { user: 'Sunita R.', comment: 'Average service. Had to follow up.', rating: 3 }
    ]
  },
  // --- Laptop Repair ---
  {
    name: 'TechRevive Laptops',
    serviceType: 'Laptop Repair',
    location: { lat: 13.0780, lng: 80.2650 },
    address: '22, Ritchie Street, Mount Road, Chennai 600002',
    phone: '+919876543220',
    rating: 4.7,
    priceRange: '₹500 - ₹5000',
    reviews: [
      { user: 'Ashwin P.', comment: 'Replaced my laptop screen perfectly. Feels brand new!', rating: 5 },
      { user: 'Rekha M.', comment: 'Fast turnaround and genuine parts.', rating: 5 }
    ]
  },
  {
    name: 'ByteFix Solutions',
    serviceType: 'Laptop Repair',
    location: { lat: 13.0490, lng: 80.2410 },
    address: '5, Porur Junction, Porur, Chennai 600116',
    phone: '+919876543221',
    rating: 4.0,
    priceRange: '₹400 - ₹4000',
    reviews: [
      { user: 'Prakash T.', comment: 'Good for hardware repairs. Software fixes need improvement.', rating: 4 },
      { user: 'Jaya K.', comment: 'Decent prices. Took an extra day though.', rating: 3 }
    ]
  },
  // --- Mobile Repair ---
  {
    name: 'ScreenSaver Mobile Fix',
    serviceType: 'Mobile Repair',
    location: { lat: 13.0660, lng: 80.2610 },
    address: '14, Burma Bazaar, Parrys, Chennai 600001',
    phone: '+919876543222',
    rating: 4.5,
    priceRange: '₹300 - ₹4000',
    reviews: [
      { user: 'Naveen R.', comment: 'Screen replacement done in 30 minutes. Impressive!', rating: 5 },
      { user: 'Shalini V.', comment: 'Good service but the waiting area could be better.', rating: 4 }
    ]
  },
  {
    name: 'PhoneDoc Repairs',
    serviceType: 'Mobile Repair',
    location: { lat: 13.0950, lng: 80.2330 },
    address: '38, Anna Nagar 2nd Avenue, Anna Nagar, Chennai 600040',
    phone: '+919876543223',
    rating: 4.3,
    priceRange: '₹250 - ₹3500',
    reviews: [
      { user: 'Bala M.', comment: 'Fixed my phone battery issue. Works great now.', rating: 5 },
      { user: 'Pooja S.', comment: 'Honest pricing. Will come back.', rating: 4 }
    ]
  },
  // --- Cleaning Services ---
  {
    name: 'SparkleClean Home Services',
    serviceType: 'Cleaning Services',
    location: { lat: 13.0720, lng: 80.2510 },
    address: '71, Kodambakkam High Rd, Kodambakkam, Chennai 600024',
    phone: '+919876543224',
    rating: 4.6,
    priceRange: '₹500 - ₹3000',
    reviews: [
      { user: 'Lakshmi T.', comment: 'Deep cleaned my entire apartment beautifully!', rating: 5 },
      { user: 'Raja P.', comment: 'Great value for money. Very thorough.', rating: 5 }
    ]
  },
  {
    name: 'FreshHome Cleaners',
    serviceType: 'Cleaning Services',
    location: { lat: 13.1010, lng: 80.2680 },
    address: '99, ICF Colony, Villivakkam, Chennai 600049',
    phone: '+919876543225',
    rating: 4.0,
    priceRange: '₹400 - ₹2500',
    reviews: [
      { user: 'Shanthi M.', comment: 'Good cleaning but could be more punctual.', rating: 4 },
      { user: 'Kumar A.', comment: 'Satisfactory service for the price.', rating: 4 }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Shop.deleteMany({});
    console.log('Cleared existing shops');

    await Shop.insertMany(shops);
    console.log(`Seeded ${shops.length} shops successfully`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
