import Joi from 'joi';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import pkg from '../package.json';
import routes from './routes';
import pluginOptionsSchema from './schemas/pluginOptions';
import validateJWT from './lib/validateJWT';
import setupServices from './services';

export const register = (server, options, next) => { // eslint-disable-line
  const { error, value: pluginOptions } = Joi.validate(options, pluginOptionsSchema);
  if (error) {
    return next(error);
  }

  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
  const { lookup } = dispatcher;

  setupServices({
    ...pluginOptions,
    dispatcher,
  });

  const UserEntity = lookup('entity.User');
  const User = lookup('User');

  server.expose('UserEntity', UserEntity);
  server.expose('User', User);

  server.bind({
    User,
  });

  return server.register(hapiAuthJwt2).then(() => {
    server.auth.strategy('jwt', 'jwt', {
      key: pluginOptions.jwt.key,
      validateFunc: validateJWT(dispatcher),
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    if (pluginOptions.registerRoutes) {
      server.route(routes);
    }
  }).then(next, next);
};

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
