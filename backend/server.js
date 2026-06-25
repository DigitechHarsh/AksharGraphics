const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and CORS middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin image loads
}));
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, can restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload folders exist
// On Hostinger, Git auto-deploy resets the nodejs folder and wipes out untracked files.
// Storing uploads in the sibling public_html folder keeps them persistent and safe from Git resets.
const siblingPublicHtml = path.join(__dirname, '..', 'public_html');
const uploadsDir = fs.existsSync(siblingPublicHtml)
  ? path.join(siblingPublicHtml, 'uploads')
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically (both paths to support local and proxy modes)
app.use('/uploads', express.static(uploadsDir));
app.use('/api/uploads', express.static(uploadsDir));

// Serve a default placeholder assets folder if images aren't present
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
app.use('/assets', express.static(assetsDir));
app.use('/api/assets', express.static(assetsDir));

// Mock assets seeding (create mock files for logo and slides if missing so UI works instantly)
function seedPlaceholderAssets() {
  const assets = [
    'logo.svg',
    'slide_printing.jpg',
    'slide_branding.jpg',
    'slide_wedding.jpg',
    'service_logo.jpg',
    'service_printing.jpg',
    'service_wedding.jpg',
    'portfolio_wedding.jpg',
    'portfolio_branding.jpg',
    'portfolio_brochure.jpg',
    'client1.jpg',
    'client2.jpg',
    'owner.jpg'
  ];

  // We can write simple files or SVGs for each placeholder if it does not exist
  assets.forEach(assetName => {
    const assetPath = path.join(assetsDir, assetName);
    if (!fs.existsSync(assetPath)) {
      if (assetName.endsWith('.svg')) {
        // Write simple inline SVG logo
        fs.writeFileSync(assetPath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#D11414"/><text x="50%" y="55%" font-family="Poppins, Arial" font-size="24" fill="#FFF5DD" font-weight="bold" text-anchor="middle">AG</text></svg>`);
      } else {
        // Write blank dummy pixel or simple visual color box depending on image type
        // A tiny 1x1 pixel image or a simple color pattern image to prevent 404
        // Let's create actual simple text representations or SVGs named .jpg so the browser handles them,
        // or a real small solid JPEG buffer.
        // Standard tiny 1x1 JPEG buffer:
        const tinyJpeg = Buffer.from('/9j/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/wAARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEBAxEB/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQAAxEB/9oADwEAPg==', 'base64');
        fs.writeFileSync(assetPath, tinyJpeg);
      }
    }
  });
}

try {
  seedPlaceholderAssets();
} catch (e) {
  console.warn('Could not seed placeholder assets', e.message);
}

// Routes registration
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/services', require('./routes/services'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/settings', require('./routes/settings'));

// Temporary debug route to diagnose production upload paths
app.get('/api/debug-uploads', (req, res) => {
  try {
    const siblingPublicHtml_resolved = path.join(__dirname, '..', 'public_html');
    const siblingExists = fs.existsSync(siblingPublicHtml_resolved);
    const parentDir = path.join(__dirname, '..');
    const parentSiblingPublicHtml = path.join(parentDir, '..', 'public_html');
    const parentSiblingExists = fs.existsSync(parentSiblingPublicHtml);
    
    let uploadsFiles = [];
    if (fs.existsSync(uploadsDir)) {
      uploadsFiles = fs.readdirSync(uploadsDir);
    }
    
    res.json({
      __dirname,
      siblingPublicHtml: siblingPublicHtml_resolved,
      siblingExists,
      parentSiblingPublicHtml,
      parentSiblingExists,
      uploadsDir,
      uploadsDirExists: fs.existsSync(uploadsDir),
      uploadsFiles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Base healthcheck route
app.get('/health', (req, res) => {
  const db = require('./config/db');
  res.json({
    status: 'online',
    mysql: db.useMySQL() ? 'connected' : 'disabled (using JSON fallback)',
    timestamp: new Date().toISOString()
  });
});

// Serve React Frontend Static Files
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/assets')) {
      res.sendFile(path.resolve(publicPath, 'index.html'));
    }
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Akshar Graphics Server running on port ${PORT}`);
  console.log(`Healthcheck endpoint: http://localhost:${PORT}/health`);
});
