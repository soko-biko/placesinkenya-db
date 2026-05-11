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
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">What's Hot</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy leading-tight">Trending Now in the Collective</h2>
          </div>
          <button 
            onClick={onViewAll}
            className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 hover:text-safari transition-colors"
          >
            Explore All <div className="w-10 h-10 rounded-full border border-navy/5 flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-all"><ArrowRight size={16} /></div>
          </button>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 snap-x no-scrollbar">
          {places.slice(0, 6).map((place, i) => (
            <motion.div 
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[300px] md:min-w-0 snap-center"
            >
              <PlaceCard place={place} onClick={onPlaceClick} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
