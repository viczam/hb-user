import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { decorators } from 'octobus.js';
const { withSchema, withHandler } = decorators;

const schema = Joi.object().keys({
  id: Joi.required(),
  username: Joi.string().required(),
  options: Joi.object().default({}),
}).required();

export default ({ key, options: defaultOptions }) =>
  withSchema(
    withHandler(
      async (args) => {
        const { options, dispatch, ...user } = args;
        const serializedUser = await dispatch('User.serialize', user);
        return jwt.sign(serializedUser, key, { ...defaultOptions, ...options });
      }
    ),
    schema
  );
