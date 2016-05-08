import hashPassword, { config as hashPasswordConfig } from './handlers/hashPassword';
import createToken, { config as createTokenConfig } from './handlers/createToken';
import save from './handlers/save';
import login, { config as loginConfig } from './handlers/login';

export default ({
  dispatcher, generateCRUDServices, jwt, r, conn, userSchema, tableName, tableIndexes,
}) => (
  generateCRUDServices('entity.User', {
    schema: userSchema,
    indexes: tableIndexes,
    tableName,
    r,
    conn,
  }).then(({ namespace, map }) => {
    dispatcher.subscribeMap(namespace, map);
    dispatcher.subscribe('entity.User.save', save);
    dispatcher.subscribe('User.hashPassword', hashPassword, hashPasswordConfig);
    dispatcher.subscribe('User.createToken', createToken(jwt), createTokenConfig);
    dispatcher.subscribe('User.login', login, loginConfig);
  })
);
