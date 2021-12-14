const mongoose = require('mongoose');
const Manager = require('../models/manager');

mongoose.connect('mongodb://127.0.0.1/fantasy-factory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("DB connected.");
});

const seedDB = async () => {
  await Manager.deleteMany({});
  const m = new Manager({name: 'Tyler Sullivan', description: 'Commish', wins: 33, losses: 23});
  await m.save()
}

seedDB();