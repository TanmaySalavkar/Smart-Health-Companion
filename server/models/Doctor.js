const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  specialization: String,
  rating: Number,
  description: String,
  availability: [
    {
      day: String,
      times: [String]
    }
  ]
});

module.exports = mongoose.model('Doctor', doctorSchema);
