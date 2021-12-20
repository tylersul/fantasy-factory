const Joi = require('joi');

module.exports.managerJoiSchema = Joi.object({
  manager: Joi.object({
    name: Joi.string().required(),
    wins: Joi.number().required(),
    losses: Joi.number().required(),
    description: Joi.string().required()
  }).required()
});

module.exports.seasonJoiSchema = Joi.object({
  season: Joi.object({
    year: Joi.string().required(),
    champion: Joi.string().required(),
    loser: Joi.string().required(),
    description: Joi.string().required()
  }).required()
});