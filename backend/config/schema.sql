-- Akshar Graphics Database Schema

CREATE DATABASE IF NOT EXISTS akshar_graphics;
USE akshar_graphics;

-- 1. Users Table (Admin Auth)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url VARCHAR(255) NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'Get Quote',
  cta_link VARCHAR(255) DEFAULT '/contact',
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL, -- 'Graphic Design', 'Printing Solutions', etc.
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  benefits JSON, -- Array of benefit strings
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Portfolio Table
CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL, -- 'Wedding Cards', 'Business Branding', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  is_international TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  review TEXT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('New', 'Contacted', 'Closed') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  logo_url VARCHAR(255),
  company_name VARCHAR(255) DEFAULT 'Akshar Graphics',
  email VARCHAR(255) DEFAULT 'akshargraphics15@gmail.com',
  phone VARCHAR(50) DEFAULT '98981 91220',
  address TEXT,
  social_links JSON, -- Object with facebook, instagram, twitter, whatsapp
  seo_settings JSON, -- Object with metaTitle, metaDescription, keywords
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Settings
INSERT INTO settings (id, logo_url, company_name, email, phone, address, social_links, seo_settings)
VALUES (
  1,
  '/assets/logo.png',
  'Akshar Graphics',
  'akshargraphics15@gmail.com',
  '98981 91220',
  '11, Sahvas Apt., Chowki Sheri Naka, Timaliyawad Main Road, Nanpura, Surat - 395001',
  '{"facebook": "#", "instagram": "#", "whatsapp": "https://wa.me/919898191220"}',
  '{"metaTitle": "Akshar Graphics - Premium Printing & Branding Surat", "metaDescription": "20+ Years of Trusted Printing & Creative Solutions in Surat, Gujarat. Wedding Cards, Branding, Banners & more.", "keywords": "printing surat, graphics surat, wedding cards surat"}'
) ON DUPLICATE KEY UPDATE id=id;
