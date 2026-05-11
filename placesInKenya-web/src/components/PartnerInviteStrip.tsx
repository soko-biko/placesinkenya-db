import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PartnerInviteStripProps {
  onPartnerClick: () => void;
}

export const PartnerInviteStrip: React.FC<PartnerInviteStripProps> = ({ onPartnerClick }) => {
  return (
    <section className="bg-navy py-12 px-6 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center md:justify-start gap-4"
          >
            <div className="w-10 h-[1px] bg-safari"></div>
            <span className="text-safari font-black uppercase tracking-[0.4em] text-[10px]">Merchant Enrollment</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight"
          >
            Own a business in Kenya? <br className="hidden md:block" />
            <span className="text-white/40">Join our elite collective.</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            onClick={onPartnerClick}
            className="group relative h-16 md:h-20 bg-white text-navy px-12 md:px-16 rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] md:text-xs transition-all shadow-2xl active:scale-95 overflow-hidden flex items-center gap-6"
          >
            <div className="absolute inset-0 bg-safari translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Become a Partner</span>
            <ArrowRight size={20} className="relative z-10 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
