const test = require('tape');
const crypto = require('crypto');
const modelUser = require('./user');
const app = require('../app');

test.onFinish(() => process.exit());

// test('passwordHash', function(t) {
//   modelUser.passwordHash("somepass", "mysalt", (err, hash) => {
//     t.error(err);
//     // Base 64: 3 bytes (24 bit) turn into 4 base64 chars.
//     // ceil(512/3) * 4 = 684.
//     t.equal(hash.length, 684);
//     t.end();
//   });
// });

// test('passwordSalt', function(t) {
//   // ceil(128/3) * 4 = 172.
//   t.equal(modelUser.passwordSalt().length, 172);
//   t.end();
// });

// A bit of callback waterfall.
test('userCRUD', function(t) {
  const username = 'user_' + crypto.randomBytes(10).toString('base64');
  const salt = modelUser.passwordSalt();
  const user = {
    'username': username,
    'hash': 'somehash',
    'salt': salt,
  };
  modelUser.create(user, (err, res) => {
    t.error(err);
    const userID = res.id;
    modelUser.getByID(userID, (err, res) => {
      t.error(err);
      t.equal(res.salt, salt);
      t.equal(res.username, username);
      t.equal(res.hash, 'somehash');
      modelUser.remove(userID, (err, res) => {
        t.error(err);
        modelUser.getByID(userID, (err, res) => {
          t.true(err);  // Expect an error.
          t.false(res);
          t.end();
        });
      });
    })
  });
});