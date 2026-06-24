const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Helper to send email notification
async function sendEmailNotification(inquiry) {
  const { name, phone, email, service, message } = inquiry;
  
  // Validate SMTP details exist before trying
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[SMTP SIMULATION] New Inquiry Received:\n` +
                `- Name: ${name}\n` +
                `- Phone: ${phone}\n` +
                `- Email: ${email}\n` +
                `- Service: ${service}\n` +
                `- Message: ${message}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 465,
      secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Akshar Graphics Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER || 'akshargraphics15@gmail.com',
      subject: `New Inquiry: ${service} from ${name}`,
      text: `You have received a new inquiry from your website:\n\n` +
            `Name: ${name}\n` +
            `Phone: ${phone}\n` +
            `Email: ${email}\n` +
            `Service Required: ${service}\n\n` +
            `Message:\n${message}\n\n` +
            `Please follow up with the client.`,
      html: `
        <h3>New Inquiry Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Required:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #D11414;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <br>
        <p style="color: #666; font-size: 12px;">This is an automated notification from your Akshar Graphics website.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent: %s', info.messageId);
  } catch (err) {
    console.error('Error sending email notification:', err.message);
  }
}

// Get all inquiries (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inquiries = await db.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit inquiry (Public)
router.post('/', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || !phone || !email || !service || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  try {
    const result = await db.query(
      'INSERT INTO inquiries (name, phone, email, service, message, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, email, service, message, 'New']
    );

    const inquiryData = {
      id: result.insertId,
      name,
      phone,
      email,
      service,
      message,
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Send email notification asynchronously (don't block the client response)
    sendEmailNotification(inquiryData);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiryData
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update inquiry status (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['New', 'Contacted', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Valid status is required (New, Contacted, Closed)' });
  }

  try {
    const result = await db.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ id, status, message: 'Inquiry status updated successfully' });
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
