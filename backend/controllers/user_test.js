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
        .post('/login')
        .send({
          username: username,
          password: 'wrongpassword',
        })
        .expect(200)
        .end((err, res) => {
          t.assert(_.has(res, 'body'));
          t.assert(_.has(res.body, 'success'));
          t.false(res.body.success);  // Wrong pass.

          // Try good login.
          request(app)
          .post('/login')
          .send({
            username: username,
            password: 'testpass',
          })
          .expect(200)
          .end((err, res) => {
            t.assert(_.has(res, 'body'));
            t.assert(_.has(res.body, 'success'));
            t.true(res.body.success);

            // Remove user.
            request(app)
            .post('/user/remove')
            .send({userID: userID})
            .expect(200)
            .end((err, res) => {
              console.log('~~~~~~~~~~~~~~~~~~~');
              console.log(res.body);
              t.assert(_.has(res, 'body'));
              t.assert(_.has(res.body, 'success'));
              t.true(res.body.success);
              t.end();
            });
          });
        });
    });
});