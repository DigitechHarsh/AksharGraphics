import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiStar, HiUsers, HiOfficeBuilding } from 'react-icons/hi';
import SEO from '../components/SEO';

function TiltCard({ children, className = '' }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - (width / 2);
    const mouseY = e.clientY - rect.top - (height / 2);
    
    // limit to 8 degrees for elegant effect
    const rX = (mouseY / (height / 2)) * 8;
    const rY = -(mouseX / (width / 2)) * 8;

    setTilt({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
}

export default function About() {
  const timelineData = [
    { year: '2000+', title: 'Business Started', desc: 'Chandresh Lainingwala founded Akshar Graphics, starting with a single offset machine in Surat.', icon: <HiOfficeBuilding size={20} /> },
    { year: '2010+', title: 'Expansion & Machinery Upgrades', desc: 'Acquired state-of-the-art multi-color printing presses and expanded customer services into complete branding.', icon: <HiUsers size={20} /> },
    { year: '2020+', title: 'Digital Transformation', desc: 'Launched digital printing solutions, high-grade foil stamping, and immediate online inquiry systems.', icon: <HiStar size={20} /> },
    { year: 'Today', title: 'Leading Printing & Graphics Firm', desc: 'Serving thousands of satisfied clients in Gujarat, Maharashtra, and across India with premium solutions.', icon: <HiUser size={20} /> }
  ];

  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn about the journey of Akshar Graphics. Established over 20 years ago by Chandresh Lainingwala, we are Surat's trusted partner for premium offset printing and custom branding."
      />

      {/* Hero Header */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-brand-charcoal text-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/akshar.jpg"
            alt="About us Banner Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-brand-charcoal/85 mix-blend-multiply" />
        </div>
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-4 py-1.5 rounded-full border border-brand-red/20">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-white">
            Over 2 Decades of Printing Excellence
          </h1>
          <p className="text-brand-grey/80 font-sans text-sm max-w-xl mx-auto leading-relaxed">
            Discover the dedication, creativity, and customer-first values that fueled our growth from a local workshop into Surat's premium printing house.
          </p>
        </div>
      </section>

      {/* Biography & Story Section */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          
          {/* Left Side: Owner image with premium hover zoom/glow/color trigger */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <TiltCard className="relative group max-w-sm w-full rainbow-glow-wrapper rounded-2xl">
              {/* Image Frame */}
              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white aspect-square relative bg-brand-charcoal">
                <img
                  src="/assets/owner.png"
                  alt="Chandresh Lainingwala"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"; // Unsplash male portrait fallback
                  }}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
                />
                
                {/* Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-charcoal/80 backdrop-blur-md px-5 py-4 rounded-xl text-white border border-white/10">
                  <h3 className="font-poppins font-bold text-lg leading-tight">Chandresh Lainingwala</h3>
                  <p className="text-xs text-brand-red font-poppins font-semibold uppercase tracking-widest mt-0.5">Founder & Owner</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Side: Narrative Story */}
          <div className="w-full lg:w-7/12 space-y-6 text-left">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
              Established 2000
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-brand-charcoal leading-tight">
              More Than 20 Years of <br />
              <span className="text-brand-red">Printing Excellence</span> in Surat
            </h2>
            
            <div className="space-y-4 font-sans text-sm text-brand-charcoal/85 leading-relaxed">
              <p>
                Akshar Graphics was established in Surat, Gujarat over two decades ago with a clear mandate: to deliver superior graphics and printing solutions that help local companies present themselves with confidence.
              </p>
              <p>
                Under the strategic management of Chandresh Lainingwala, we expanded from standard commercial flyers into premium textured wedding cards, school calendars, custom registers, and professional medical forms. Our long experience ensures that we select the exact paper weight, ink grade, and binding structure that fits your project.
              </p>
              <p className="font-semibold text-brand-charcoal">
                Today, we remain committed to our founding values: premium materials, fast shipment schedules, cost-effective pricing packages, and attentive customer service.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-red/10">
              <div className="space-y-1">
                <span className="block text-3xl font-poppins font-extrabold text-brand-red">20+</span>
                <span className="block text-xs font-poppins font-bold text-brand-charcoal/60 uppercase tracking-wider">Years Experience</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl font-poppins font-extrabold text-brand-red">5000+</span>
                <span className="block text-xs font-poppins font-bold text-brand-charcoal/60 uppercase tracking-wider">Happy Clients</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl font-poppins font-extrabold text-brand-red">10M+</span>
                <span className="block text-xs font-poppins font-bold text-brand-charcoal/60 uppercase tracking-wider">Prints Shipped</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="bg-brand-grey py-10 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <span className="text-brand-red font-poppins font-bold text-xs uppercase tracking-widest">
              Milestones
            </span>
            <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">
              Our Journey Over Time
            </h2>
            <p className="text-xs text-brand-charcoal/50 leading-relaxed font-sans max-w-sm mx-auto">
              How we adapted to technology changes while preserving our commitment to quality.
            </p>
          </div>

          {/* Timeline Nodes */}
          <div className="relative border-l-2 border-brand-red/20 space-y-8 pl-8 md:pl-12 text-left">
            {timelineData.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative"
              >
                {/* Year Badge Node */}
                <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 md:w-11 md:h-11 rounded-full bg-brand-cream border-2 border-brand-red text-brand-red flex items-center justify-center shadow-lg shadow-brand-red/10 z-10">
                  {node.icon}
                </div>

                <div className="space-y-2">
                  <span className="inline-block bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-xs font-poppins font-extrabold">
                    {node.year}
                  </span>
                  <h3 className="font-poppins font-bold text-xl text-brand-charcoal">
                    {node.title}
                  </h3>
                  <p className="text-sm text-brand-charcoal/70 leading-relaxed font-sans max-w-2xl">
                    {node.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
