const test = require('tape');
const user = require('./user');

test.onFinish(() => process.exit());

test('passwordHash', function(t) {
  user.passwordHash("somepass", "mysalt", (err, hash) => {
    t.error(err);
    // Base 64: 3 bytes (24 bit) turn into 4 base64 chars.
    // ceil(512/3) * 4 = 684.
    t.equal(hash.length, 684);
    t.end();
  });
});

test('passwordSalt', function(t) {
  // ceil(128/3) * 4 = 172.
  t.equal(user.passwordSalt().length, 172);
  t.end();
});
