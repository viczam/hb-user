import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { decorators } from 'octobus.js';

const { withSchema } = decorators;

const schema = Joi.object().keys({
  id: Joi.required(),
  username: Joi.string().required(),
  options: Joi.object().default({}),
}).unknown(true).required();

export default ({ key, options: defaultOptions }) =>
  withSchema(schema)(
    async ({ params }) => {
      const { options, ...user } = params;
      return jwt.sign(user, key, { ...defaultOptions, ...options });
    },
  );
