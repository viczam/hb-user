import _ from 'lodash';
import userSchema from '../schemas/user';

export const login = {
  validate: {
    payload: _.pick(userSchema, ['username', 'password']),
  },
  async handler(request, reply) {
    const { eventDispatcher } = request;

    try {
      const user = await eventDispatcher.dispatch('User.login', request.payload);
      const { id, username } = user;
      const token = await eventDispatcher.dispatch('User.createToken', { id, username });

      reply({
        ..._.pick(user, ['username', 'email', 'id', 'updatedAt', 'createdAt']),
        token,
      });
    } catch (err) {
      reply(err);
    }
  },
};
