import Joi from 'joi';
import Boom from 'boom';
import { decorators, applyDecorators } from 'octobus.js';
import pick from 'lodash/pick';
import userSchema from '../../schemas/user';

const { withSchema, withLookups, withHandler } = decorators;


const schema = Joi.object().keys({
  user: Joi.object().keys(pick(userSchema, ['_id', 'username', 'password', 'salt'])).unknown(true).allow(null),
  username: Joi.string().when('user', {
    is: null,
    then: Joi.required(),
  }),
  password: Joi.string().when('user', {
    is: null,
    then: Joi.required(),
  }),
}).required();

const handler = async ({ username, password, params, User, UserEntity }) => {
  const user = params.user || await UserEntity.findOne({ query: { username } });

  if (!user) {
    throw Boom.badRequest('User not found!');
  }

  const hashedPassword = await User.hashPassword({ password, salt: user.salt });

  if (user.password !== hashedPassword) {
    throw Boom.badRequest('Incorrect password!');
  }

  const updatedUser = await UserEntity.replaceOne({
    ...user,
    lastLogin: new Date(),
  });

  const serializedUser = await User.serialize(updatedUser);
  const token = await User.createToken(serializedUser);

  return {
    ...updatedUser,
    token,
  };
};

export default applyDecorators([
  withSchema(schema),
  withLookups({
    User: 'User',
    UserEntity: 'entity.User',
  }),
  withHandler,
], handler);
