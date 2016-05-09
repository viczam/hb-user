import Joi from 'joi';
import Boom from 'boom';

export const config = {
  schema: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
};

export default async ({ params, dispatch }) => {
  const { username, password } = params;

  const user = await dispatch('entity.User.findOne', { username });

  if (!user) {
    throw Boom.badRequest('User not found!');
  }

  const hashedPassword = await dispatch('User.hashPassword', { password, salt: user.salt });

  if (user.password !== hashedPassword) {
    throw Boom.badRequest('Incorrect password!');
  }

  const updatedUser = await dispatch('entity.User.update', {
    ...user,
    lastLogin: new Date(),
  });

  const token = await dispatch('User.createToken', { id: updatedUser.id, username });

  return {
    ...updatedUser,
    token,
  };
};
