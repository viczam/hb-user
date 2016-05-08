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
  tableName: Joi.any().default('User'),
  tableIndexes: Joi.object().default({
    username: 'username',
    email: 'email',
    fullName: ['firstName', 'lastName'],
    status: 'status',
    roles: {
      multi: true,
    },
  }),
  userSchema: Joi.object().default(userSchema),
  rethinkDb: Joi.object().keys({
    r: Joi.Object().required(),
    conn: Joi.Object().required(),
  }).required(),
};
