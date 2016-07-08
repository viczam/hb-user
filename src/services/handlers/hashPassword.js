import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { decorators } from 'octobus.js';

const schema = Joi.object().keys({
  password: Joi.string().required(),
  salt: Joi.string().required(),
}).required();

const handler = ({ params }, cb) => {
  const { password, salt } = params;
  bcrypt.hash(password, salt, cb);
};

export default decorators.withSchema(handler, schema);
