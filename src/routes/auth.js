import _ from 'lodash';
import userSchema from '../schemas/user';

export default [
  {
    path: '/login',
    method: 'POST',
    async handler(request, reply) {
      const { User } = this;

      try {
        const result = await User.login(request.payload);
        const user = await User.dump(result);
        reply(user);
      } catch (err) {
        reply(err);
      }
    },
    config: {
      validate: {
        payload: _.pick(userSchema, ['username', 'password']),
      },
      tags: ['api'],
      description: 'User login',
    },
  },
];
