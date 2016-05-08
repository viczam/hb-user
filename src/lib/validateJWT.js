export default (dispatcher) => (decodedToken, request, cb) => {
  if (!decodedToken || !decodedToken.id) {
    cb(null, false);
  } else {
    dispatcher.dispatch('entity.User.findById', decodedToken.id, (err, result) => {
      cb(null, !err && !!result);
    });
  }
};
