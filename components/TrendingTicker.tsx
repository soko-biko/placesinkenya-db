
import React from 'react';
import { motion } from 'motion/react';
import { Place } from '../types';
import { MapPin, Star } from 'lucide-react';

interface TrendingTickerProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({ places, onPlaceClick }) => {
  // Triple the places to ensure smooth infinite loop
  const displayPlaces = [...places, ...places, ...places];

  return (
    <div className="bg-navy py-8 overflow-hidden border-y border-white/5 relative">
      {/* Decorative Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy to-transparent z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-safari rounded-full animate-pulse shadow-lg shadow-safari/50"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Trending Now in Kenya</span>
        </div>
      </div>

      <motion.div 
        className="flex gap-6 whitespace-nowrap"
        animate={{
          x: ["-50%", "0%"], 
        }}
        transition={{
          duration: places.length * 10, 
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {displayPlaces.map((place, idx) => (
          <div 
            key={`${place.id}-${idx}`}
            onClick={() => onPlaceClick(place)}
            className="inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 pr-8 rounded-2xl border border-white/5 cursor-pointer transition-all hover:border-safari/30 group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <img src={place.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-white font-bold text-sm tracking-tight">{place.name}</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <MapPin size={10} className="text-safari" />
                  <span>{place.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-safari font-black">
                  <Star size={10} fill="currentColor" />
                  <span>{place.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
