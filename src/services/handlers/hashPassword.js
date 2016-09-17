import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { decorators } from 'octobus.js';

const { withSchema, withHandler } = decorators;

const schema = Joi.object().keys({
  password: Joi.string().required(),
  salt: Joi.string().required(),
}).required();

const handler = ({ password, salt }, cb) => {
  bcrypt.hash(password, salt, cb);
};

export default withSchema(withHandler(handler), schema);
