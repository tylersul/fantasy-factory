const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Req.body info exercise 412
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/managers', catchAsync(async (req, res) => {
  const managers = await Manager.find({});
  res.render("managers/index", { managers });
}));

app.get('/managers/new', (req, res) => {
  res.render('managers/new');
});

app.post('/managers', catchAsync(async (req, res) => {
  // Stops API calls from posting new managers without correct data
  if (!req.body.campground) throw new ExpressError('Invalid manager data', 400);
  const manager = new Manager(req.body.manager);
  await manager.save();
  res.redirect(`/managers/${manager._id}`);
}));

app.get('/managers/:id', catchAsync(async (req, res) => {
  const manager = await Manager.findById(req.params.id);
  res.render('managers/show', { manager });

}));

app.put('/managers/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const manager = await Manager.findByIdAndUpdate(id, { ...req.body.manager });
  res.redirect(`/managers/${manager._id}`)
}));

app.get('/managers/:id/edit', catchAsync(async (req,res) => {
  const manager = await Manager.findById(req.params.id);
  res.render('managers/edit', { manager })
}));

app.delete('/managers/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Manager.findByIdAndDelete(id);
  res.redirect('/managers');
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404)); // next throws to error handler
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh, no. Something went wrong';
  res.status(statusCode).render('error', { err }); //status code from ExpressError
});

app.listen(3001, () => {
  console.log('Serving on port 3001');
});