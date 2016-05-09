import _ from 'lodash';

export default ({ params }) => (
  _.pick(params, ['username', 'email', 'id', 'updatedAt', 'createdAt', 'token'])
);
