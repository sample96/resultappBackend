import Joi from 'joi';

export const positionSchema = Joi.object({
  name: Joi.string().trim().required(),
  details: Joi.string().trim().allow('')
});

export const resultSchema = Joi.object({
  category: Joi.string().required(),
  eventName: Joi.string().trim().required(),
  eventDate: Joi.date().required(),
  individual: Joi.object({
    first: positionSchema,
    second: positionSchema,
    third: positionSchema
  }).allow(null),
  group: Joi.object({
    first: positionSchema,
    second: positionSchema,
    third: positionSchema
  }).allow(null)
}); 