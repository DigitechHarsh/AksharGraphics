const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/uploader');

// Get all slides
router.get('/', async (req, res) => {
  try {
    const slides = await db.query('SELECT * FROM hero_slides ORDER BY `order` ASC');
    res.json(slides);
  } catch (err) {
    console.error('Error fetching hero slides:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add slide (Admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, subtitle, cta_text, cta_link, order } = req.body;
  let imageUrl = '';

  if (req.file) {
    imageUrl = upload.getFileUrl(req.file);
  } else if (req.body.image_url) {
    imageUrl = req.body.image_url;
  }

  if (!title || !imageUrl) {
    return res.status(400).json({ message: 'Title and image are required' });
  }

  try {
    const orderVal = order ? parseInt(order, 10) : 0;
    const result = await db.query(
      'INSERT INTO hero_slides (title, subtitle, image_url, cta_text, cta_link, `order`) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle || '', imageUrl, cta_text || 'Get Quote', cta_link || '/contact', orderVal]
    );
    res.status(201).json({ id: result.insertId, title, subtitle, image_url: imageUrl, cta_text, cta_link, order: orderVal });
  } catch (err) {
    console.error('Error adding hero slide:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update slide (Admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, cta_text, cta_link, order } = req.body;
  let imageUrl = req.body.image_url;

  if (req.file) {
    imageUrl = upload.getFileUrl(req.file);
  }

  if (!title || !imageUrl) {
    return res.status(400).json({ message: 'Title and image_url are required' });
  }

  try {
    const orderVal = order ? parseInt(order, 10) : 0;
    const result = await db.query(
      'UPDATE hero_slides SET title = ?, subtitle = ?, image_url = ?, cta_text = ?, cta_link = ?, `order` = ? WHERE id = ?',
      [title, subtitle || '', imageUrl, cta_text || 'Get Quote', cta_link || '/contact', orderVal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    res.json({ id, title, subtitle, image_url: imageUrl, cta_text, cta_link, order: orderVal });
  } catch (err) {
    console.error('Error updating hero slide:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete slide (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM hero_slides WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.json({ message: 'Slide deleted successfully' });
  } catch (err) {
    console.error('Error deleting hero slide:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
