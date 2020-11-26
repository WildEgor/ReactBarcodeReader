const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
  articul: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  },
  countAll: {
    type: Number,
    min: 0,
    max: 120
  },
  sold: {
    type: Number,
    min: 0,
    max: 120
  },
  remind: {
    type: Number,
    min: 0,
    max: 120
  },
  notes: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  },
});

module.exports = mongoose.model('items', itemsSchema);


