import _ from 'lodash';
import userSchema from '../schemas/user';

export default [
  {
    path: '/login',
    method: 'POST',
    async handler(request, reply) {
      const { eventDispatcher } = request;
      const { dispatch } = eventDispatcher;

      try {
        const result = await dispatch('User.login', request.payload);
        const user = await dispatch('User.dump', result);
        reply(user);
      } catch (err) {
        reply(err);
      }
    },
    config: {
      validate: {
        payload: _.pick(userSchema, ['username', 'password']),
      },
    },
  },
];
