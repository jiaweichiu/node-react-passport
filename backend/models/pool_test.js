const test = require('tape');

const pool = require('./pool');
const app = require('../app');

test.onFinish(() => process.exit());

test('pool', (t) => {
  t.true(pool.isReady());
  t.end();
});

test('query', (t) => {
  pool.query('SELECT * FROM table_users LIMIT 1', [], (err, res) => {
    t.error(err);
    t.end();
  });
});