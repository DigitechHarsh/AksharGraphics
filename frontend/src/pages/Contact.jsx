import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';
import axios from 'axios';
import SEO from '../components/SEO';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'General Inquiry',
    message: ''
  });

  const [servicesList, setServicesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch services categories for the select drop-down
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        if (res.data.length > 0) {
          // Extract names
          setServicesList(res.data.map(s => s.name));
        } else {
          setServicesList([
            'Logo Design & Branding',
            'Business Cards & Stationery',
            'Flyers & Banners Printing',
            'Wedding Invitation Cards',
            'Corporate Booklets & Bills',
            'Educational Stationery'
          ]);
        }
      } catch (err) {
        setServicesList([
          'Logo Design & Branding',
          'Business Cards & Stationery',
          'Flyers & Banners Printing',
          'Wedding Invitation Cards',
          'Corporate Booklets & Bills',
          'Educational Stationery'
        ]);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const { name, phone, email, service, message } = formData;

    if (!name || !phone || !email || !service || !message) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/inquiries', formData);
      if (res.data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'General Inquiry',
          message: ''
        });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit inquiry. Please check your connections.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Akshar Graphics in Surat. Request a free quote for wedding cards, branding design, business directories, and school stationery. Call 98981 91220."
      />

      {/* Hero Header */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-brand-charcoal text-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/contact_banner.png"
            alt="Contact Banner Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-brand-charcoal/80 mix-blend-multiply" />
        </div>
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-4 py-1.5 rounded-full border border-brand-red/20">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-white">
            Let's Start Your Printing Project
          </h1>
          <p className="text-brand-grey/80 font-sans text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about custom wedding invitations, bulk billing books, or high-res vector logo designs? Reach out to Chandreshbhai for assistance.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="py-10 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Contact Information (4 cols) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="space-y-3">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
              Information
            </span>
            <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">
              Akshar Graphics Office
            </h2>
            <p className="text-sm text-brand-charcoal/70 leading-relaxed font-sans">
              Visit our administrative studio in Nanpura, Surat, or reach out to us via telephone or email for remote estimates.
            </p>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-red/5 text-brand-red flex items-center justify-center shrink-0">
                <HiLocationMarker size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-poppins font-bold text-brand-charcoal text-sm uppercase tracking-wider">Address</h4>
                <p className="text-sm text-brand-charcoal/70 font-sans leading-relaxed">
                  11, Sahvas Apt., Chowki Sheri Naka,<br />
                  Timaliyawad Main Road, Nanpura,<br />
                  Surat - 395001, Gujarat, India
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-red/5 text-brand-red flex items-center justify-center shrink-0">
                <HiPhone size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-poppins font-bold text-brand-charcoal text-sm uppercase tracking-wider">Phone</h4>
                <a href="tel:9898191220" className="block text-sm text-brand-charcoal/70 hover:text-brand-red font-sans transition-colors">
                  +91 98981 91220
                </a>
                <p className="text-[10px] text-brand-charcoal/50 font-poppins font-semibold uppercase tracking-wider">Mon-Sat, 10am - 8pm</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-red/5 text-brand-red flex items-center justify-center shrink-0">
                <HiMail size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-poppins font-bold text-brand-charcoal text-sm uppercase tracking-wider">Email</h4>
                <a href="mailto:akshargraphics15@gmail.com" className="block text-sm text-brand-charcoal/70 hover:text-brand-red font-sans transition-colors">
                  akshargraphics15@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-brand-red/5 shadow-xl shadow-brand-charcoal/5 text-left relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <HiCheckCircle size={44} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-poppins font-extrabold text-2xl text-brand-charcoal">Thank You!</h3>
                  <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans max-w-sm mx-auto">
                    Your request was recorded in our client registry. Chandreshbhai Lainingwala will contact you shortly to review your files.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-8 py-3 rounded-full shadow-lg shadow-brand-red/20"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
                    Quick Quote
                  </span>
                  <h3 className="font-poppins font-extrabold text-2xl text-brand-charcoal">
                    Send An Inquiry Message
                  </h3>
                </div>

                {errorMessage && (
                  <div className="bg-brand-red/10 border-l-4 border-brand-red text-brand-red p-3 rounded text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey/50 focus:outline-none focus:border-brand-red focus:bg-white text-sm font-sans"
                      placeholder="e.g. Chandresh Patel"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey/50 focus:outline-none focus:border-brand-red focus:bg-white text-sm font-sans"
                      placeholder="e.g. 98981 91220"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey/50 focus:outline-none focus:border-brand-red focus:bg-white text-sm font-sans"
                      placeholder="name@email.com"
                      required
                    />
                  </div>

                  {/* Service Required */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70">
                      Service Required *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey/50 focus:outline-none focus:border-brand-red focus:bg-white text-sm font-sans"
                      required
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      {servicesList.map((svcName, idx) => (
                        <option key={idx} value={svcName}>{svcName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70">
                    Message Details *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey/50 focus:outline-none focus:border-brand-red focus:bg-white text-sm font-sans resize-none"
                    placeholder="Describe your design concepts, layout sizes, copy quantity, or paper stock preferences..."
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
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </section>

      {/* Styled Google Maps Section */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-brand-red/10 h-[300px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.108253163351!2d72.8122394!3d21.1878434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dec92cfb377%3A0xc07cfb95f1345f6c!2sNanpura%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1719234857211!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Akshar Graphics Location"
          ></iframe>
        </div>
      </section>
    </>
  );
}
