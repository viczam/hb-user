import Joi from 'joi';
import userSchema from './user';

export default {
  jwt: Joi.object().keys({
    key: Joi.string().min(10).required(),
    options: {
      expiresIn: Joi.alternatives().try(Joi.string(), Joi.number()).default('1d'),
    },
  }),
  defaultUser: Joi.object().keys({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
  }),
  user: Joi.object().keys({
    schema: Joi.object().default(userSchema),
    collectionName: Joi.string().default('User'),
  }).default({}),
  db: Joi.object().required(),
};
