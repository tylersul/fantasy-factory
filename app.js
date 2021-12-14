const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Manager = require('./models/manager');

mongoose.connect('mongodb://127.0.0.1/fantasy-factory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("DB connected.");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Req.body info exercise 412
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/managers', async (req, res) => {
  const managers = await Manager.find({});
  res.render("managers/index", { managers });
});

app.get('/managers/new', (req, res) => {
  res.render('managers/new');
});

app.post('/managers', async (req, res) => {
  const manager = new Manager(req.body.manager);
  await manager.save();
  res.redirect(`/managers/${manager._id}`);
})

app.get('/managers/:id', async (req, res) => {
  const manager = await Manager.findById(req.params.id);
  res.render('managers/show', { manager });

});


app.listen(3000, () => {
  console.log('Serving on port 3000');
});