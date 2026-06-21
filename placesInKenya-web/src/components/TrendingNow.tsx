import React from 'react';
import { Place } from '../types';
import { PlaceCard } from './PlaceCard';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TrendingNowProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
  onViewAll: () => void;
}

export const TrendingNow: React.FC<TrendingNowProps> = ({ places, onPlaceClick, onViewAll }) => {
  return (
    <section className="py-12 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 md:mb-14">
          <div className="space-y-3">
            <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">What's Hot</span>
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-serif font-bold text-navy tracking-tight leading-tight">Trending Now</h2>
          </div>
          <button 
            onClick={onViewAll}
            className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 hover:text-safari transition-colors shrink-0"
          >
            Explore All <div className="w-10 h-10 rounded-full border border-navy/5 flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-all"><ArrowRight size={16} /></div>
          </button>
        </div>

        {/* Horizontal scroll on mobile, responsive grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 -mx-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 md:overflow-x-visible pb-6 md:pb-0">
          {places.slice(0, 6).map((place, i) => (
            <motion.div 
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="w-[85%] sm:w-[45%] md:w-auto shrink-0 snap-start"
            >
              <PlaceCard place={place} onClick={onPlaceClick} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
