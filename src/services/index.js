import { generateCRUDServices } from 'octobus-mongodb';
import hashPassword, { config as hashPasswordConfig } from './handlers/hashPassword';
import createToken, { config as createTokenConfig } from './handlers/createToken';
import save from './handlers/save';
import login, { config as loginConfig } from './handlers/login';
import dump from './handlers/dump';

const entityNamespace = 'entity.User';

export default ({
  dispatcher, jwt, user: { schema, collectionName }, db,
}) => {
  dispatcher.subscribeMap(entityNamespace, generateCRUDServices(dispatcher, entityNamespace, {
    db,
    schema,
    collectionName,
  }));

  dispatcher.subscribe(`${entityNamespace}.save`, save);

  dispatcher.subscribe('User.hashPassword', hashPassword, hashPasswordConfig);

  dispatcher.subscribe('User.createToken', createToken(jwt), createTokenConfig);

  dispatcher.subscribe('User.login', login, loginConfig);

  dispatcher.subscribe('User.dump', dump);
};
