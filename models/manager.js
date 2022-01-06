const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  name: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  description: String,
  wins: Number,
  losses: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  seasons: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Season'
    }
  ]
});

module.exports = mongoose.model('Manager', ManagerSchema);