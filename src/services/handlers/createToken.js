import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { decorators } from 'octobus.js';
const { withSchema } = decorators;

const schema = Joi.object().keys({
  id: Joi.required(),
  username: Joi.string().required(),
  options: Joi.object().default({}),
}).required();

export default ({ key, options: defaultOptions }) =>
  withSchema(
    async ({ params }) => {
      const { options, ...user } = params;
      return jwt.sign(user, key, { ...defaultOptions, ...options });
    },
    schema
  );
