const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'snack',
  },
  imageBase64: {
    type: String,
    default: null,
  },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  nutriScore: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E'],
    default: 'C',
  },
  ingredients: {
    type: [String],
    default: [],
  },
  loggedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('MealLog', mealLogSchema);
