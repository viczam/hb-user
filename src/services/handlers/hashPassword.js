import Joi from 'joi';
import bcrypt from 'bcryptjs';

export default ({ params }, cb) => {
  const { password, salt } = params;
  bcrypt.hash(password, salt, cb);
};

export const config = {
  schema: Joi.object().keys({
    password: Joi.string().required(),
    salt: Joi.string().required(),
  }).required(),
};
