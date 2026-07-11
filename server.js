'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.json': 'application/json',
};

const ROOT = __dirname;

const server = http.createServer((req, res) => {
  // Strip query string and decode URI
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  // Resolve to an absolute path and verify it stays within ROOT
  const filePath = path.resolve(ROOT, urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, ''));
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Jupiter Command running at http://${HOST}:${PORT}`);
});
