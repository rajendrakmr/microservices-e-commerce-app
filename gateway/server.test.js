const test = require('node:test');
const assert = require('node:assert');
const app = require('./server');
test('health endpoint', async () => {
  const s = app.listen(0);
  const res = await fetch(`http://localhost:${s.address().port}/health`);
  assert.strictEqual((await res.json()).status, 'ok');
  s.close();
});
