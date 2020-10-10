const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableIdentifier: {
    type: String,
    required: [true, "can't be blank"]
  },
  combinable: {
    type: Boolean,
    required: [true, "can't be blank"]
  },
  available: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    required: [true, "can't be blank"]
  },
  description: {
    type: String,
  },
});

const Table = mongoose.model('Table', TableSchema);

module.exports = Table;
