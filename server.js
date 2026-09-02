const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path and resolve within ROOT_DIR
  let safePath = path.normalize(path.join(ROOT_DIR, pathname));

  // Security check: prevent directory traversal
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // If path is a directory, look for index.html or home.html
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    if (fs.existsSync(path.join(safePath, 'index.html'))) {
      safePath = path.join(safePath, 'index.html');
    } else if (fs.existsSync(path.join(safePath, 'home.html'))) {
      safePath = path.join(safePath, 'home.html');
    }
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>404 Not Found</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            h1 { font-size: 3rem; margin-bottom: 0.5rem; color: #f43f5e; }
            p { color: #94a3b8; font-size: 1.1rem; }
            a { color: #38bdf8; text-decoration: none; padding: 0.6rem 1.2rem; background: #1e293b; border-radius: 8px; margin-top: 1rem; }
            a:hover { background: #334155; }
          </style>
        </head>
        <body>
          <h1>404</h1>
          <p>The requested file <code>${pathname}</code> was not found.</p>
          <a href="/">← Return to Home</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range Requests (useful for media like mp4)
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(safePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(safePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 E-Commerce Server is running!`);
  console.log(`🌐 Local URL:       http://localhost:${PORT}`);
  console.log(`🛍️ User Store:     http://localhost:${PORT}/user/home.html`);
  console.log(`🔐 Admin Panel:     http://localhost:${PORT}/admin/home.html`);
  console.log(`==================================================\n`);
});
