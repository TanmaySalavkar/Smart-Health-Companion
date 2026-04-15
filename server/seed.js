require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

console.log("MONGO_URI:", process.env.MONGO_URI);
const mongoUri = process.env.MONGO_URI;

const doctors = [
  { 
    id: 1, name: "Dr. Sharma", specialization: "Cardiologist", rating: 4.5,
    description: "Dr. Sharma has over 15 years of experience in cardiovascular health. Renowned for a patient-centric approach.",
    availability: [
      { day: "Monday", times: ["09:00 AM", "10:00 AM", "11:30 AM"] },
      { day: "Wednesday", times: ["02:00 PM", "03:30 PM", "05:00 PM"] }
    ]
  },
  { 
    id: 2, name: "Dr. Mehta", specialization: "Dermatologist", rating: 4.2,
    description: "Dr. Mehta specializes in clinical and cosmetic dermatology. Dedicated to treating all types of skin conditions.",
    availability: [
      { day: "Tuesday", times: ["10:00 AM", "12:00 PM"] },
      { day: "Thursday", times: ["01:00 PM", "04:00 PM"] }
    ]
  },
  { 
    id: 3, name: "Dr. Roberts", specialization: "Neurologist", rating: 4.8,
    description: "Dr. Roberts is a globally recognized neurologist focusing on neurodegenerative diseases and complex nerve blocks.",
    availability: [
      { day: "Friday", times: ["08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM"] }
    ]
  },
  { 
    id: 4, name: "Dr. Lee", specialization: "Pediatrician", rating: 4.6,
    description: "Dr. Lee is fantastic with children, offering over 10 years of general pediatric care and compassionate consulting.",
    availability: [
      { day: "Monday", times: ["01:00 PM", "02:00 PM", "03:00 PM"] },
      { day: "Tuesday", times: ["09:00 AM", "10:30 AM"] }
    ]
  },
  { 
    id: 5, name: "Dr. Gupta", specialization: "Orthopedic", rating: 4.9,
    description: "Dr. Gupta leads the orthopedic surgery wing, dealing with trauma, sports injuries, and complex joint replacements.",
    availability: [
      { day: "Wednesday", times: ["10:00 AM", "11:00 AM"] },
      { day: "Saturday", times: ["09:00 AM", "12:00 PM", "02:00 PM"] }
    ]
  },
];

const seedDB = async () => {
  try {
    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    console.log('Database seeded with Doctors!');
  } catch(e) {
    console.error('Error seeding data:', e);
  } finally {
    mongoose.connection.close();
  }
};

mongoose.set('strictQuery', true);
mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB Atlas for seeding');
    await seedDB(); // run AFTER connection
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));