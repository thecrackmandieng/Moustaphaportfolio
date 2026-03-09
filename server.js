const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 10000);
const distDir = path.join(__dirname, 'dist', 'moustapha-portfolio');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/octet-stream'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const resolved = path.normalize(path.join(distDir, decoded));
  if (!resolved.startsWith(distDir)) {
    return null;
  }
  return resolved;
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || '/');
  if (!filePath) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  let targetPath = filePath;
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    targetPath = path.join(targetPath, 'index.html');
  }

  if (!fs.existsSync(targetPath)) {
    targetPath = path.join(distDir, 'index.html');
  }

  fs.readFile(targetPath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Server error');
      return;
    }
    const ext = path.extname(targetPath);
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Static server running on port ${port}`);
});
