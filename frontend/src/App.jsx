import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Global Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Works from './pages/Works';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCursorHovered, setIsCursorHovered] = useState(false);
  const location = useLocation();

  // Loader Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800); // 1.8 seconds matches progress bar animation
    return () => clearTimeout(timer);
  }, []);

  // Custom Cursor Tracker
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('cursor-pointer');
      
      setIsCursorHovered(!!isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Custom Cursor */}
      <div
        className={`hidden md:block custom-cursor ${isCursorHovered ? 'custom-cursor-hover' : ''}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Loading Transition Screen */}
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      {!isLoading && (
        <div className="flex flex-col min-h-screen">
          {/* Global Sticky Navigation (Hidden in Admin Dashboard) */}
          {!isAdminRoute && <Header />}

          {/* Main App Workspace */}
          <main className={`flex-grow ${!isAdminRoute ? 'pt-[70px]' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/works" element={<Works />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </main>

          {/* Global Footer (Hidden in Admin Dashboard) */}
          {!isAdminRoute && <Footer />}
        </div>
      )}
    </>
  );
}
