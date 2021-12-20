const Joi = require('joi');

module.exports.managerJoiSchema = Joi.object({
  manager: Joi.object({
    name: Joi.string().required(),
    wins: Joi.number().required(),
    losses: Joi.number().required(),
    description: Joi.string().required()
  }).required()
})