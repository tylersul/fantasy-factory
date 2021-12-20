const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeasonSchema = new Schema({
  year: String,
  image: String,
  description: String,
  champion: String,
  loser: String
});

module.exports = mongoose.model('Season', SeasonSchema);