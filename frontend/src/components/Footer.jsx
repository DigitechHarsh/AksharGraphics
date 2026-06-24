import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiMail, HiPhone, HiMap } from 'react-icons/hi';
import axios from 'axios';
import { API_BASE_URL, API_STATIC_BASE } from '../config';

export default function Footer() {
  const [settings, setSettings] = useState({
    company_name: 'Akshar Graphics',
    email: 'akshargraphics15@gmail.com',
    phone: '98981 91220',
    address: '11, Sahvas Apt., Chowki Sheri Naka, Timaliyawad Main Road, Nanpura, Surat - 395001',
    social_links: { facebook: '#', instagram: '#', whatsapp: 'https://wa.me/919898191220' }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/settings`);
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch settings for footer, using fallback.');
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-brand-charcoal text-brand-grey pt-16 pb-8 border-t border-brand-red/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={settings.logo_url ? (settings.logo_url.startsWith('/') ? `${API_STATIC_BASE}${settings.logo_url}` : settings.logo_url) : '/assets/logo.png'}
              alt="Akshar Graphics Logo"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.getElementById('footer-brand-text-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
              className="h-9 w-auto object-contain"
            />
            <div id="footer-brand-text-fallback" className="hidden w-9 h-9 rounded-lg bg-brand-red items-center justify-center">
              <span className="font-poppins font-extrabold text-base text-white">AG</span>
            </div>
            <span className="font-poppins font-extrabold text-lg tracking-wider text-white">
              AKSHAR <span className="text-brand-red">GRAPHICS</span>
            </span>
          </Link>
          <p className="text-sm text-brand-grey/60 font-sans leading-relaxed">
            Over 20 years of delivering premium printing, creative branding, and digital design services to businesses in Surat and beyond.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href={settings.social_links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-grey/80 hover:bg-brand-red hover:text-white transition-all duration-300"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href={settings.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-grey/80 hover:bg-brand-red hover:text-white transition-all duration-300"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={settings.social_links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-grey/80 hover:bg-brand-red hover:text-white transition-all duration-300"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="text-brand-grey/60 hover:text-brand-red transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-brand-grey/60 hover:text-brand-red transition-colors duration-200">
                Our Services
              </Link>
            </li>
            <li>
              <Link to="/works" className="text-brand-grey/60 hover:text-brand-red transition-colors duration-200">
                Our Works
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-brand-grey/60 hover:text-brand-red transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-brand-grey/60 hover:text-brand-red transition-colors duration-200">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-brand-grey/40 hover:text-brand-red transition-colors duration-200">
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Services List */}
        <div className="space-y-6">
          <h3 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider">
            Our Services
          </h3>
          <ul className="space-y-3 text-sm text-brand-grey/60">
            <li>Graphic Logo Design</li>
            <li>Flyer & Brochure Printing</li>
            <li>Premium Wedding Cards</li>
            <li>Corporate Billbooks & Stationery</li>
            <li>School & College Registers</li>
            <li>Hospital & Medical Forms</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider">
            Contact Details
          </h3>
          <ul className="space-y-4 text-sm text-brand-grey/60">
            <li className="flex items-start space-x-3">
              <HiMap className="text-brand-red mt-1 shrink-0" size={20} />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center space-x-3">
              <HiPhone className="text-brand-red shrink-0" size={18} />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <HiMail className="text-brand-red shrink-0" size={18} />
              <a href={`mailto:${settings.email}`} className="hover:text-brand-red transition-colors duration-200">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-brand-grey/40 font-medium">
        <p>© {new Date().getFullYear()} Akshar Graphics. All Rights Reserved.</p>
        <p className="mt-4 md:mt-0">
          Designed for Chandresh Lainingwala (20+ Years Experience)
        </p>
      </div>
    </footer>
  );
}
