import Joi from 'joi';
import userSchema from './user';

export default {
  jwt: Joi.object().keys({
    key: Joi.string().min(10).required(),
    options: {
      expiresIn: Joi.alternatives().try(Joi.string(), Joi.number()).default('1d'),
    },
  }),
  serviceOptions: Joi.object().keys({
    db: Joi.object().required(),
    schema: Joi.object().default(userSchema),
    collectionName: Joi.string().default('User'),
  }).default({}).unknown(true).required(),
  registerRoutes: Joi.boolean().default(true),
};
