const express = require('express');
const router = express.Router();
const catchAsync           = require('../utils/catchAsync');
const ExpressError         = require('../utils/ExpressError');
const { managerJoiSchema, seasonJoiSchema } = require('../utils/schemaValidation')

const validateSeason = (req, res, next) => {
  let { error } = seasonJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

// GET /seasons - view all seasons
router.get('/seasons', catchAsync( async(req, res) => {
  const seasons = await Season.find({});
  res.render('seasons/index', { seasons })
}));

// GET /seasons/new - Get create new season form
router.get('/seasons/new', (req, res) => {
  res.render('seasons/new');
});

// POST /seasons - Create new season
router.post('/seasons', validateSeason, catchAsync(async (req, res) => {
  // Stops API calls from posting new managers without correct data
  // if (!req.body.campground) throw new ExpressError('Invalid manager data', 400);

  const season = new Season(req.body.season);
  await season.save();
  // res.redirect(`/seasons/${season._id}`);
  res.redirect('/seasons')
}));

// GET /seasons/:id - View specific season
router.get('/seasons/:id', catchAsync(async (req, res) => {
  const season = await Season.findById(req.params.id);
  res.render('seasons/show', { season });
}));



// GET /seasons/:id/edit - Get update season form
router.get('/seasons/:id/edit', catchAsync(async (req,res) => {
  const season = await Season.findById(req.params.id);
  res.render('seasons/edit', { season })
}));

// DELETE /seasons/:id - Delete specific season
router.delete('/seasons/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Season.findByIdAndDelete(id);
  res.redirect('/seasons');
})

// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

module.exports = router;