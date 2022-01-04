// Imports
const express              = require('express'),
      app                  = express(),
      path                 = require('path'),
      mongoose             = require('mongoose'),
      catchAsync           = require('./utils/catchAsync'),
      ExpressError         = require('./utils/ExpressError'),
      flash                = require('connect-flash')
      ejsMate              = require('ejs-mate'),
      session              = require('express-session'),
      Joi                  = require('joi'),
      passport             = require('passport'),
      LocalStrategy        = require('passport-local'),
      { managerJoiSchema, seasonJoiSchema } = require('./utils/schemaValidation'),
      User                 = require('./models/user'),
      methodOverride       = require('method-override'),
      Season               = require('./models/season');

const { UserExistsError } = require('passport-local-mongoose/lib/errors');
const managers = require('./routes/managers');
const reviews = require('./routes/seasons');

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

// Express.Static middleware function that serves static files in Express
// Adding dynamic directory name and public for CSS stylesheets and images
// Serves all files inside of 'public' directory to '/' directory
app.use(express.static(path.join(__dirname, 'public')));

// View session cookies in Chrome under application tab (name = connect.sid)
// Inside of any request body, there will now be a cookie object available
const sessionConfig = {
  secret: 'temporarysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 360,
    maxAge: 1000 * 360
  }
}

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// // Use local strategy with authentication method on user model
passport.use(new LocalStrategy(User.authenticate()));


// Store user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Gives access on every request under the key 'success'
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// Route files
app.use(managers);
app.use(reviews);

// GET / - Root Route
app.get('/', (req, res) => {
  res.render('home')
});

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