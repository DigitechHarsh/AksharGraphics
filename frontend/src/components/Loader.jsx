import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FCFAF6]"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Brand Logo Mark Wrapper with Heartbeat & Rainbow Border */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1.02, 1.15, 1],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.1
          }}
          className="w-28 h-28 mb-6 p-1 rounded-3xl bg-gradient-to-tr from-[#D11414] via-[#EAB308] via-[#10B981] to-[#3B82F6] flex items-center justify-center shadow-xl shadow-brand-red/25"
        >
          <div className="w-full h-full flex items-center justify-center rounded-[1.3rem] bg-white p-3.5">
            <img
              src="/assets/logo.png"
              alt="Akshar Graphics Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Company Name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-poppins font-extrabold text-2xl tracking-wider text-brand-charcoal text-center"
        >
          AKSHAR <span className="text-brand-red">GRAPHICS</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xs text-brand-charcoal/60 mt-1 uppercase tracking-widest font-medium font-poppins"
        >
          20+ Years of Printing Excellence
        </motion.p>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-brand-charcoal/10 rounded-full mt-6 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-brand-red via-yellow-500 via-emerald-500 to-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );
}
