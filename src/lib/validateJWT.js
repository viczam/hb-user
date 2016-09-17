import { ObjectID as objectId } from 'mongodb';

export default (dispatcher) => (decodedToken, request, cb) => {
  if (!decodedToken || !decodedToken.id) {
    cb(null, false);
  } else {
    dispatcher.dispatch('entity.User.findById', objectId(decodedToken.id))
      .then((result) => cb(null, !!result), cb);
  }
};
