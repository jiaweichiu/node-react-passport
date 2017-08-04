const test = require('tape');
var request = require('supertest');
const crypto = require('crypto');
const _ = require('underscore')._;

const cUser = require('./user');
const app = require('../app');

test.onFinish(() => process.exit());

test('userCreateLoginDelete', (t) => {
  const username = 'user_' + crypto.randomBytes(10).toString('base64');
  request(app)
    .post('/user/create')
    .send({
      username: username,
      password: 'testpass',
    })
    .expect(200)
    .end((err, res) => {
      t.assert(_.has(res, 'body'));
      t.assert(_.has(res.body, 'success'));
      t.true(res.body.success);
      t.assert(_.has(res.body, 'user'));
      const user = res.body.user;
      t.equal(user.username, username);
      t.assert(_.has(user, 'id'));
      const userID = user.id;

      // Try bad login.
      request(app)
        .post('/user/login')
        .send({
          username: username,
          password: 'wrongpassword',
        })
        .expect(200)
        .end((err, res) => {
          t.assert(_.has(res, 'body'));
          t.assert(_.has(res.body, 'success'));
          t.false(res.body.success); // Wrong pass.

          // Try good login.
          request(app)
            .post('/user/login')
            .send({
              username: username,
              password: 'testpass', // 
            })
            .expect(200)
            .end((err, res) => {
              t.assert(_.has(res, 'body'));
              t.assert(_.has(res.body, 'success'));
              t.true(res.body.success);
              const cookie = res.headers['set-cookie'];

              // Get user.
              request(app)
                .post('/user/get')
                .set('cookie', cookie) // Important in order to get login session.
                .send({
                  id: userID
                })
                .expect(200)
                .end((err, res) => {
                  t.assert(_.has(res, 'body'));
                  t.assert(_.has(res.body, 'success'));
                  t.true(res.body.success);
                  t.assert(_.has(res.body, 'user'));
                  t.equal(res.body.user.username, username);

                  // Remove user.
                  request(app)
                    .post('/user/remove')
                    .set('cookie', cookie) // Important in order to get login session.
                    .send({
                      id: userID
                    })
                    .expect(200)
                    .end((err, res) => {
                      t.assert(_.has(res, 'body'));
                      t.assert(_.has(res.body, 'success'));
                      t.true(res.body.success);
                      t.end();
                    });
                });
            });
        });
    });
});

test('userUnauth', (t) => {
  const username = 'user_' + crypto.randomBytes(10).toString('base64');
  request(app)
    .post('/user/create')
    .send({
      username: username,
      password: 'testpass',
    })
    .expect(200)
    .end((err, res) => {
      t.assert(_.has(res, 'body'));
      t.assert(_.has(res.body, 'success'));
      t.true(res.body.success);
      t.assert(_.has(res.body, 'user'));
      const user = res.body.user;
      t.equal(user.username, username);
      t.assert(_.has(user, 'id'));
      const userID = user.id;

      // Try unauthenticated get.
      request(app)
        .post('/user/get')
        .send({
          id: userID,
        })
        .expect(200)
        .end((err, res) => {
          t.assert(_.has(res, 'body'));
          t.assert(_.has(res.body, 'success'));
          t.false(res.body.success); // Unauthenticated.

          // Try good login.
          request(app)
            .post('/user/login')
            .send({
              username: username,
              password: 'testpass', // 
            })
            .expect(200)
            .end((err, res) => {
              t.assert(_.has(res, 'body'));
              t.assert(_.has(res.body, 'success'));
              t.true(res.body.success);
              const cookie = res.headers['set-cookie'];

              // Remove user.
              request(app)
                .post('/user/remove')
                .set('cookie', cookie) // Important in order to get login session.
                .send({
                  id: userID
                })
                .expect(200)
                .end((err, res) => {
                  t.assert(_.has(res, 'body'));
                  t.assert(_.has(res.body, 'success'));
                  t.true(res.body.success);
                  t.end();
                });
            });
        });
    });
});

test('userUpdate', (t) => {
  const username = 'user_' + crypto.randomBytes(10).toString('base64');
  request(app)
    .post('/user/create')
    .send({
      username: username,
      password: 'testpass',
    })
    .expect(200)
    .end((err, res) => {
      t.assert(_.has(res, 'body'));
      t.assert(_.has(res.body, 'success'));
      t.true(res.body.success);
      t.assert(_.has(res.body, 'user'));
      const user = res.body.user;
      t.equal(user.username, username);
      t.assert(_.has(user, 'id'));
      const userID = user.id;

      // Try good login.
      request(app)
        .post('/user/login')
        .send({
          username: username,
          password: 'testpass',
        })
        .expect(200)
        .end((err, res) => {
          t.assert(_.has(res, 'body'));
          t.assert(_.has(res.body, 'success'));
          t.true(res.body.success);
          const cookie = res.headers['set-cookie'];

          // Update password.
          request(app)
            .post('/user/update')
            .set('cookie', cookie) // Important in order to get login session.
            .send({
              id: userID,
              password: 'newpass'
            })
            .expect(200)
            .end((err, res) => {
              t.assert(_.has(res, 'body'));
              t.assert(_.has(res.body, 'success'));
              t.true(res.body.success);

              request(app)
                .post('/user/login')
                .send({
                  username: username,
                  password: 'newpass',
                })
                .expect(200)
                .end((err, res) => {
                  t.assert(_.has(res, 'body'));
                  t.assert(_.has(res.body, 'success'));
                  t.true(res.body.success);
                  const cookie = res.headers['set-cookie'];

                  // Remove user.
                  request(app)
                    .post('/user/remove')
                    .set('cookie', cookie)
                    .send({
                      id: userID
                    })
                    .expect(200)
                    .end((err, res) => {
                      t.assert(_.has(res, 'body'));
                      t.assert(_.has(res.body, 'success'));
                      t.true(res.body.success);
                      t.end();
                    });
                });
            });
        });
    });
});