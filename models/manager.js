const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  name: String,
  image: String,
  description: String,
  wins: Number,
  losses: Number,
  seasons: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Season'
    }
  ]
});

module.exports = mongoose.model('Manager', ManagerSchema);