const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);

    // Passport helper method
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Fantasy Factory!');
      res.redirect('/managers');
    })
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/managers');
});

router.get('/logout', (req, res) => {
  // Passport helper method
  req.logout();
  req.flash('success', 'Logged out successfully.');
  res.redirect('/managers');
})

module.exports = router; 
