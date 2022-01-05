const express = require('express');
const router = express.Router();
const catchAsync           = require('../utils/catchAsync');
const ExpressError         = require('../utils/ExpressError');
const { isLoggedIn, isAuthor, validateManager }       = require('../utils/middleware');
const Manager              = require('../models/manager');

// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
// GET /managers - View all managers
router.get('/managers', catchAsync(async (req, res) => {
  const managers = await Manager.find({});
  res.render("managers/index", { managers });
}));

// GET /managers/new - Get create new manager form
router.get('/managers/new', isLoggedIn, (req, res) => {
  res.render('managers/new');
});

// POST /managers - Create new manager
router.post('/managers', validateManager, catchAsync(async (req, res) => {
  // Stops API calls from posting new managers without correct data
  // if (!req.body.campground) throw new ExpressError('Invalid manager data', 400);

  const manager = new Manager(req.body.manager);
  manager.author = req.user._id;
  await manager.save();
  req.flash('success', 'Successfully created new manager.');
  res.redirect(`/managers/${manager._id}`);
}));

// GET /managers/:id - View specific manager
router.get('/managers/:id', catchAsync(async (req, res) => {
  const manager = await Manager.findById(req.params.id).populate('author');
  if (!manager) {
    req.flash('error', 'Manager not found.');
    return res.redirect('/managers');
  }
  res.render('managers/show', { manager });
}));

// PUT /managers/:id - Update specific manager
router.put('/managers/:id', isLoggedIn, validateManager, catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const manager = await Manager.findByIdAndUpdate(id, { ...req.body.manager });
  req.flash('success', 'Successfully updated manager.');
  res.redirect(`/managers/${manager._id}`)
})); 

// GET /managers/:id/edit - Get update manager form
router.get('/managers/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req,res) => {

  const manager = await Manager.findById(req.params.id);

  if (!manager) {
    req.flash('error', 'Manager not found.');
    return res.redirect('/managers');
  }

  res.render('managers/edit', { manager })
}));

// PUT /seasons/:id - Update specific season
router.put('/managers/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const season = await Season.findByIdAndUpdate(id, { ...req.body.season });
  console.log(season._id)
  res.redirect(`/seasons/${season._id}`)
}));

// DELETE /managers/:id - Delete specific manager
router.delete('/managers/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Manager.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted manager.');
  res.redirect('/managers');
}));


// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

module.exports = router;
