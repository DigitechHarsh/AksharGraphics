const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/uploader');

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const portfolio = await db.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json(portfolio);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add portfolio item (Admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { category, title, description, is_international } = req.body;
  let imageUrl = '';

  if (req.file) {
    imageUrl = upload.getFileUrl(req.file);
  } else if (req.body.image_url) {
    imageUrl = req.body.image_url;
  }

  if (!category || !title || !imageUrl) {
    return res.status(400).json({ message: 'Category, title, and image are required' });
  }

  const isIntlVal = (is_international === 'true' || is_international === true || is_international == 1) ? 1 : 0;

  try {
    const result = await db.query(
      'INSERT INTO portfolio (category, title, description, image_url, is_international) VALUES (?, ?, ?, ?, ?)',
      [category, title, description || '', imageUrl, isIntlVal]
    );
    res.status(201).json({ id: result.insertId, category, title, description, image_url: imageUrl, is_international: isIntlVal });
  } catch (err) {
    console.error('Error adding portfolio item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update portfolio item (Admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { category, title, description, is_international } = req.body;
  let imageUrl = req.body.image_url;

  if (req.file) {
    imageUrl = upload.getFileUrl(req.file);
  }

  if (!category || !title || !imageUrl) {
    return res.status(400).json({ message: 'Category, title, and image_url are required' });
  }

  const isIntlVal = (is_international === 'true' || is_international === true || is_international == 1) ? 1 : 0;

  try {
    const result = await db.query(
      'UPDATE portfolio SET category = ?, title = ?, description = ?, image_url = ?, is_international = ? WHERE id = ?',
      [category, title, description || '', imageUrl, isIntlVal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({ id, category, title, description, image_url: imageUrl, is_international: isIntlVal });
  } catch (err) {
    console.error('Error updating portfolio item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete portfolio item (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM portfolio WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (err) {
    console.error('Error deleting portfolio item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
