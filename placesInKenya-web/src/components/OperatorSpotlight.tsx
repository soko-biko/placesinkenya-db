import React from 'react';
import { TourOperator } from '../types';
import { Star, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface OperatorSpotlightProps {
  operators: TourOperator[];
}

export const OperatorSpotlight: React.FC<OperatorSpotlightProps> = ({ operators }) => {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 md:mb-14">
          <div className="space-y-3">
            <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">Verified Professionals</span>
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-serif font-bold text-navy tracking-tight leading-tight">Elite Tour Operators</h2>
          </div>
        </div>

        {/* Horizontal scroll on mobile, responsive grid on desktop */}
        <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 snap-x no-scrollbar">
          {operators.slice(0, 6).map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[270px] sm:min-w-0 snap-center w-full"
            >
              <div className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col h-full relative border border-navy/5">
                {/* Image Section - aspect-[4/3] matching PlaceCard */}
                <div className="relative aspect-[4/3] overflow-hidden bg-navy/5 shrink-0">
                  <img 
                    src={op.imageUrl || `https://images.unsplash.com/photo-1544005313-94ddf0286df2`} 
                    alt={op.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent"></div>
                  
                  {/* Verified Badge */}
                  {op.isVerified && (
                    <div className="absolute top-2.5 right-2.5">
                      <div className="bg-[#E8621A] text-white px-2 h-6 rounded-full shadow flex items-center justify-center gap-1 border border-white/10 backdrop-blur-sm">
                        <ShieldCheck size={10} className="shrink-0 text-white" />
                        <span className="text-[7px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section - matching PlaceCard sizes */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <div className="space-y-1.5 flex-1">
                    <div className="space-y-0.5">
                      <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-navy tracking-tight line-clamp-1 leading-tight group-hover:text-[#E8621A] transition-colors">
                        {op.name}
                      </h3>
                      {op.location && (
                        <div className="flex items-center gap-1 text-navy/40">
                          <MapPin size={9} className="text-[#E8621A]" />
                          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] truncate">{op.location}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-navy/60 text-[11.5px] sm:text-xs leading-normal line-clamp-2 font-sans">
                      {op.bio}
                    </p>

                    <div className="flex items-center gap-0.5 text-[#E8621A] pt-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={10} fill={idx < Math.floor(op.rating || 5) ? "currentColor" : "none"} className={idx < Math.floor(op.rating || 5) ? "" : "text-navy/10"} />
                      ))}
                      <span className="text-[8.5px] font-bold text-navy/30 ml-1.5 uppercase tracking-[0.05em] leading-none">({(op.rating || 5).toFixed(1)})</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {op.specialties?.slice(0, 2).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-navy/5 text-navy/65 rounded text-[8px] font-bold uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-navy/5">
                    <div className="flex flex-col">
                      <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">From</span>
                      <span className="text-navy text-sm font-bold font-sans tracking-tight">Ksh {(op.basePrice || 5000).toLocaleString()}</span>
                    </div>
                    <button className="h-7.5 px-2.5 sm:px-3 bg-navy text-white rounded-full flex items-center justify-center gap-1 transition-all hover:bg-[#E8621A] shadow cursor-pointer text-[7.5px] sm:text-[8px] font-black uppercase tracking-normal sm:tracking-wider whitespace-nowrap shrink-0">
                      <span>Book Tour</span>
                      <ArrowRight size={9} className="shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
