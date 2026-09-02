const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
// Check multiple possible root locations
const ROOT_DIRS = [
  __dirname,
  process.cwd(),
  path.join(__dirname, '..'),
  path.join(process.cwd(), 'e-comerse')
];

function resolveFilePath(pathname) {
  for (const root of ROOT_DIRS) {
    if (!fs.existsSync(root)) continue;

    let candidate = path.normalize(path.join(root, pathname));
    
    // Exact file match
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }

    // Directory match -> check index.html or home.html
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      const idx = path.join(candidate, 'index.html');
      if (fs.existsSync(idx) && fs.statSync(idx).isFile()) return idx;
      const hm = path.join(candidate, 'home.html');
      if (fs.existsSync(hm) && fs.statSync(hm).isFile()) return hm;
    }

    // Append .html extension if omitted (e.g., /user/home -> /user/home.html)
    const withHtml = candidate + '.html';
    if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) {
      return withHtml;
    }

    // Also check inside user/ subdirectory (e.g., /cart -> /user/cart.html)
    const userCandidate = path.join(root, 'user', pathname.replace(/^\//, ''));
    if (fs.existsSync(userCandidate) && fs.statSync(userCandidate).isFile()) {
      return userCandidate;
    }
    const userCandidateHtml = userCandidate + '.html';
    if (fs.existsSync(userCandidateHtml) && fs.statSync(userCandidateHtml).isFile()) {
      return userCandidateHtml;
    }

    // Root fallback to index.html
    if (pathname === '/' || pathname === '') {
      const rootIndex = path.join(root, 'index.html');
      if (fs.existsSync(rootIndex) && fs.statSync(rootIndex).isFile()) return rootIndex;
    }
  }
  return null;
}

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
  let pathname = decodeURIComponent(parsedUrl.pathname || '/');

  const resolvedPath = resolveFilePath(pathname);

  if (!resolvedPath) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>404 - Page Not Found</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          h1 { font-size: 3rem; margin-bottom: 0.5rem; color: #f43f5e; }
          p { color: #94a3b8; font-size: 1.1rem; }
          .btn-group { display: flex; gap: 10px; margin-top: 1rem; }
          a { color: #38bdf8; text-decoration: none; padding: 0.6rem 1.2rem; background: #1e293b; border-radius: 8px; font-weight: 600; }
          a:hover { background: #334155; }
        </style>
      </head>
      <body>
        <h1>404</h1>
        <p>The requested file <code>${pathname}</code> was not found.</p>
        <div class="btn-group">
          <a href="/">← Return to Portal</a>
          <a href="/user/home.html">🛍️ Go to Store</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stats = fs.statSync(resolvedPath);

  // Support HTTP Range Requests (useful for media like mp4)
  const range = req.headers.range;
  if (range && (ext === '.mp4' || ext === '.webm')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(resolvedPath, { start, end });

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
    fs.createReadStream(resolvedPath).pipe(res);
  }
});

// Export server for serverless / Vercel compatibility
module.exports = server;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 E-Commerce Server is running!`);
    console.log(`🌐 Local URL:       http://localhost:${PORT}`);
    console.log(`🛍️ User Store:     http://localhost:${PORT}/user/home.html`);
    console.log(`🔐 Admin Panel:     http://localhost:${PORT}/admin/home.html`);
    console.log(`==================================================\n`);
  });
}
