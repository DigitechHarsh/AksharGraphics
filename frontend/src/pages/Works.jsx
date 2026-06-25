import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiArrowRight, HiX as CloseIcon, HiMail, HiOutlineGlobeAlt, HiOutlineFolderOpen } from 'react-icons/hi';
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
    
    // limit to 6 degrees for elegant effect
    const rX = (mouseY / (height / 2)) * 6;
    const rY = -(mouseX / (width / 2)) * 6;

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

export default function Works() {
  const [portfolio, setPortfolio] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Domestic', 'International'
  const [selectedWork, setSelectedWork] = useState(null); // For inquiry modal
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Portfolio items
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/portfolio`);
        setPortfolio(res.data);
      } catch (err) {
        setPortfolio(getDefaultPortfolio());
      }
    };
    fetchPortfolio();
  }, []);

  const getDefaultPortfolio = () => [
    {
      id: 1,
      category: "Premium Wedding Cards",
      title: "Royal Crimson Foil Card",
      description: "Exquisite wedding card with heavy gold embossing and crimson velvet finish for NRI family in New Jersey.",
      image_url: "/assets/portfolio_wedding.jpg",
      is_international: 1
    },
    {
      id: 2,
      category: "Creative Logo Design",
      title: "Premium Corporate Stationery",
      description: "Custom embossed letterheads, gold-trimmed cards, and corporate envelopes.",
      image_url: "/assets/portfolio_branding.jpg",
      is_international: 0
    },
    {
      id: 3,
      category: "High-Quality Flyers & Banners",
      title: "Trifold Real Estate Catalog",
      description: "High-gloss marketing trifold brochure for Surat commercial real estate project.",
      image_url: "/assets/portfolio_brochure.jpg",
      is_international: 0
    },
    {
      id: 4,
      category: "Creative Logo Design",
      title: "Vivid London Cafe Logo",
      description: "Brand identity design, menus, signage guidelines for a cafe based in London, UK.",
      image_url: "/assets/service_logo.jpg",
      is_international: 1
    },
    {
      id: 5,
      category: "High-Quality Flyers & Banners",
      title: "Heavy Duty Equipment Catalog",
      description: "Standard industrial parts booklet with matte coating and custom indexing.",
      image_url: "/assets/service_printing.jpg",
      is_international: 0
    },
    {
      id: 6,
      category: "Premium Wedding Cards",
      title: "Metallic Gold Laser Cut Set",
      description: "Intricate laser cut cards and custom wax seal stamps for a client in Sydney, Australia.",
      image_url: "/assets/service_wedding.jpg",
      is_international: 1
    }
  ];

  const handleOpenModal = (workTitle) => {
    setSelectedWork(workTitle);
    setIsInquirySubmitted(false);
    setFormError('');
    setFormData({ 
      name: '', 
      phone: '', 
      email: '', 
      message: `Hi, I would like to inquire about replicating or customizing a design similar to your work: "${workTitle}".` 
    });
  };

  const handleCloseModal = () => {
    setSelectedWork(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const { name, phone, email, message } = formData;
    if (!name || !phone || !email || !message) {
      setFormError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name,
        phone,
        email,
        service: `Portfolio Inquiry: ${selectedWork}`,
        message
      };

      const res = await axios.post(`${API_BASE_URL}/inquiries`, payload);
      if (res.data.success) {
        setIsInquirySubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter criteria
  const filteredPortfolio = portfolio.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'International') return item.is_international === 1 || item.is_international === true;
    if (activeFilter === 'Domestic') return item.is_international === 0 || item.is_international === false || !item.is_international;
    return true;
  });

  return (
    <>
      <SEO 
        title="Our Works" 
        description="Explore the creative gallery of Akshar Graphics Surat. Premium designs, wedding invitation suites, and international corporate branding portfolios."
      />

      {/* Header Banner with light leaks */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-brand-charcoal text-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/works_banner.png"
            alt="Works Banner Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-brand-charcoal/80 mix-blend-multiply" />
          <div className="absolute inset-0 rainbow-light-leak pointer-events-none opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-4 py-1.5 rounded-full border border-brand-red/20">
            Showcase
          </span>
          <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-white">
            Our Creative <span className="cmyk-rainbow-text">Works Portfolio</span>
          </h1>
          <p className="text-brand-grey/80 font-sans text-sm max-w-xl mx-auto leading-relaxed">
            Take a look at our prints, textured wedding suites, and custom brand designs delivered to local businesses and global NRI clients.
          </p>
        </div>
      </section>

      {/* Filter Menu Bar */}
      <section className="py-6 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-brand-charcoal/10 pb-4">
          {/* Left: Info */}
          <div className="text-left space-y-1">
            <h2 className="font-poppins font-extrabold text-xl text-brand-charcoal">
              Exquisite Print Gallery
            </h2>
            <p className="text-xs text-brand-charcoal/50 leading-relaxed font-sans">
              Click elements to inquire or read design highlights.
            </p>
          </div>

          {/* Right: Tabs */}
          <div className="flex space-x-1.5 bg-brand-charcoal/5 p-1.5 rounded-full border border-brand-charcoal/10">
            {[
              { id: 'All', label: 'All Projects', icon: <HiOutlineFolderOpen size={16} /> },
              { id: 'Domestic', label: 'Domestic Works', icon: <HiCheckCircle size={16} /> },
              { id: 'International', label: 'International Clients 🌍', icon: <HiOutlineGlobeAlt size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center space-x-1.5 font-poppins font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === tab.id
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-charcoal/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-12 px-6 max-w-7xl mx-auto relative">
        {/* Decorative background leak */}
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rainbow-light-leak pointer-events-none opacity-40 -z-10" />

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredPortfolio.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <TiltCard className="h-full rainbow-glow-wrapper">
                  <div className="bg-white rounded-[1.4rem] overflow-hidden shadow-lg flex flex-col justify-between h-full group">
                    <div className="relative h-[250px] overflow-hidden">
                      <img
                        src={item.image_url.startsWith('/') ? `${API_STATIC_BASE}${item.image_url}` : item.image_url}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Category Badge overlay */}
                      <span className="absolute top-4 left-4 bg-brand-charcoal/80 backdrop-blur-sm text-white font-poppins font-bold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md z-10">
                        {item.category}
                      </span>

                      {/* International Tag overlay */}
                      {item.is_international == 1 && (
                        <span className="absolute top-4 right-4 bg-brand-red text-white font-poppins font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md shadow-md z-10 flex items-center space-x-1 animate-pulse">
                          <span>🌍 NRI CLIENT</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between text-left space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-poppins font-black text-xl text-brand-charcoal leading-snug group-hover:text-brand-red transition-colors duration-200">
                          {item.title}
                        </h3>
                        <p className="text-sm text-brand-charcoal/65 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleOpenModal(item.title)}
                        className="inline-flex items-center space-x-2 text-brand-red hover:text-brand-deepRed font-poppins font-bold text-xs uppercase tracking-wider transition-colors duration-200 pt-2"
                      >
                        <span>Inquire About Design</span>
                        <HiArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPortfolio.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-brand-charcoal/5"
          >
            <HiOutlineFolderOpen size={48} className="mx-auto text-brand-charcoal/30 mb-4 animate-bounce" />
            <h3 className="font-poppins font-bold text-lg text-brand-charcoal mb-1">No Works Listed</h3>
            <p className="text-sm text-brand-charcoal/50 font-sans">Check back later or inquire directly for custom catalogues.</p>
          </motion.div>
        )}
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedWork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-brand-charcoal"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#FCFAF6] border border-brand-red/10 max-w-lg w-full rounded-3xl p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-brand-charcoal hover:text-brand-red transition-colors duration-200"
              >
                <CloseIcon size={24} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-brand-red font-poppins font-bold text-[10px] uppercase tracking-widest">
                    Portfolio Inquiry
                  </span>
                  <h3 className="font-poppins font-extrabold text-2xl text-brand-charcoal mt-1">
                    Inquire: <span className="text-brand-red">{selectedWork}</span>
                  </h3>
                </div>

                {isInquirySubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <HiCheckCircle size={36} />
                    </div>
                    <h4 className="font-poppins font-bold text-xl text-brand-charcoal">Request Submitted!</h4>
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed font-sans max-w-xs mx-auto">
                      Your query has been logged. Chandreshbhai Lainingwala or our design team will contact you shortly.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-poppins font-semibold text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg shadow-md"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                    {formError && (
                      <div className="bg-brand-red/10 border-l-4 border-brand-red text-brand-red p-3.5 rounded text-xs font-semibold">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-sm font-sans"
                          placeholder="Your Name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-sm font-sans"
                          placeholder="Phone No."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-sm font-sans"
                        placeholder="yourname@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1.5">
                        Custom Specifications / Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-sm font-sans resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-red hover:bg-brand-deepRed disabled:bg-brand-red/50 text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase py-4 rounded-xl shadow-lg shadow-brand-red/20 transition-all duration-200"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Send Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
