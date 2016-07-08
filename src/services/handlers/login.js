import Joi from 'joi';
import Boom from 'boom';
import { decorators } from 'octobus.js';

const schema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).required();

const handler = async ({ params, dispatch }) => {
  const { username, password } = params;

  const user = await dispatch('entity.User.findOne', {
    query: { username },
  });

  if (!user) {
    throw Boom.badRequest('User not found!');
  }

  const hashedPassword = await dispatch('User.hashPassword', { password, salt: user.salt });

  if (user.password !== hashedPassword) {
    throw Boom.badRequest('Incorrect password!');
  }

  const updatedUser = await dispatch('entity.User.replaceOne', {
    ...user,
    lastLogin: new Date(),
  });

  const token = await dispatch('User.createToken', { id: updatedUser._id, username });

  return {
    ...updatedUser,
    token,
  };
};

export default decorators.withSchema(handler, schema);
