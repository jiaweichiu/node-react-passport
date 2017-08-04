const test = require('tape');
const crypto = require('crypto');

const mUser = require('./user');
const app = require('../app');

test.onFinish(() => process.exit());

test('passwordHash', (t) => {
  mUser.passwordHash("somepass", "mysalt", (err, hash) => {
    t.error(err);
    // Base 64: 3 bytes (24 bit) turn into 4 base64 chars.
    // ceil(512/3) * 4 = 684.
    t.equal(hash.length, 684);
    t.end();
  });
});

test('passwordSalt', (t) => {
  // ceil(128/3) * 4 = 172.
  t.equal(mUser.passwordSalt().length, 172);
  t.end();
});

test('userQuery', (t) => {
  const username = 'user_' + crypto.randomBytes(10).toString('base64');
  const salt = mUser.passwordSalt();
  const user = {
    username: username,
    hash: 'somehash',
    salt: salt,
  };
  mUser.create(user, (err, res) => {
    t.error(err);
    const userID = res.id;
    mUser.getByID(userID, (err, res) => {
      t.error(err);
      t.equal(res.salt, salt);
      t.equal(res.username, username);
      t.equal(res.hash, 'somehash');
      mUser.remove(userID, (err, res) => {
        t.error(err);
        mUser.getByID(userID, (err, res) => {
          t.true(err); // Expect an error.
          t.false(res);
          t.end();
        });
      });
    })
  });
});

test('userQueryUpdate', (t) => {
  const username = 'user_' + crypto.randomBytes(10).toString('base64');
  const salt = mUser.passwordSalt();
  const user = {
    username: username,
    hash: 'somehash',
    salt: salt,
  };
  mUser.create(user, (err, res) => {
    t.error(err);
    const userID = res.id;
    const user2 = {
      id: userID,
      hash: 'anotherhash',
    };
    mUser.update(user2, (err, res) => {
      t.error(err);
      mUser.getByUsername(username, (err, res) => {
        t.error(err);
        t.equal(res.salt, salt);
        t.equal(res.username, username);
        t.equal(res.hash, 'anotherhash');
        mUser.remove(userID, (err, res) => {
          t.error(err);
          t.end();
        });
      });
    })
  });
});