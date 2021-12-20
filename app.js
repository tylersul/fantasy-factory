// Imports
const express              = require('express'),
      app                  = express(),
      path                 = require('path'),
      mongoose             = require('mongoose'),
      catchAsync           = require('./utils/catchAsync'),
      ExpressError         = require('./utils/ExpressError'),
      ejsMate              = require('ejs-mate'),
      Joi                  = require('joi'),
      { managerJoiSchema, seasonJoiSchema } = require('./utils/schemaValidation'),
      methodOverride       = require('method-override'),
      Season               = require('./models/season'),
      Manager              = require('./models/manager');

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

// Joi validation middleware
const validateManager = (req, res, next) => {
  let { error } = managerJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

const validateSeason = (req, res, next) => {
  let { error } = seasonJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

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
app.post('/managers', validateManager, catchAsync(async (req, res) => {
  // Stops API calls from posting new managers without correct data
  // if (!req.body.campground) throw new ExpressError('Invalid manager data', 400);

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
app.put('/managers/:id', validateManager, catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const manager = await Manager.findByIdAndUpdate(id, { ...req.body.manager });
  res.redirect(`/managers/${manager._id}`)
}));

// GET /managers/:id/edit - Get update manager form
app.get('/managers/:id/edit', catchAsync(async (req,res) => {
  console.log(req.params)
  const manager = await Manager.findById(req.params.id);
  res.render('managers/edit', { manager })
}));

// DELETE /managers/:id - Delete specific manager
app.delete('/managers/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Manager.findByIdAndDelete(id);
  res.redirect('/managers');
}));

// GET /seasons - view all seasons
app.get('/seasons', catchAsync( async(req, res) => {
  const seasons = await Season.find({});
  res.render('seasons/index', { seasons })
}));

// GET /seasons/new - Get create new season form
app.get('/seasons/new', (req, res) => {
  res.render('seasons/new');
});

// POST /seasons - Create new season
app.post('/seasons', validateSeason, catchAsync(async (req, res) => {
  // Stops API calls from posting new managers without correct data
  // if (!req.body.campground) throw new ExpressError('Invalid manager data', 400);

  const season = new Season(req.body.season);
  await season.save();
  // res.redirect(`/seasons/${season._id}`);
  res.redirect('/seasons')
}));

// GET /seasons/:id - View specific season
app.get('/seasons/:id', catchAsync(async (req, res) => {
  const season = await Season.findById(req.params.id);
  res.render('seasons/show', { season });
}));

// PUT /seasons/:id - Update specific season
app.put('/managers/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const season = await Season.findByIdAndUpdate(id, { ...req.body.season });
  console.log(season._id)
  res.redirect(`/seasons/${season._id}`)
}));

// GET /seasons/:id/edit - Get update season form
app.get('/seasons/:id/edit', catchAsync(async (req,res) => {
  const season = await Season.findById(req.params.id);
  res.render('seasons/edit', { season })
}));

// DELETE /seasons/:id - Delete specific season
app.delete('/seasons/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Season.findByIdAndDelete(id);
  res.redirect('/seasons');
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