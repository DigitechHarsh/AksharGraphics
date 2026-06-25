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
  const cursorRef = useRef(null);
  const location = useLocation();

  // Loader Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800); // 1.8 seconds matches progress bar animation
    return () => clearTimeout(timer);
  }, []);

  // Custom Cursor Tracker with lerped animation and event delegation
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const updateMousePosition = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    let rafId;
    const updateCursor = () => {
      const speed = 0.15; // Lower values = smoother trailing, higher = faster response
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;
      
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', updateMousePosition);
    rafId = requestAnimationFrame(updateCursor);

    // Bubble check on hover state changes to avoid heavy layout thrashing on every pixel move
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('cursor-pointer');

      if (isClickable) {
        cursor.classList.add('custom-cursor-hover');
      } else {
        cursor.classList.remove('custom-cursor-hover');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
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
        ref={cursorRef}
        className="hidden md:block custom-cursor"
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
