import bcrypt from 'bcryptjs';

export default async ({ params, dispatch, next }) => {
  const { hashPassword, ...nextParams } = params;

  if (!nextParams.salt) {
    nextParams.salt = bcrypt.genSaltSync(10);
  }

  const shouldHashPassword = (!nextParams._id || hashPassword) && !!params.password;

  if (shouldHashPassword) {
    nextParams.password = await dispatch('User.hashPassword', {
      password: nextParams.password,
      salt: nextParams.salt,
    });
  }

  return next(nextParams);
};
