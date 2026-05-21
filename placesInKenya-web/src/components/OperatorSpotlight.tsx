import React from 'react';
import { TourOperator } from '../types';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OperatorSpotlightProps {
  operators: TourOperator[];
}

export const OperatorSpotlight: React.FC<OperatorSpotlightProps> = ({ operators }) => {
  return (
    <section className="py-12 sm:py-20 md:py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-safari/5 -skew-x-12 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="space-y-3 mb-10 md:mb-14 text-center max-w-3xl mx-auto">
          <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">Verified Professionals</span>
          <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-serif font-bold text-navy leading-tight">Elite Tour Operators</h2>
          <p className="text-navy/50 text-sm sm:text-base font-light leading-relaxed">Book directly with the most experienced and ethical guides in the region.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {operators.slice(0, 2).map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-6 md:gap-10 border border-navy/5 shadow-lux group hover:shadow-2xl transition-all duration-700"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-4 border-cream shadow-inner relative group-hover:rotate-6 transition-transform duration-500 mx-auto md:mx-0">
                <img 
                   src={i === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"} 
                   alt={op.name} 
                   className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-safari/10 mix-blend-overlay"></div>
              </div>
              
              <div className="space-y-5 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <ShieldCheck size={14} className="text-safari" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-safari">Verified Experience Provider</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy text-center md:text-left">{op.name}</h3>
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < op.rating ? "fill-safari text-safari" : "text-navy/10"} />
                    ))}
                    <span className="text-[10px] font-bold text-navy/40 ml-2 uppercase tracking-widest">{op.rating}.0 • 45+ Expeditions</span>
                  </div>
                  <p className="text-navy/50 text-[0.8125rem] sm:text-[0.875rem] font-light italic leading-relaxed text-center md:text-left">"{op.bio}"</p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                  {op.specialties?.slice(0, 3).map(s => (
                    <span key={s} className="px-3 h-6 bg-cream rounded-full flex items-center text-[9px] font-bold uppercase tracking-[0.1em] text-navy/60">{s}</span>
                  ))}
                </div>

                <div className="flex justify-center md:justify-start">
                  <button className="h-10 bg-navy hover:bg-safari text-white px-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-2 group/btn shadow-xl active:scale-95">
                    Book a Safari <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
