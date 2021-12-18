// Imports
const express        = require('express'),
      app            = express(),
      path           = require('path'),
      mongoose       = require('mongoose'),
      catchAsync     = require('./utils/catchAsync'),
      ExpressError   = require('./utils/ExpressError'),
      ejsMate        = require('ejs-mate'),
      methodOverride = require('method-override'),
      Manager        = require('./models/manager');

// Local DB connections
mongoose.connect('mongodb://127.0.0.1/fantasy-factory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Confirm DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("DB connected.");
});

// Use EJS for templating 
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Views directory for templates
app.set('views', path.join(__dirname, 'views'));

// Req.body info exercise 412
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

// GET / - Root Route
app.get('/', (req, res) => {
  res.render('home')
});

// GET /managers - View all managers
app.get('/managers', catchAsync(async (req, res) => {
  const managers = await Manager.find({});
  res.render("managers/index", { managers });
}));

// GET /managers/new - Get create new manager form
app.get('/managers/new', (req, res) => {
  res.render('managers/new');
});

// POST /managers - Create new manager
app.post('/managers', catchAsync(async (req, res) => {
  // Stops API calls from posting new managers without correct data
  if (!req.body.campground) throw new ExpressError('Invalid manager data', 400);
  const manager = new Manager(req.body.manager);
  await manager.save();
  res.redirect(`/managers/${manager._id}`);
}));

// GET /managers/:id - View specific manager
app.get('/managers/:id', catchAsync(async (req, res) => {
  const manager = await Manager.findById(req.params.id);
  res.render('managers/show', { manager });
}));

// PUT /managers/:id - Update specific manager
app.put('/managers/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const manager = await Manager.findByIdAndUpdate(id, { ...req.body.manager });
  res.redirect(`/managers/${manager._id}`)
}));

// GET /managers/:id/edit - Get update manager form
app.get('/managers/:id/edit', catchAsync(async (req,res) => {
  const manager = await Manager.findById(req.params.id);
  res.render('managers/edit', { manager })
}));

// DELETE /managers/:id - Delete specific manager
app.delete('/managers/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Manager.findByIdAndDelete(id);
  res.redirect('/managers');
})

// Catch-all route for errors
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404)); // next throws to error handler
});

// Error handling with next
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh, no. Something went wrong';
  res.status(statusCode).render('error', { err }); //status code from ExpressError
});

// Application listener
app.listen(3001, () => {
  console.log('Serving on port 3001');
});