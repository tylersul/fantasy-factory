const { managerJoiSchema, seasonJoiSchema } = require('../utils/schemaValidation')
const ExpressError = require('./ExpressError');
const Manager = require('../models/manager');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
  req.flash('error', 'You must be logged in to do that.');
  return res.redirect('/login');
  }
  next();
}

// Joi validation middleware
module.exports.validateManager = (req, res, next) => {
  let { error } = managerJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.validateSeason = (req, res, next) => {
  let { error } = seasonJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}


module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const manager = await Manager.findById(id);
  if (!manager.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permissions to do that.');
    return res.redirect(`/managers/${id}`);
  }
  next();
}