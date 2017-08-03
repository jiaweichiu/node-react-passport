const crypto = require('crypto');
const _ = require('underscore')._;
const pool = require('./pool');

// passwordHash hashes <password, salt> and sends the result to "done".
// The result sent is a base64 string.
function passwordHash(password, salt, done) {
  return crypto.pbkdf2(password, salt, 12427, 512, 'sha512', (err, hash) => {
    if (err) {
      return done(err, hash);
    }
    return done(err, hash.toString('base64'));
  });
}

function passwordSalt() {
  return crypto.randomBytes(128).toString('base64');
}

// create creates a user.
function create(user, done) {
  if (!_.has(user, 'username') ||
      !_.has(user, 'hash') ||
      !_.has(user, 'salt')) {
    return done('Missing field', null);
  }
  const q = `INSERT INTO table_users(username,hash,salt)
    values($1, $2, $3) RETURNING id`;
  const params = [user.username, user.hash, user.salt];
  pool.query(q, params, (err, res) => {
    if (err) {
      return done(err, null);
    }
    if (!res || !_.has(res, 'rowCount')) {
      return done('Missing result', null);
    }
    if (res.rowCount !== 1) {
      return done('Bad row count: ' + res.rowCount, null);
    }
    done(null, {
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

// update updates the user's fields.
function update(user, done) {
  if (!_.has(user, 'id')) {
    return done('Require user id', null);
  }
  var q = 'UPDATE table_users SET ';
  var params = [];
  _.each(['username', 'hash', 'salt'], (c) => {
    if (_.has(user, c)) {
      if (!_.isEmpty(params)) {
        q += ',';
      }
      q += c + '=$' + (params.length + 1).toString();
      params.push(user[c]);
    }
  });

  if (_.isEmpty(params)) {
    return done('No fields being changed', null);
  }
  q += ' WHERE id=' + user.id;
  pool.query(q, params, (err, res) => {
    if (err) {
      return done(err, null);
    }
    if (!res || !_.has(res, 'rowCount')) {
      return done('Missing result', null);
    }
    if (res.rowCount !== 1) {
      return done('Bad row count: ' + res.rowCount, null);
    }
    done(null, user);
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
  return getOne('username', username, done);
}

module.exports = {
  passwordHash,
  passwordSalt,
  getByID,
  getByUsername,
  create,
  remove,
  update,
};