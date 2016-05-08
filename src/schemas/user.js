import Joi from 'joi';

export default {
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  salt: Joi.string(),
  status: Joi.string(),
  resetPassword: Joi.string(),
  lastLogin: Joi.date(),
  roles: Joi.array().items(Joi.string()),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
