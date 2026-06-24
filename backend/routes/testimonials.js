const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/uploader');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add testimonial (Admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { client_name, review } = req.body;
  let imageUrl = '';

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.image_url) {
    imageUrl = req.body.image_url;
  }

  if (!client_name || !review) {
    return res.status(400).json({ message: 'Client name and review text are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO testimonials (client_name, review, image_url) VALUES (?, ?, ?)',
      [client_name, review, imageUrl || '']
    );
    res.status(201).json({ id: result.insertId, client_name, review, image_url: imageUrl });
  } catch (err) {
    console.error('Error adding testimonial:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update testimonial (Admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { client_name, review } = req.body;
  let imageUrl = req.body.image_url;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!client_name || !review) {
    return res.status(400).json({ message: 'Client name and review are required' });
  }

  try {
    const result = await db.query(
      'UPDATE testimonials SET client_name = ?, review = ?, image_url = ? WHERE id = ?',
      [client_name, review, imageUrl || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ id, client_name, review, image_url: imageUrl });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete testimonial (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
