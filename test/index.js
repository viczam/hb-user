import { Server } from 'hapi';
import { expect } from 'chai';
import * as HapiOctobus from 'hapi-octobus';
import { MongoClient } from 'mongodb';
import * as hbUser from '../src';

const databaseName = 'hbUserTest';

const findOrCreateUser = (userData, dispatcher) => (
  dispatcher.dispatch('entity.User.findOne', {
    query: {
      email: userData.email,
    },
  }).then((user) => {
    if (user) {
      return user;
    }

    return dispatcher.dispatch('entity.User.createOne', userData);
  })
);

describe('register()', () => {
  let server;
  let db;
  let dispatcher;

  before(() => (
    MongoClient.connect(`mongodb://localhost:27017/${databaseName}`).then((_db) => {
      db = _db;
    })
  ));

  beforeEach((done) => {
    server = new Server();
    server.connection();


    server.register([{
      register: HapiOctobus.register,
    }, {
      register: hbUser.register,
      options: {
        serviceOptions: {
          db,
        },
        jwt: {
          key: 'I83AtkWR1FaPTKOObwDWtXP19JucJWBmLLva3K7XczEIcELzcrB1OyARV1us5z1',
        },
      },
    }], (err) => {
      if (err) {
        return done(err);
      }

      dispatcher = server.plugins['hapi-octobus'].eventDispatcher;

      return findOrCreateUser({
        username: 'viczam',
        firstName: 'Victor',
        lastName: 'Zamfir',
        email: 'zamfir.victor@gmail.com',
        password: 'admin',
      }, dispatcher).then(() => done(), done);
    });
  });

  after(() => {
    db.close();
  });

  it('creates a default user', () => (
    dispatcher.dispatch('entity.User.findOne', {
      query: {
        username: 'viczam',
      },
    }).then((user) => {
      expect(user).not.to.be.empty();
      expect(user.email).to.equal('zamfir.victor@gmail.com');
    })
  ));

  describe('User.login service', () => {
    it('throws error when called without credentials', () => (
      dispatcher.dispatch('User.login').catch((err) => {
        expect(err).to.exist();
      })
    ));

    it('throws error when called with invalid credentials', () => (
      dispatcher.dispatch('User.login', {
        username: 'viczam',
        password: 'invalid',
      }).catch((err) => {
        expect(err).to.exist();
      })
    ));

    it('returns the logged in user with an access token when called with valid credentials', () => {
      const tsBefore = Date.now();
      return dispatcher.dispatch('User.login', {
        username: 'viczam',
        password: 'admin',
      }).then((user) => {
        const tsAfter = Date.now();

        expect(user).to.exist();
        expect(user._id).to.exist();
        expect(user.token).to.exist();
        expect(user.lastLogin).to.exist();
        expect(user.lastLogin).to.be.at.least(tsBefore).and.at.most(tsAfter);
      }).catch((err) => {
        expect(err).not.to.exist();
      });
    });
  });

  describe('Routes', () => {
    describe('/login', () => {
      it('no credentials', (done) => {
        server.inject({
          method: 'POST',
          url: '/login',
          payload: {
          },
        }, (res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
      });

      it('invalid credentials', (done) => {
        server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            username: 'invalid-username',
            password: 'invalid-password',
          },
        }, (res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
      });

      it('valid credentials', () => (
        server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            username: 'viczam',
            password: 'admin',
          },
        }).then((res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.result.token).to.exist();
          expect(res.result.username).to.equal('viczam');
          expect(res.result.email).to.equal('zamfir.victor@gmail.com');
          expect(res.result.password).not.to.exist();

          return server.inject({
            method: 'GET',
            url: '/users',
            headers: {
              Authorization: res.result.token,
            },
          }).then(({ statusCode }) => {
            expect(statusCode).to.equal(200);
          }, (err) => {
            expect(err).not.to.exist();
          });
        })
      ));
    });
  });
});
