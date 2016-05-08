import bcrypt from 'bcryptjs';
import _ from 'lodash';

export default ({ params, dispatch, next }) => {
  const nextParams = _.omit(params, ['hashPassword']);
  const { hashPassword } = params;

  if (!nextParams.salt) {
    nextParams.salt = bcrypt.genSaltSync(10);
  }

  const shouldHashPassword = (!nextParams.id || hashPassword) && !!params.password;

  return Promise.resolve(
    shouldHashPassword && dispatch('User.hashPassword', {
      password: nextParams.password,
      salt: nextParams.salt,
    }).then((hashedPassword) => {
      nextParams.password = hashedPassword;
    })
  ).then(() => {
    next(nextParams);
  });
};
