const test = require('tape');
const pool = require('./pool');
const app = require('../app');

test.onFinish(() => process.exit());

test('pool', function(t) {
  t.true(pool.isReady());
  t.end();
});

test('query', function(t) {
  pool.query('SELECT * FROM table_users', [], (err, res) => {
    t.error(err);
    t.end();
  });
});
