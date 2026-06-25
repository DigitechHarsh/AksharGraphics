import React, { useState, useEffect, useRef } from 'react';
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
  const dotRef = useRef(null);
  const ringRef = useRef(null);
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
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      // Position cursor using GPU-accelerated transform translate3d
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      ring.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      // Check if mouse is hovering over interactive elements
      const target = e.target;
      if (!target) return;

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('cursor-pointer');

      if (isClickable) {
        dot.classList.add('custom-cursor-hover');
        ring.classList.add('custom-cursor-ring-hover');
      } else {
        dot.classList.remove('custom-cursor-hover');
        ring.classList.remove('custom-cursor-ring-hover');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Custom Cursor Dot */}
      <div
        ref={dotRef}
        className="hidden md:block custom-cursor-dot"
      />
      {/* Custom Cursor Ring */}
      <div
        ref={ringRef}
        className="hidden md:block custom-cursor-ring"
      />

      {/* Loading Transition Screen */}
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      {!isLoading && (
        <div className="flex flex-col min-h-screen relative">
          {/* Global Floating RGB Orbs — ambient background effect */}
          {!isAdminRoute && (
            <div className="rgb-floating-orbs" aria-hidden="true">
              <div className="rgb-orb rgb-orb-1" />
              <div className="rgb-orb rgb-orb-2" />
              <div className="rgb-orb rgb-orb-3" />
              <div className="rgb-orb rgb-orb-4" />
              <div className="rgb-orb rgb-orb-5" />
              <div className="rgb-orb rgb-orb-6" />
            </div>
          )}

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
