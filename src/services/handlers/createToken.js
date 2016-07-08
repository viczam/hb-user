import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { decorators } from 'octobus.js';

const schema = Joi.object().keys({
  id: Joi.required(),
  username: Joi.string().required(),
  options: Joi.object().default({}),
}).required();

export default ({ key, options: defaultOptions }) =>
  decorators.withSchema(
    ({ params }) => {
      const { id, username, options } = params;
      return jwt.sign({ id, username }, key, { ...defaultOptions, ...options });
    },
    schema
  );
