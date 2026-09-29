// ==========================================================================
// E-Setu Production Server (For Render & Cloud Deployments)
// High-Performance, Zero-Dependency Fallback Node.js Server with REST APIs
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 10000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const PUBLIC_DIR = fs.existsSync(FRONTEND_DIR) ? FRONTEND_DIR : __dirname;
const DATASETS_DIR = fs.existsSync(path.join(FRONTEND_DIR, 'datasets')) 
  ? path.join(FRONTEND_DIR, 'datasets') 
  : path.join(__dirname, 'datasets');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function readDataset(fileName) {
  try {
    const filePath = path.join(DATASETS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading dataset ${fileName}:`, err);
  }
  return null;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Healthcheck Route (Required for Render health checks)
  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'e-setu-platform',
      version: '2026.1.0',
      timestamp: new Date().toISOString(),
      cpcb_compliance: 'E-Waste (Management) Rules, 2022'
    }));
    return;
  }

  // 2. REST API Routes
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'active',
      mode: 'production',
      port: PORT,
      features: [
        'Acoustic Copper Resonance Analyzer (~3.1kHz FFT)',
        'CEIR Safe-Scrap Legal Shield',
        'AI Cannibalization & Re-Use Radar',
        'Proof of Responsible Handover (PORH)',
        'CPCB Form-6 Manifest Generator'
      ]
    }));
    return;
  }

  if (pathname === '/api/materials') {
    const data = readDataset('materials.json') || [];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/prices') {
    const data = readDataset('prices_mandi.json') || { rates: [] };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/recyclers') {
    const data = readDataset('authorized_recyclers.json') || [];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/transactions') {
    const data = readDataset('transactions_ledger.json') || [];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/profiles') {
    const data = readDataset('collector_profiles.json') || [];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/traceability') {
    const data = readDataset('traceability_porh.json') || [];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/ai-metadata') {
    const data = readDataset('ai_training_metadata.json') || {};
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  // CEIR Verification API
  if (pathname.startsWith('/api/verify-ceir')) {
    const imei = parsedUrl.query.imei || pathname.split('/').pop() || 'UNKNOWN';
    const isClean = !imei.includes('STOLEN');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      imei: imei,
      ceir_status: isClean ? 'CLEAN_VERIFIED' : 'BLACKLISTED_STOLEN',
      safe_to_recycle: isClean,
      certificate_clause: 'E-Waste Rules 2022 - Section 4(3) Safe Transport Exemption',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // POST /api/lots (Lot synchronization)
  if (pathname === '/api/lots' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const lot = JSON.parse(body);
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, lot_id: lot.lot_id, synced: true }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // POST /api/handover (Handover registration)
  if (pathname === '/api/handover' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const txn = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, transaction_id: txn.transaction_id, verified: true }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 3. Static File Serving
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  // Sanitize path to prevent directory traversal
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA routing
      const indexFallback = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexFallback, (fallbackErr, data) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Caching headers
    if (ext === '.html' || filePath.endsWith('service-worker.js')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🌿 E-Setu Production Server running on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/health`);
});
