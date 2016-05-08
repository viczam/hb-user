export const find = {
  validate: {},
  auth: 'jwt',
  async handler(request, reply) {
    const { eventDispatcher } = request;

    try {
      const users = await eventDispatcher.dispatch('entity.User.find');
      reply(users);
    } catch (err) {
      reply(err);
    }
  },
};
