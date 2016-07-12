import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { decorators } from 'octobus.js';
const { withSchema, toHandler } = decorators;

const schema = Joi.object().keys({
  password: Joi.string().required(),
  salt: Joi.string().required(),
}).required();

const handler = ({ password, salt }) => {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  bcrypt.hash(password, salt, (err, value) => {
    if (err) {
      reject(err);
    } else {
      resolve(value);
    }
  });

  return promise;
};

export default withSchema(toHandler(handler), schema);
