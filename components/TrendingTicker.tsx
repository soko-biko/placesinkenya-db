
import React from 'react';
import { motion } from 'motion/react';
import { Place } from '../types';
import { MapPin, Star } from 'lucide-react';

interface TrendingTickerProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({ places, onPlaceClick }) => {
  return (
    <div className="bg-navy py-12 overflow-hidden border-y border-white/5 relative">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <span className="w-2 h-2 bg-safari rounded-full"></span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Happening Now in Kenya</span>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-6 gap-6 scrollbar-hide pb-4 -mx-1 px-1">
          {places.map((place) => (
            <div 
              key={place.id}
              onClick={() => onPlaceClick(place)}
              className="flex-shrink-0 w-[140px] md:w-full group cursor-pointer"
            >
              <div className="h-[80px] w-full rounded-2xl overflow-hidden mb-3 relative shadow-xl border border-white/10">
                <img 
                  src={place.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={place.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-[13px] tracking-tight group-hover:text-safari transition-colors truncate">{place.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-white/30 font-medium truncate uppercase tracking-wider">
                  <MapPin size={8} className="text-safari" />
                  {place.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
