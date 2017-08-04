const pg = require('pg');

var pool = null; // Connection pool.

function isReady() {
  return pool !== null;
}

// cb is function(err, res).
function query(q, values, cb) {
  if (!pool) {
    return cb('Null pool', null);
  }
  return pool.query(q, values, cb);
}

function init(app) {
  var config;
  if (app.settings.env === 'development') {
    config = {
      user: 'jchiu',
      database: 'db0000',
      password: 'somepassword',
      host: 'localhost',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000,
    };
  } else if (app.settings.env === 'test') {
    config = {
      user: 'jchiu',
      database: 'db0000',
      password: 'somepassword',
      host: 'localhost',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000,
    };
  } else {
    return; // Leaves pool as null.
  }
  pool = new pg.Pool(config);
  pool.on('error', (err, client) => {
    // if an error is encountered by a client while it sits idle in the pool 
    // the pool itself will emit an error event with both the error and 
    // the client which emitted the original error 
    // this is a rare occurrence but can happen if there is a network partition 
    // between your application and the database, the database restarts, etc. 
    // and so you might want to handle it and at least log it out 
    console.error('Idle client error', err.message, err.stack);
  });
}

// the pool also supports checking out a client for 
// multiple operations, such as a transaction 
module.exports = {
  isReady,
  init,
  query,
};