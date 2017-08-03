const crypto = require('crypto');
const _ = require('underscore')._;
const pool = require('./pool');

// passwordHash hashes <password, salt> and sends the result to cb.
// The result sent is a base64 string.
function passwordHash(password, salt, cb) {
  return crypto.pbkdf2(password, salt, 12427, 512, 'sha512', (err, hash) => {
    if (err) {
      return cb(err, hash);
    }
    return cb(err, hash.toString('base64'));
  });
}

function passwordSalt() {
  return crypto.randomBytes(128).toString('base64');
}

// create creates a user.
function create(user, cb) {
  if (!_.has(user, 'username') ||
      !_.has(user, 'hash') ||
      !_.has(user, 'salt')) {
    return cb('Missing field', null);
  }
  const q = `INSERT INTO table_users(username,hash,salt)
    values($1, $2, $3) RETURNING id`;
  const params = [user.username, user.hash, user.salt];
  pool.query(q, params, (err, res) => {
    if (err) {
      return cb(err, null);
    }
    if (!res || !_.has(res, 'rowCount')) {
      return cb('Missing result', null);
    }
    if (res.rowCount !== 1) {
      return cb('Bad row count: ' + res.rowCount, null);
    }
    cb(null, {
      id: res.rows[0].id,  // Return the ID for new user.
      username: user.username,
    });
  });
}

// remove removes a user.
function remove(userID, done) {
  const q = 'DELETE FROM table_users WHERE id=$1';
  pool.query(q, [userID], (err, res) => {
    if (err) {
      return done(err, null);
    }
    if (!res || !_.has(res, 'rowCount')) {
      return done('Missing result', null);
    }
    if (res.rowCount !== 1) {
      return done('Bad row count: ' + res.rowCount, null);
    }
    done(null, userID);
  });
}

// getOne is a helper function that looks for one user with given field having
// the given value. For example, getOne("id", 123) gets you user with id=123.
// done is a function(err, result).
function getOne(field, value, done) {
  const q = 'SELECT * FROM table_users WHERE ' + field + '=($1)';
  pool.query(q, [value], (err, res) => {
    if (err) {
      return done(err, null);
    }
    if (!res || !_.has(res, 'rowCount')) {
      return done('Missing result', null);
    }
    if (res.rowCount !== 1) {
      return done('Bad row count: ' + res.rowCount, null);
    }
    done(null, res.rows[0]);
  });
}

function getByID(userID, done) {
  return getOne('id', userID, done);
}

function getByUsername(username, done) {
  return getOne('username', uesrname, done);
}

module.exports = {
  passwordHash,
  passwordSalt,
  getByID,
  getByUsername,
  create,
  remove,
};