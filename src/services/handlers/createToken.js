import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { decorators } from 'octobus.js';
const { withSchema, toHandler } = decorators;

const schema = Joi.object().keys({
  id: Joi.required(),
  username: Joi.string().required(),
  options: Joi.object().default({}),
}).required();

export default ({ key, options: defaultOptions }) =>
  withSchema(
    toHandler(
      ({ id, username, options }) => (
        jwt.sign({ id, username }, key, { ...defaultOptions, ...options })
      )
    ),
    schema
  );
