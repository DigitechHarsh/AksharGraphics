import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import axios from 'axios';
import { API_BASE_URL, API_STATIC_BASE } from '../config';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/assets/logo.png');
  const location = useLocation();

  // Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch settings for custom logo if configured
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/settings`);
        if (res.data && res.data.logo_url) {
          setLogoUrl(`${API_STATIC_BASE}${res.data.logo_url}`);
        }
      } catch (err) {
        // Fallback to local public path if api fails
        setLogoUrl('/assets/logo.png');
      }
    };
    fetchSettings();
  }, [location]);

  // Close mobile drawer on routing
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Works', path: '/works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-header py-3 shadow-md shadow-brand-charcoal/5'
          : 'glass-header-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 flex items-center justify-center">
            <img
              src={logoUrl}
              alt="Akshar Graphics Logo"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.getElementById('brand-text-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div id="brand-text-fallback" className="hidden w-10 h-10 rounded-lg bg-brand-red items-center justify-center shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-poppins font-extrabold text-lg text-brand-cream">AG</span>
            </div>
          </div>
          <span className="font-poppins font-extrabold text-xl tracking-wider text-brand-charcoal">
            AKSHAR <span className="text-brand-red">GRAPHICS</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-poppins font-semibold text-sm tracking-wide uppercase transition-colors duration-200 hover:text-brand-red ${
                  isActive ? 'text-brand-red' : 'text-brand-charcoal'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          <Link
            to="/contact"
            className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-lg shadow-brand-red/25 hover:shadow-brand-red/35 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Quote
          </Link>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-brand-charcoal hover:text-brand-red p-1 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-brand-cream/95 backdrop-blur-md z-30 flex flex-col justify-between py-12 px-8 border-t border-brand-red/10 animate-fade-in">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-poppins font-extrabold text-2xl tracking-wide uppercase transition-colors duration-200 ${
                    isActive ? 'text-brand-red' : 'text-brand-charcoal'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-6">
            <Link
              to="/contact"
              className="block w-full text-center bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold tracking-wider uppercase py-4 rounded-xl shadow-lg shadow-brand-red/25"
            >
              Get Free Quote
            </Link>
            
            <p className="text-center text-xs text-brand-charcoal/50 font-poppins font-medium">
              Call Us: 98981 91220
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
