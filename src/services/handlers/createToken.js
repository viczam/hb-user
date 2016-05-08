import Joi from 'joi';
import jwt from 'jsonwebtoken';

export const config = {
  schema: Joi.object().keys({
    id: Joi.required(),
    username: Joi.string().required(),
    options: Joi.object().default({}),
  }).required(),
};

export default ({ key, options: defaultOptions }) => ({ params }) => {
  const { id, username, options } = params;
  return jwt.sign({ id, username }, key, { ...defaultOptions, ...options });
};
