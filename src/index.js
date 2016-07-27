import pkg from '../package.json';
import Joi from 'joi';
import routes from './routes';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import pluginOptionsSchema from './schemas/pluginOptions';
import validateJWT from './lib/validateJWT';
import setupServices from './services';

export function register(server, options, next) {
  const { error, value } = Joi.validate(options, pluginOptionsSchema);
  if (error) {
    return next(error);
  }

  const pluginOptions = value;
  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;

  setupServices({
    ...pluginOptions,
    dispatcher,
  });

  return server.register(hapiAuthJwt2, (err) => {
    if (err) {
      return next(err);
    }

    server.auth.strategy('jwt', 'jwt', {
      key: pluginOptions.jwt.key,
      validateFunc: validateJWT(dispatcher),
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    server.route(routes);

    return next();
  });
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
