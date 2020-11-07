const mongoose = require('mongoose');

const TimeSlotScheme = new mongoose.Schema({
  start: {
    type: Number,
    required: [true, "can't be blank"],
  },
  end: {
    type: Number,
    required: [true, "can't be blank"],
  }
});

const TimeSlot = mongoose.model('TimeSlot', TimeSlotScheme);

module.exports = TimeSlot;
