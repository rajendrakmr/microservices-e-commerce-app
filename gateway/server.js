const express = require('express');
const app = express();
app.use(express.json());

const T = {
  product: process.env.PRODUCT_URL || 'http://product:8081',
  order: process.env.ORDER_URL || 'http://order:8083',
  inventory: process.env.INVENTORY_URL || 'http://inventory:8082',
};
let requests = 0;
app.use((req, _res, next) => { requests++; next(); });

async function proxy(req, res, url) {
  try {
    const hasBody = !['GET', 'HEAD'].includes(req.method);
    const r = await fetch(url, {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });
    res.status(r.status).type('json').send(await r.text());
  } catch (e) {
    res.status(502).json({ error: 'upstream unavailable' });
  }
}

app.get('/api/products', (q, r) => proxy(q, r, `${T.product}/products`));
app.get('/api/products/:id', (q, r) => proxy(q, r, `${T.product}/products/${q.params.id}`));
app.get('/api/stock/:id', (q, r) => proxy(q, r, `${T.inventory}/stock/${q.params.id}`));
app.get('/api/orders', (q, r) => proxy(q, r, `${T.order}/orders`));
app.post('/api/orders', (q, r) => proxy(q, r, `${T.order}/orders`));

app.get('/health', (_q, r) => r.json({ status: 'ok' }));
app.get('/metrics', (_q, r) =>
  r.type('text/plain').send(`# TYPE gateway_requests_total counter\ngateway_requests_total ${requests}\n`));

if (require.main === module) app.listen(8080, () => console.log('gateway :8080'));
module.exports = app;
