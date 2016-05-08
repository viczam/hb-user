import * as auth from './handlers/auth';
import * as users from './handlers/users';

export default [{
  path: '/login',
  method: 'POST',
  config: auth.login,
}, {
  path: '/users',
  method: 'GET',
  config: users.find,
}];
