import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiX as CloseIcon, HiArrowRight } from 'react-icons/hi';
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

export default function Services() {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null); // Detailed service popup
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/services`);
        if (res.data.length > 0) {
          setServices(res.data);
        } else {
          setServices(getDefaultServices());
        }
      } catch (err) {
        setServices(getDefaultServices());
      }
    };
    fetchServices();
  }, []);

  const getDefaultServices = () => [
    {
      id: 1,
      category: "Graphic Design",
      name: "Graphic & Branding Design Studio",
      description: "Establish a memorable identity with professional artwork designs. From custom logos to letterheads and social assets, our design team builds trust through visual aesthetics.",
      benefits: ["Professional custom logo concepts", "Vector source files and high-res outputs", "Complete matching brand guidelines", "Revisions to match your vision"],
      image_url: "/assets/service_logo.jpg"
    },
    {
      id: 2,
      category: "Printing Solutions",
      name: "Commercial Printing Solutions",
      description: "Crisp colors and high-grade finishes for all marketing materials. Let us print your flyers, marketing pamphlets, brochures, posters, banners, and standees.",
      benefits: ["High-definition offset and digital printing", "Wide choice of premium papers & cardstocks", "Fast turnaround and delivery", "Bulk volume price adjustments"],
      image_url: "/assets/service_printing.jpg"
    },
    {
      id: 3,
      category: "Wedding Printing",
      name: "Premium Wedding Cards & Invitations",
      description: "Celebrate your love story with luxury invitations. Handcrafted laser-cut layers, metallic gold foil stamping, and customized envelopes designed to wow your guests.",
      benefits: ["Metallic foil, embossing & laser-cut textures", "Premium textured cardstock options", "Personalized coordination & template design", "Digital matched e-cards provided"],
      image_url: "/assets/service_wedding.jpg"
    },
    {
      id: 4,
      category: "Corporate Printing",
      name: "Corporate Office Stationary",
      description: "Streamline your corporate administration with bespoke business printouts. We specialize in custom business cards, invoices, bills, challan books, envelopes, and records.",
      benefits: ["Serialized carbonless copies (NCR)", "Durable stitch and glue binding", "Tailored grid layouts for your metrics", "Volume package pricing options"],
      image_url: "/assets/portfolio_branding.jpg"
    },
    {
      id: 5,
      category: "Educational Printing",
      name: "Institutional & School Stationary",
      description: "High-volume print packages for academic organizations. Custom registers, diary notebooks, calendars, supplementary books, progress sheets, and identity cards.",
      benefits: ["Heavy-duty binding structures", "Clear layouts & durable covers", "Timely delivery prior to academic terms", "Eco-friendly paper options"],
      image_url: "/assets/portfolio_brochure.jpg"
    },
    {
      id: 6,
      category: "Healthcare Printing",
      name: "Hospital & Medical Stationary",
      description: "Accurate, clean documents for healthcare networks. Medical record files, prescription pads, patient files, logs, registration forms, and clinical reports.",
      benefits: ["Hygienic, premium matte/gloss finishes", "Pre-designed medical layout templates", "Strict data formatting layouts", "Fast emergency print reprints"],
      image_url: "/assets/client1.jpg"
    }
  ];

  const handleOpenDetails = (svc) => {
    setActiveService(svc);
    setIsInquirySubmitted(false);
    setFormError('');
    setFormData({ name: '', phone: '', email: '', message: `Hi, I would like to inquire about your "${svc.name}" services.` });
  };

  const handleCloseDetails = () => {
    setActiveService(null);
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
        service: activeService ? activeService.name : '',
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

  return (
    <>
      <SEO 
        title="Services" 
        description="Browse Akshar Graphics printing and branding capabilities. Graphic Design, Flyers, Banners, Premium Wedding Cards, Bill Books, School and Hospital Stationery."
      />

      {/* Header Banner */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-brand-charcoal text-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/services_banner.png"
            alt="Services Banner Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-brand-charcoal/80 mix-blend-multiply" />
          <div className="absolute inset-0 rainbow-light-leak pointer-events-none opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-4 py-1.5 rounded-full border border-brand-red/20">
            Capabilities
          </span>
          <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-white">
            Our Professional <span className="cmyk-rainbow-text">Printing Services</span>
          </h1>
          <p className="text-brand-grey/80 font-sans text-sm max-w-xl mx-auto leading-relaxed">
            From creative conceptual graphics to bulk industrial printing installations, Akshar Graphics ensures premium paper selection and precision ink styling.
          </p>
        </div>
      </section>

      {/* Services Grid Layout */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <TiltCard key={svc.id} className="h-full cursor-pointer rainbow-glow-wrapper rounded-[2rem]">
              <div 
                onClick={() => handleOpenDetails(svc)}
                className="bg-white rounded-[1.9rem] overflow-hidden shadow-md flex flex-col h-full group transition-all duration-300 border border-brand-red/5 hover:border-brand-red/20 text-left"
              >
                <div className="h-[240px] overflow-hidden relative bg-brand-charcoal">
                  <img
                    src={svc.image_url.startsWith('/') ? `${API_STATIC_BASE}${svc.image_url}` : svc.image_url}
                    alt={svc.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=600&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-charcoal/5 group-hover:bg-brand-charcoal/0 transition-colors" />
                  <span className="absolute top-6 left-6 bg-brand-red text-brand-cream font-poppins font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md z-10">
                    {svc.category}
                  </span>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-poppins font-black text-xl text-brand-charcoal leading-snug group-hover:text-brand-red transition-colors duration-200">
                      {svc.name}
                    </h3>
                    <p className="text-sm text-brand-charcoal/65 leading-relaxed font-sans line-clamp-3">
                      {svc.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-brand-red font-poppins font-bold text-xs uppercase tracking-wider pt-2">
                    <span>Learn More & Inquire</span>
                    <HiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Service Details & Inquiry Modal */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetails}
              className="absolute inset-0 bg-brand-charcoal"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-brand-cream border border-brand-red/10 max-w-4xl w-full rounded-3xl p-6 md:p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseDetails}
                className="absolute top-6 right-6 text-brand-charcoal hover:text-brand-red transition-colors duration-200 z-20"
              >
                <CloseIcon size={24} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                {/* Left: Service Details */}
                <div className="space-y-6">
                  <div className="h-[220px] rounded-2xl overflow-hidden relative bg-brand-charcoal">
                    <img
                      src={activeService.image_url.startsWith('/') ? `${API_STATIC_BASE}${activeService.image_url}` : activeService.image_url}
                      alt={activeService.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=600&auto=format&fit=crop";
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-brand-red text-brand-cream font-poppins font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                      {activeService.category}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-poppins font-black text-2xl text-brand-charcoal leading-snug">
                      {activeService.name}
                    </h3>
                    <p className="text-sm text-brand-charcoal/70 leading-relaxed font-sans">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Highlights/Benefits */}
                  {(() => {
                    let parsedBenefits = [];
                    try {
                      parsedBenefits = typeof activeService.benefits === 'string' ? JSON.parse(activeService.benefits) : activeService.benefits;
                      if (!Array.isArray(parsedBenefits)) parsedBenefits = [];
                    } catch (e) {
                      parsedBenefits = activeService.benefits || [];
                    }

                    return parsedBenefits.length > 0 ? (
                      <div className="space-y-3 pt-2">
                        <h4 className="font-poppins font-semibold text-xs text-brand-charcoal uppercase tracking-widest">
                          Key Highlights & Benefits
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {parsedBenefits.map((benefit, bIdx) => (
                            <li key={bIdx} className="flex items-center space-x-2 text-xs text-brand-charcoal/80 font-medium">
                              <HiCheckCircle className="text-brand-red shrink-0" size={16} />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Right: Quick Inquiry Form */}
                <div className="border-t lg:border-t-0 lg:border-l border-brand-charcoal/10 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div>
                      <span className="text-brand-red font-poppins font-bold text-[10px] uppercase tracking-widest">
                        Quick Inquiry
                      </span>
                      <h4 className="font-poppins font-extrabold text-xl text-brand-charcoal">
                        Inquire About This Service
                      </h4>
                    </div>

                    {isInquirySubmitted ? (
                      <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                          <HiCheckCircle size={36} />
                        </div>
                        <h4 className="font-poppins font-bold text-lg text-brand-charcoal">Inquiry Submitted!</h4>
                        <p className="text-xs text-brand-charcoal/65 leading-relaxed font-sans max-w-xs mx-auto">
                          Thank you for contacting Akshar Graphics. Chandreshbhai Lainingwala or our coordinator will call you back shortly.
                        </p>
                        <button
                          onClick={handleCloseDetails}
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
                            <label className="block text-[10px] font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-xs font-sans"
                              placeholder="Your Name"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-xs font-sans"
                              placeholder="Phone No."
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-xs font-sans"
                            placeholder="yourname@email.com"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1">
                            Message
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/10 bg-white focus:outline-none focus:border-brand-red text-xs font-sans resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-brand-red hover:bg-brand-deepRed disabled:bg-brand-red/50 text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase py-3 rounded-xl shadow-lg shadow-brand-red/20 transition-all duration-200"
                        >
                          {isSubmitting ? 'Sending Request...' : 'Send Inquiry'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
