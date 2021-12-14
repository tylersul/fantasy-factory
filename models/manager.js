const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  name: String,
  description: String,
  wins: Number,
  losses: Number
});

module.exports = mongoose.model('Manager', ManagerSchema);