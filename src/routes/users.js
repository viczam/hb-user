export default [
  {
    path: '/users',
    method: 'GET',
    async handler(request, reply) {
      try {
        const { eventDispatcher } = request;
        const users = await eventDispatcher.dispatch('entity.User.findMany').then((c) => c.toArray());
        reply(users);
      } catch (err) {
        reply(err);
      }
    },
    config: {
      auth: 'jwt',
    },
  },
];
