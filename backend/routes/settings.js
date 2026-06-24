const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/uploader');

// Helper to format settings object
function formatSettings(settingsRow) {
  if (!settingsRow) return null;
  
  let socialLinks = { facebook: '', instagram: '', whatsapp: '' };
  let seoSettings = { metaTitle: '', metaDescription: '', keywords: '' };

  try {
    socialLinks = typeof settingsRow.social_links === 'string' ? JSON.parse(settingsRow.social_links) : settingsRow.social_links;
  } catch (e) {}

  try {
    seoSettings = typeof settingsRow.seo_settings === 'string' ? JSON.parse(settingsRow.seo_settings) : settingsRow.seo_settings;
  } catch (e) {}

  return {
    ...settingsRow,
    social_links: socialLinks || { facebook: '', instagram: '', whatsapp: '' },
    seo_settings: seoSettings || { metaTitle: '', metaDescription: '', keywords: '' }
  };
}

// Get website settings
router.get('/', async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM settings LIMIT 1');
    if (settings.length === 0) {
      // Return hardcoded default if database settings row not initialized
      return res.json({
        logo_url: '/assets/logo.png',
        company_name: 'Akshar Graphics',
        email: 'akshargraphics15@gmail.com',
        phone: '98981 91220',
        address: '11, Sahvas Apt., Chowki Sheri Naka, Timaliyawad Main Road, Nanpura, Surat - 395001',
        social_links: { facebook: '#', instagram: '#', whatsapp: 'https://wa.me/919898191220' },
        seo_settings: {
          metaTitle: 'Akshar Graphics - Premium Printing & Branding Surat',
          metaDescription: '20+ Years of Trusted Printing & Creative Solutions in Surat, Gujarat. Wedding Cards, Branding, Banners & more.',
          keywords: 'printing surat, graphics surat, wedding cards surat'
        }
      });
    }
    res.json(formatSettings(settings[0]));
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update website settings (Admin only)
router.put('/', authMiddleware, upload.single('logo'), async (req, res) => {
  const { company_name, email, phone, address, social_links, seo_settings } = req.body;
  let logoUrl = req.body.logo_url;

  if (req.file) {
    logoUrl = `/uploads/${req.file.filename}`;
  }

  // Format objects as strings
  let socialLinksStr = '{}';
  if (social_links) {
    socialLinksStr = typeof social_links === 'string' ? social_links : JSON.stringify(social_links);
  }

  let seoSettingsStr = '{}';
  if (seo_settings) {
    seoSettingsStr = typeof seo_settings === 'string' ? seo_settings : JSON.stringify(seo_settings);
  }

  try {
    // Check if settings table is empty
    const settings = await db.query('SELECT * FROM settings LIMIT 1');
    
    if (settings.length === 0) {
      await db.query(
        'INSERT INTO settings (id, logo_url, company_name, email, phone, address, social_links, seo_settings) VALUES (1, ?, ?, ?, ?, ?, ?, ?)',
        [logoUrl || '', company_name || '', email || '', phone || '', address || '', socialLinksStr, seoSettingsStr]
      );
    } else {
      await db.query(
        'UPDATE settings SET logo_url = ?, company_name = ?, email = ?, phone = ?, address = ?, social_links = ?, seo_settings = ? WHERE id = 1',
        [logoUrl || settings[0].logo_url, company_name || '', email || '', phone || '', address || '', socialLinksStr, seoSettingsStr]
      );
    }

    const updatedSettings = await db.query('SELECT * FROM settings LIMIT 1');
    res.json(formatSettings(updatedSettings[0]));
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
