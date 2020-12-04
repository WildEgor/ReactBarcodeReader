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
    required: true,
    min: 0,
    max: 120
  },
  sold: {
    type: Number,
    required: true,
    validate: [
      soldValidator,
      "Invalid values"
    ],
    min: 0,
    max: 120
  },
  remind: {
    type: Number,
    required: true,
    validate: [
      remindValidator,
      "Invalid values"
    ],
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

function soldValidator(value) {
  return this.countAll >= value;
}

function remindValidator(value) {
  return value == this.countAll - this.sold;
}

itemsSchema.set('validateBeforeSave', true);

module.exports = mongoose.model('items', itemsSchema);