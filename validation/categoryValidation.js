import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().allow('')
}); 