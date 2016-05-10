import pkg from '../package.json';
import Joi from 'joi';
import routes from './routes';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import pluginOptionsSchema from './schemas/pluginOptions';
import validateJWT from './lib/validateJWT';
import setupServices from './services';
import { generateCRUDServices } from 'octobus-rethinkdb';

export function register(server, options, next) {
  const { error, value } = Joi.validate(options, pluginOptionsSchema);
  if (error) {
    return next(error);
  }

  const pluginOptions = value;
  const { defaultUser, rethinkDb } = pluginOptions;
  const { conn, r } = rethinkDb;
  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;

  return setupServices({
    ...pluginOptions,
    dispatcher,
    generateCRUDServices,
    conn,
    r,
  }).then(() => {
    server.register(hapiAuthJwt2, (err) => {
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

      if (pluginOptions.defaultUser) {
        dispatcher.dispatch('entity.User.findOne', {
          email: defaultUser.email,
        }).then((user) => {
          if (!user) {
            dispatcher.dispatch('entity.User.create', defaultUser);
          }
        });
      }

      server.route(routes);

      return next();
    });
  }).catch(next);
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
