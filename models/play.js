const mongoose = require('mongoose');

const playSchema = new mongoose.Schema({
  photo: { 
    type: String,
    required: true 
  },
  playFormation: {
    type: String,
    required: true
  },
  playDown: {
    type: Number,
    min: 1,
    max: 4,
    default: 1
  },
  playYardsLeft: {
    type: Number,
    min: 1,
    max: 100,
    default: 1
  },
  playQuarter: {
    type: Number,
    min: 1,
    max: 4,
    default: 1
  },
  playPrediction: {
    type: String
  },
})

module.exports = playSchema
