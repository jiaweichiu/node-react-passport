const crypto = require("crypto");
const _ = require("underscore")._;

// passwordHash hashes <password, salt> and sends the result to "cb".
// The result sent is a base64 string.
function passwordHash(password, salt, cb) {
  return crypto.pbkdf2(password, salt, 12427, 512, "sha512", (err, hash) => {
    if (err) {
      return cb(err, hash);
    }
    return cb(err, hash.toString("base64"));
  });
}

function passwordSalt() {
  return crypto.randomBytes(128).toString("base64");
}

function create(user, cb) {
  const q = `INSERT INTO table_users(username,hash,salt)
    values($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
  const params = [user.username, user.hash, user.salt];
  pool.query(q, params, (err, res) => {
    if (err) {
      return cb(err, null);
    }
    if (!res || !_.has(res, "rowCount")) {
      return cb("Missing result", null);
    }
    if (res.rowCount !== 1) {
      return cb("Bad row count: " + res.rowCount, null);
    }
    cb(null, {
      id: res.rows[0].id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  });
}

module.exports = {
  passwordHash,
  passwordSalt,
};