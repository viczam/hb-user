import Joi from 'joi';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import pkg from '../package.json';
import routes from './routes';
import pluginOptionsSchema from './schemas/pluginOptions';
import validateJWT from './lib/validateJWT';
import setupServices from './services';

export const register = (server, options, next) => { // eslint-disable-line
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

  return server.register(hapiAuthJwt2).then(() => {
    server.auth.strategy('jwt', 'jwt', {
      key: pluginOptions.jwt.key,
      validateFunc: validateJWT(dispatcher),
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    server.route(routes);

    return next();
  }, next);
};

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
