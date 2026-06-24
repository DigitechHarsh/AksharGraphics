const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/uploader');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await db.query('SELECT * FROM services ORDER BY created_at DESC');
    // Parse JSON field for benefits if stringified
    const formattedServices = services.map(s => {
      let parsedBenefits = [];
      try {
        parsedBenefits = typeof s.benefits === 'string' ? JSON.parse(s.benefits) : s.benefits;
        if (!Array.isArray(parsedBenefits)) parsedBenefits = [];
      } catch (e) {
        parsedBenefits = [];
      }
      return { ...s, benefits: parsedBenefits };
    });
    res.json(formattedServices);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add service (Admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { category, name, description, benefits } = req.body;
  let imageUrl = '';

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.image_url) {
    imageUrl = req.body.image_url;
  }

  if (!category || !name || !description || !imageUrl) {
    return res.status(400).json({ message: 'Category, name, description, and image are required' });
  }

  // Format benefits as JSON string
  let benefitsStr = '[]';
  if (benefits) {
    try {
      benefitsStr = typeof benefits === 'string' ? benefits : JSON.stringify(benefits);
    } catch (e) {
      benefitsStr = '[]';
    }
  }

  try {
    const result = await db.query(
      'INSERT INTO services (category, name, description, benefits, image_url) VALUES (?, ?, ?, ?, ?)',
      [category, name, description, benefitsStr, imageUrl]
    );

    let parsedBenefits = [];
    try {
      parsedBenefits = JSON.parse(benefitsStr);
    } catch (e) {}

    res.status(201).json({
      id: result.insertId,
      category,
      name,
      description,
      benefits: parsedBenefits,
      image_url: imageUrl
    });
  } catch (err) {
    console.error('Error adding service:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update service (Admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { category, name, description, benefits } = req.body;
  let imageUrl = req.body.image_url;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!category || !name || !description || !imageUrl) {
    return res.status(400).json({ message: 'Category, name, description, and image_url are required' });
  }

  let benefitsStr = '[]';
  if (benefits) {
    try {
      benefitsStr = typeof benefits === 'string' ? benefits : JSON.stringify(benefits);
    } catch (e) {
      benefitsStr = '[]';
    }
  }

  try {
    const result = await db.query(
      'UPDATE services SET category = ?, name = ?, description = ?, benefits = ?, image_url = ? WHERE id = ?',
      [category, name, description, benefitsStr, imageUrl, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    let parsedBenefits = [];
    try {
      parsedBenefits = JSON.parse(benefitsStr);
    } catch (e) {}

    res.json({
      id,
      category,
      name,
      description,
      benefits: parsedBenefits,
      image_url: imageUrl
    });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete service (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM services WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
