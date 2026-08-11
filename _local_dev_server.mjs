import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8000;

const REWRITES = [
  { pattern: /^\/bookings(\/.*)?$/, dest: '/my-bookings.html' },
  { pattern: /^\/dashboard(\/.*)?$/, dest: '/executive-dashboard.html' },
  { pattern: /^\/login(\/.*)?$/, dest: '/executive-login.html' },
];

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.sql': 'text/plain',
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  const rewrite = REWRITES.find(r => r.pattern.test(pathname));
  if (rewrite) pathname = rewrite.dest;

  // cleanUrls: /foo -> /foo.html if it exists and /foo doesn't
  let filePath = path.join(ROOT, pathname);
  if (pathname !== '/' && !fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }
  if (pathname === '/') filePath = path.join(ROOT, 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Dev server with vercel.json rewrites running at http://localhost:${PORT}`);
});
