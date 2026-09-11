const http = require('http');

const TARGET_PORT = 4000;
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  const isHealthCheck = req.method === 'GET' && (req.url === '/' || req.url === '/health');

  if (!isHealthCheck) {
    const key = req.headers['x-api-key'];
    if (!API_KEY || key !== API_KEY) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
      return;
    }
  }

  const headers = { ...req.headers };
  delete headers['x-api-key'];
  headers['authorization'] = 'Bearer local-internal-secret';
  headers['host'] = `127.0.0.1:${TARGET_PORT}`;

  const proxyReq = http.request(
    {
      hostname: '127.0.0.1',
      port: TARGET_PORT,
      path: req.url === '/' ? '/health' : req.url,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  proxyReq.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad gateway: ' + err.message);
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy listening on ${PORT}`);
});
