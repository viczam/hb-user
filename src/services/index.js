import { generateCRUDServices } from 'octobus-mongodb';
import * as handlers from './handlers';

const entityNamespace = 'entity.User';

export default ({
  dispatcher, jwt, user: { schema, collectionName }, db,
}) => {
  dispatcher.subscribeMap(entityNamespace, generateCRUDServices(dispatcher, entityNamespace, {
    db,
    schema,
    collectionName,
  }));

  dispatcher.subscribe(`${entityNamespace}.save`, handlers.save);

  dispatcher.subscribe('User.hashPassword', handlers.hashPassword);

  dispatcher.subscribe('User.createToken', handlers.createToken(jwt));

  dispatcher.subscribe('User.login', handlers.login);

  dispatcher.subscribe('User.dump', handlers.dump);
};
