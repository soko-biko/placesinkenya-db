import React from 'react';
import { TourOperator } from '../types';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OperatorSpotlightProps {
  operators: TourOperator[];
}

export const OperatorSpotlight: React.FC<OperatorSpotlightProps> = ({ operators }) => {
  return (
    <section className="py-24 md:py-32 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-safari/5 -skew-x-12 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="space-y-4 mb-20 text-center max-w-3xl mx-auto">
          <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">Verified Professionals</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy leading-tight">Elite Tour Operators</h2>
          <p className="text-navy/50 text-lg font-light leading-relaxed">Book directly with the most experienced and ethical guides in the region.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {operators.slice(0, 2).map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-[60px] p-10 md:p-16 flex flex-col md:flex-row gap-12 border border-navy/5 shadow-lux group hover:shadow-2xl transition-all duration-700"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shrink-0 border-4 border-beige shadow-inner relative group-hover:rotate-6 transition-transform duration-500">
                <img 
                   src={i === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"} 
                   alt={op.name} 
                   className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-safari/10 mix-blend-overlay"></div>
              </div>
              
              <div className="space-y-8 flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-safari" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-safari">Verified Experience Provider</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-navy">{op.name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < op.rating ? "fill-safari text-safari" : "text-navy/10"} />
                    ))}
                    <span className="text-[11px] font-bold text-navy/40 ml-2 uppercase tracking-widest">{op.rating}.0 • 45+ Expeditions</span>
                  </div>
                  <p className="text-navy/50 text-base font-light italic leading-relaxed">"{op.bio}"</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {op.specialties?.slice(0, 3).map(s => (
                    <span key={s} className="px-5 h-8 bg-cream rounded-full flex items-center text-[10px] font-bold uppercase tracking-[0.1em] text-navy/60">{s}</span>
                  ))}
                </div>

                <button className="h-16 bg-navy hover:bg-safari text-white px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-4 group/btn shadow-xl">
                  Book a Safari <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
