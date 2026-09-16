import React from 'react';
import { TourOperator } from '../types';
import { Star, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Container } from './Container';
import { Card } from './Card';

interface OperatorSpotlightProps {
  operators: TourOperator[];
}

export const OperatorSpotlight: React.FC<OperatorSpotlightProps> = ({ operators }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 md:mb-8">
          <div className="space-y-1">
            <span className="text-safari font-semibold uppercase tracking-wider text-xs">Verified Professionals</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy tracking-tight leading-tight">Elite Tour Operators</h2>
          </div>
        </div>

        {/* Horizontal scroll on mobile, responsive grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 -mx-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:mx-0 md:px-0 md:overflow-x-visible pb-6 md:pb-0">
          {operators.slice(0, 6).map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="w-[85%] sm:w-[45%] md:w-auto shrink-0 snap-start"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex flex-col h-full group cursor-pointer">
                {/* Event-like 16:9 Image Zone */}
                <div className="relative aspect-[16/9] overflow-hidden bg-navy/5 shrink-0">
                  <img 
                    src={op.imageUrl || `https://images.unsplash.com/photo-1544005313-94ddf0286df2`} 
                    alt={op.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent"></div>
                  
                  {/* Category and Verified Badges on image */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                    <span className="bg-navy/80 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/5 select-none">
                      {op.type === 'COMPANY' ? 'Fleet Operator' : op.title || 'Tour Guide'}
                    </span>
                  </div>

                  {op.isVerified && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="bg-navy/90 text-white border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck size={10} className="text-safari shrink-0" />
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section - matching Event Card sizes */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-xs text-navy/50 font-semibold uppercase tracking-wider">
                      {op.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={11} className="text-safari shrink-0" />
                          <span className="truncate">{op.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-0.5 text-safari shrink-0">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={10} fill={idx < Math.floor(op.rating || 5) ? "currentColor" : "none"} className={idx < Math.floor(op.rating || 5) ? "" : "text-navy/10"} />
                        ))}
                        <span className="text-navy/40 ml-1">({(op.rating || 5).toFixed(1)})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-navy tracking-tight line-clamp-1 leading-snug group-hover:text-safari transition-colors">
                      {op.name}
                    </h3>

                    <p className="text-navy/70 text-sm leading-relaxed line-clamp-2">
                      {op.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {op.specialties?.slice(0, 2).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-navy/5 text-navy/65 rounded text-[10px] font-semibold uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-navy/5 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">From</span>
                      <span className="text-navy text-xs font-bold font-sans tracking-tight">Ksh {(op.basePrice || 5000).toLocaleString()}</span>
                    </div>
                    <button className="h-7 px-3 bg-navy hover:bg-safari text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-all select-none cursor-pointer">
                      <span>Book Tour</span>
                      <ArrowRight size={8} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
