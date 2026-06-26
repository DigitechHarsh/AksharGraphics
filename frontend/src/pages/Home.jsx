import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiCheckCircle, HiCalendar, HiSparkles, HiShieldCheck } from 'react-icons/hi';
import axios from 'axios';
import SEO from '../components/SEO';
import { API_BASE_URL, API_STATIC_BASE } from '../config';

function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - (width / 2);
    const mouseY = e.clientY - rect.top - (height / 2);
    
    // Calculate tilt ratio (limit to 8 degrees for elegant effect)
    const rX = (mouseY / (height / 2)) * 8;
    const rY = -(mouseX / (width / 2)) * 8;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Fetch site data on load
  useEffect(() => {
    // Fetch all Services for slider and preview
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/services`);
        setServices(res.data);
      } catch {
        setServices([
          { id: 1, category: "Graphic Design", name: "Creative Logo Design", description: "Elevate your brand with custom logo designs crafted by our experienced branding artists.", image_url: "/assets/service_logo.jpg" },
          { id: 2, category: "Printing Solutions", name: "High-Quality Flyers & Banners", description: "Print marketing assets that demand attention. Crisp colors, premium cardstocks.", image_url: "/assets/service_printing.jpg" },
          { id: 3, category: "Wedding Printing", name: "Premium Wedding Cards", description: "Handcrafted, foil-stamped, and laser-cut wedding invitation designs.", image_url: "/assets/service_wedding.jpg" }
        ]);
      }
    };

    // Fetch Portfolio
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/portfolio`);
        if (res.data.length > 0) {
          setPortfolioItems(res.data);
        } else {
          setPortfolioItems([
            { id: 1, category: "Premium Wedding Cards", title: "Royal Crimson Foil Card", image_url: "/assets/portfolio_wedding.jpg" },
            { id: 2, category: "Creative Logo Design", title: "Premium Corporate Stationery", image_url: "/assets/portfolio_branding.jpg" },
            { id: 3, category: "High-Quality Flyers & Banners", title: "Trifold Real Estate Catalog", image_url: "/assets/portfolio_brochure.jpg" }
          ]);
        }
      } catch {
        setPortfolioItems([
          { id: 1, category: "Premium Wedding Cards", title: "Royal Crimson Foil Card", image_url: "/assets/portfolio_wedding.jpg" },
          { id: 2, category: "Creative Logo Design", title: "Premium Corporate Stationery", image_url: "/assets/portfolio_branding.jpg" },
          { id: 3, category: "High-Quality Flyers & Banners", title: "Trifold Real Estate Catalog", image_url: "/assets/portfolio_brochure.jpg" }
        ]);
      }
    };

    // Fetch Testimonials
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/testimonials`);
        if (res.data.length > 0) {
          setTestimonials(res.data);
        } else {
          setTestimonials([
            { id: 1, client_name: "Rajesh Patel", review: "Akshar Graphics has been printing our business cards and banners for over 5 years. Their quality is top-notch and delivery is always on time!", image_url: "/assets/client1.jpg" },
            { id: 2, client_name: "Sneha Mehta", review: "We ordered our wedding cards from Chandreshbhai. Every card was beautifully crafted. Our guests loved them. Highly recommended!", image_url: "/assets/client2.jpg" }
          ]);
        }
      } catch {
        setTestimonials([
          { id: 1, client_name: "Rajesh Patel", review: "Akshar Graphics has been printing our business cards and banners for over 5 years. Their quality is top-notch and delivery is always on time!", image_url: "/assets/client1.jpg" },
          { id: 2, client_name: "Sneha Mehta", review: "We ordered our wedding cards from Chandreshbhai. Every card was beautifully crafted. Our guests loved them. Highly recommended!", image_url: "/assets/client2.jpg" }
        ]);
      }
    };

    fetchServices();
    fetchPortfolio();
    fetchTestimonials();
  }, []);

  // Slider Autoplay
  useEffect(() => {
    if (services.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [services]);

  // Preload service images to prevent slide transition lag
  useEffect(() => {
    if (services.length === 0) return;
    services.forEach((s) => {
      const img = new Image();
      img.src = s.image_url.startsWith('/') ? `${API_STATIC_BASE}${s.image_url}` : s.image_url;
    });
  }, [services]);

  const handleNextHero = () => {
    if (services.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const handlePrevHero = () => {
    if (services.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Portfolio categories dynamic based on services
  const categories = ['All', ...services.map(s => s.name)];
  
  const filteredPortfolio = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  // Redesigned Active Service for Hero
  const activeSvc = services[currentSlide] || {
    id: 0,
    category: "Design & Print",
    name: "Premium Printing Services",
    description: "Surat's leading agency for premium wedding cards, branding assets, corporate catalogs, and custom graphic design services. We turn imagination into high-definition prints.",
    image_url: "/assets/service_printing.jpg",
    benefits: ["Premium Print Quality", "Custom Graphic Tailoring", "20+ Years Local Trust"]
  };

  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to Akshar Graphics, Surat. With 20+ years of printing excellence, we design & print custom wedding cards, business stationery, flyers, brochures, and banners."
      />

      {/* Floating Accent Shapes & Rainbow Light Leaks */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rainbow-light-leak pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-10 w-[600px] h-[600px] rainbow-light-leak pointer-events-none -z-10" style={{ animationDelay: '-4s' }} />

      {/* Floating Cartoon Mascots / widgets */}
      <div className="absolute top-24 left-4 z-20 pointer-events-none hidden lg:block cartoon-bounce-1">
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-brand-red/10 shadow-lg flex items-center space-x-2 text-xs font-bold font-poppins">
          <span className="text-2xl">🎨</span>
          <div className="text-left">
            <span className="block text-brand-red">Design Mode</span>
            <span className="text-[9px] text-brand-charcoal/50">Always Active</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[480px] right-8 z-20 pointer-events-none hidden lg:block cartoon-bounce-2">
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-brand-red/10 shadow-lg flex items-center space-x-2 text-xs font-bold font-poppins">
          <span className="text-2xl">⚡</span>
          <div className="text-left">
            <span className="block text-amber-500">Fast Offset</span>
            <span className="text-[9px] text-brand-charcoal/50">Express Prints</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[780px] left-6 z-20 pointer-events-none hidden lg:block cartoon-bounce-1" style={{ animationDelay: '-2s' }}>
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-brand-red/10 shadow-lg flex items-center space-x-2 text-xs font-bold font-poppins">
          <span className="text-2xl">👾</span>
          <div className="text-left">
            <span className="block text-blue-500">Pixel Perfect</span>
            <span className="text-[9px] text-brand-charcoal/50">High DPI Prints</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto my-6 px-4 md:px-6 z-10">
        <div className="relative w-full h-auto min-h-[580px] md:h-[580px] rounded-[2.5rem] overflow-hidden border border-brand-red/10 shadow-2xl bg-brand-charcoal flex flex-col justify-between p-6 md:p-12">
          
          {/* Animated Wavy RGB Background */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden rounded-[2.5rem]">
            <div className="rainbow-wave-bg" />
          </div>

          {/* Active Service Background Image */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSvc.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeSvc.image_url.startsWith('/') ? `${API_STATIC_BASE}${activeSvc.image_url}` : activeSvc.image_url}
                  alt={activeSvc.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
            {/* Rich Dark Vignette Overlay for perfect readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/85 to-brand-charcoal/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-brand-charcoal/40 z-10" />
          </div>

          {/* Top Badge Row */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-poppins font-black text-brand-cream uppercase tracking-widest">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
              </span>
              <span>ESTD 2000 • 20+ Years Excellence</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-poppins font-black text-white uppercase tracking-widest">
              <HiSparkles className="text-amber-400" size={12} />
              <span>ISO 9001:2015 QUALITY CERTIFIED</span>
            </div>
          </div>

          {/* Center Details Section */}
          <div className="relative z-20 max-w-3xl text-left my-8 md:my-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSvc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Active Service Category */}
                <span className="inline-block bg-brand-red text-white text-[10px] font-poppins font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg shadow-brand-red/30">
                  {activeSvc.category}
                </span>

                {/* Big Showcase Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold text-white leading-tight">
                  Premium <span className="cmyk-rainbow-text">{activeSvc.name}</span> Solutions
                </h2>

                {/* Service Description */}
                <p className="text-sm md:text-base text-brand-grey/85 leading-relaxed max-w-2xl font-sans">
                  {activeSvc.description}
                </p>

                {/* Benefits Checkbox List */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                  {(activeSvc.benefits && activeSvc.benefits.length > 0
                    ? activeSvc.benefits
                    : ["Premium Quality Materials", "Express Design Mockups", "Experienced Local Press Craftsmanship"]
                  ).slice(0, 3).map((benefit, idx) => (
                    <span key={idx} className="flex items-center space-x-2 text-xs font-semibold text-brand-cream/90">
                      <HiCheckCircle className="text-brand-red shrink-0" size={16} />
                      <span>{benefit}</span>
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    to="/contact"
                    className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-bold text-xs tracking-wider uppercase px-8 py-4 rounded-full shadow-xl shadow-brand-red/25 hover:shadow-brand-red/35 transition-all duration-200"
                  >
                    Get Free Quote
                  </Link>
                  <Link
                    to="/contact"
                    state={{ serviceName: activeSvc.name }}
                    className="bg-white/10 hover:bg-white/20 text-white font-poppins font-bold text-xs tracking-wider uppercase px-8 py-4 rounded-full border border-white/10 backdrop-blur-md shadow-sm transition-all duration-200"
                  >
                    Inquire About This
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Thumbnails Track & Navigation Controls */}
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 w-full mt-auto">
            {/* Horizontal Scrollable Thumbnails List */}
            <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-1 max-w-full md:max-w-[75%] lg:max-w-[80%] shrink-0">
              {services.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative flex items-center space-x-3 p-2 rounded-2xl border transition-all duration-300 shrink-0 text-left cursor-pointer group ${
                    currentSlide === idx
                      ? 'bg-white/15 border-brand-red shadow-lg scale-102 ring-1 ring-brand-red/20'
                      : 'bg-brand-charcoal/40 border-white/5 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <img
                    src={s.image_url.startsWith('/') ? `${API_STATIC_BASE}${s.image_url}` : s.image_url}
                    alt={s.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop";
                    }}
                    className="w-10 h-10 object-cover rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="pr-2">
                    <span className="block text-[10px] font-sans font-bold text-brand-grey/50 uppercase tracking-wide">
                      {s.category}
                    </span>
                    <span className="block text-[11px] font-poppins font-bold text-white max-w-[130px] truncate">
                      {s.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-4 shrink-0 mt-2 md:mt-0">
              <span className="text-xs font-mono text-brand-grey/50">
                {String(currentSlide + 1).padStart(2, '0')} / {String(services.length || 3).padStart(2, '0')}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevHero}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-red hover:text-white border border-white/10 text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Previous service"
                >
                  <HiChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextHero}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-red hover:text-white border border-white/10 text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Next service"
                >
                  <HiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-brand-grey/30 py-12 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rainbow-light-leak pointer-events-none -z-10 opacity-70" />
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-4 py-1.5 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-brand-charcoal">
              Delivering Quality & Trust Since 2000
            </h2>
          </div>

          {/* Cards Grid — 3 clean cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: 20+ Years Experience */}
            <TiltCard className="h-full rainbow-glow-wrapper">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="bg-white p-6 rounded-[1.4rem] flex flex-col justify-between space-y-5 group transition-all duration-300 h-full text-left"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-grey text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <HiCalendar size={28} />
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-brand-charcoal">
                    20+ Years Experience
                  </h3>
                  <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">
                    Expert knowledge in corporate design and print since 2000.
                  </p>
                </div>
                <div className="bg-brand-cream/40 border border-brand-red/10 rounded-xl p-4 text-center">
                  <span className="block text-3xl font-poppins font-black text-brand-red">2000</span>
                  <span className="text-[10px] font-poppins font-bold tracking-widest text-brand-charcoal/50 uppercase">Established</span>
                </div>
              </motion.div>
            </TiltCard>

            {/* Card 2: Premium Quality */}
            <TiltCard className="h-full rainbow-glow-wrapper">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white p-6 rounded-[1.4rem] flex flex-col justify-between space-y-5 group transition-all duration-300 h-full text-left"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-grey text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <HiShieldCheck size={28} />
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-brand-charcoal">
                    Premium Quality Printing
                  </h3>
                  <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">
                    Ultra-crisp offset & digital presses with vivid color fidelity.
                  </p>
                </div>
                <div className="border-t border-brand-charcoal/5 pt-3">
                  <span className="text-[10px] font-poppins font-bold tracking-widest text-brand-charcoal/40 uppercase block mb-2">CMYK Proof</span>
                  <div className="flex space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-[#00aeef] block shadow-inner" />
                    <span className="w-7 h-7 rounded-lg bg-[#ec008c] block shadow-inner" />
                    <span className="w-7 h-7 rounded-lg bg-[#fff200] block shadow-inner" />
                    <span className="w-7 h-7 rounded-lg bg-[#2B2B2B] block shadow-inner" />
                  </div>
                </div>
              </motion.div>
            </TiltCard>

            {/* Card 3: Trusted by Thousands */}
            <TiltCard className="h-full rainbow-glow-wrapper">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white p-6 rounded-[1.4rem] flex flex-col justify-between space-y-5 group transition-all duration-300 h-full text-left"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-grey text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <HiCheckCircle size={28} />
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-brand-charcoal">
                    Trusted by Thousands
                  </h3>
                  <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">
                    Serving corporate agencies, NRI clients, hospitals & schools.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-brand-grey/50 p-3 rounded-xl border border-brand-charcoal/5 text-center">
                    <span className="block text-xl font-poppins font-extrabold text-brand-red">5k+</span>
                    <span className="text-[9px] font-sans font-bold text-brand-charcoal/50 uppercase tracking-widest">Clients</span>
                  </div>
                  <div className="bg-brand-grey/50 p-3 rounded-xl border border-brand-charcoal/5 text-center">
                    <span className="block text-xl font-poppins font-extrabold text-brand-red">10M+</span>
                    <span className="text-[9px] font-sans font-bold text-brand-charcoal/50 uppercase tracking-widest">Prints</span>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
            
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="relative py-12 px-8 max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] my-8 border border-brand-red/5">
        {/* Rainbow RGB flowing waves background */}
        <div className="rainbow-wave-bg">
          <div className="wave-blob-1"></div>
          <div className="wave-blob-2"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
          <div className="space-y-4 max-w-xl text-left">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-brand-charcoal">
              Premium Printing & Branding Offerings
            </h2>
          </div>
          <Link
            to="/services"
            className="flex items-center space-x-2 text-brand-red hover:text-brand-deepRed font-poppins font-bold text-sm uppercase tracking-wider transition-colors duration-200"
          >
            <span>View All Services</span>
            <HiArrowRight size={16} />
          </Link>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((svc, idx) => (
            <TiltCard key={svc.id} className="h-full rainbow-glow-wrapper">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white rounded-[1.4rem] overflow-hidden shadow-md flex flex-col h-full"
              >
                <div className="h-[220px] overflow-hidden relative">
                  <img
                    src={svc.image_url.startsWith('/') ? `${API_STATIC_BASE}${svc.image_url}` : svc.image_url}
                    alt={svc.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-brand-red text-white font-poppins font-semibold text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-md shadow-brand-red/20">
                    {svc.category}
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-poppins font-bold text-xl text-brand-charcoal">
                      {svc.name}
                    </h3>
                    <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">
                      {svc.description}
                    </p>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center space-x-2 text-brand-red hover:text-brand-deepRed font-poppins font-bold text-xs uppercase tracking-wider transition-colors duration-200 mt-2"
                  >
                    <span>Learn More</span>
                    <HiArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
      </section>

      {/* International Clients Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto overflow-hidden relative">
        {/* Glow circle overlay */}
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left: Tilted 3D Badge Map Card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <TiltCard className="w-full max-w-md rainbow-glow-wrapper">
              <div className="bg-brand-charcoal text-white p-8 rounded-[1.4rem] relative overflow-hidden shadow-2xl border border-white/10" style={{ transformStyle: 'preserve-3d' }}>
                {/* 3D Inner Layer: Glowing Radial grid */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/25 via-transparent to-transparent -z-10" />
                
                {/* 3D Floating Badge Mark */}
                <div 
                  className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center text-white mb-6 shadow-xl shadow-brand-red/40"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <HiSparkles size={28} className="animate-pulse" />
                </div>
                
                <h3 
                  className="text-2xl font-poppins font-extrabold tracking-wide mb-3"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Global Print Footprint
                </h3>
                
                <p 
                  className="text-sm text-brand-grey/60 font-sans leading-relaxed mb-6"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Serving corporate agencies and NRI clients globally. We deliver print solutions and creative brand guidelines with international shipping standards.
                </p>

                {/* Country List in 3D layers */}
                <div 
                  className="grid grid-cols-2 gap-3"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {['🇺🇸 United States', '🇬🇧 United Kingdom', '🇨🇦 Canada', '🇦🇪 United Arab Emirates', '🇦🇺 Australia', '🇳🇵 Nepal'].map((country, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold hover:bg-brand-red hover:border-brand-red transition-all duration-300 cursor-pointer">
                      {country}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right: Section Text */}
          <div className="w-full lg:w-1/2 text-left space-y-6">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-4 py-1.5 rounded-full">
              Global Shipping
            </span>
            <h2 className="text-3xl md:text-5xl font-poppins font-extrabold text-brand-charcoal leading-tight">
              Trusted by Clients <br />
              <span className="text-brand-red">Across the Globe</span>
            </h2>
            <p className="text-sm text-brand-charcoal/70 leading-relaxed font-sans">
              Our 20+ years of printing excellence reaches clients worldwide. We cater to NRI families for custom premium wedding invitation suites and assist global startups with complete corporate stationery, brochures, and standee printouts.
            </p>
            
            {/* Features lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                "Global Express Courier Dispatch",
                "Premium NRI Stationery Suites",
                "ISO Quality Paper Controls",
                "24/7 Digital Artwork Access"
              ].map((f, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm font-semibold text-brand-charcoal/80">
                  <HiCheckCircle className="text-brand-red shrink-0" size={18} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work / Portfolio Section */}
      <section className="bg-brand-charcoal text-white py-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-left">
          {/* Header */}
          <div className="mb-8 space-y-3">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-white">
              Featured Work & Designs
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-poppins font-semibold text-xs tracking-wide uppercase px-5 py-2.5 rounded-full transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-brand-red border-brand-red text-brand-cream shadow-lg shadow-brand-red/25'
                    : 'border-white/10 hover:border-brand-red hover:text-brand-red text-brand-grey/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.slice(0, 6).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative rounded-2xl overflow-hidden shadow-2xl h-[280px] cursor-pointer"
                >
                  <img
                    src={item.image_url.startsWith('/') ? `${API_STATIC_BASE}${item.image_url}` : item.image_url}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10" />
                  
                  <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 space-y-1">
                    <span className="text-brand-red font-poppins font-bold text-[10px] uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h4 className="font-poppins font-bold text-lg text-white">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-brand-grey/60 font-sans leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPortfolio.length === 0 && (
            <p className="text-center text-brand-grey/40 py-12 font-poppins text-sm font-semibold">
              No items in this category yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-12 px-6 max-w-4xl mx-auto text-center relative">
          <div className="space-y-6">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-brand-charcoal">
              What Our Clients Say
            </h2>

            <div className="h-[200px] md:h-[160px] flex items-center justify-center relative px-8">
              <AnimatePresence mode="wait">
                {testimonials.map((t, idx) => (
                  idx === currentTestimonial && (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <p className="text-lg md:text-xl font-playfair italic text-brand-charcoal/80 leading-relaxed">
                        "{t.review}"
                      </p>
                      <div>
                        <h4 className="font-poppins font-semibold text-brand-charcoal text-base">
                          {t.client_name}
                        </h4>
                        <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest font-bold">Verified Customer</p>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Testimonials Control Buttons */}
            {testimonials.length > 1 && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePrevTestimonial}
                  className="w-10 h-10 rounded-full border border-brand-charcoal/10 hover:border-brand-red hover:text-brand-red flex items-center justify-center text-brand-charcoal transition-all duration-300"
                >
                  <HiChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextTestimonial}
                  className="w-10 h-10 rounded-full border border-brand-charcoal/10 hover:border-brand-red hover:text-brand-red flex items-center justify-center text-brand-charcoal transition-all duration-300"
                >
                  <HiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="rainbow-glow-wrapper rounded-[2rem] overflow-hidden">
          <div className="bg-brand-charcoal text-white py-12 px-8 text-center relative overflow-hidden rounded-[1.9rem]">
            {/* Background Light Leak */}
            <div className="absolute inset-0 rainbow-light-leak pointer-events-none opacity-25" />
            
            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-poppins font-extrabold leading-tight">
                Let's Bring Your <span className="cmyk-rainbow-text">Ideas to Life</span>
              </h2>
              <p className="text-sm md:text-base font-sans max-w-xl mx-auto text-brand-grey/75 leading-relaxed">
                Need a professional logo, standard office bills, catalog layout, custom cards, or supplementary schoolbooks? Share your requirements for a free estimate.
              </p>
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="bg-brand-red hover:bg-brand-deepRed text-white font-poppins font-bold text-sm tracking-wider uppercase px-10 py-4.5 rounded-full shadow-xl shadow-brand-red/20 transition-all duration-200"
                >
                  Request Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
