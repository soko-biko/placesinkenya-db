
import React from 'react';
import { Star, MapPin, Tag, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  onClick: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-full relative"
      onClick={() => onClick(place)}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={place.imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
        
        {/* Chips on top of image gradient */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <span className="text-white text-xs font-bold flex items-center gap-1">
                <Star size={12} className="text-safari fill-safari" />
                {place.rating}
              </span>
              <span className="text-white/70 text-[11px] font-bold uppercase tracking-wider">{place.location}</span>
           </div>
           <div className="bg-safari text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-[0.1em] shadow-sm">
              Online
           </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
           <span className="bg-white/90 backdrop-blur shadow-sm text-navy text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
             {place.category?.replace('_', ' ')}
           </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-navy group-hover:text-safari transition-colors leading-tight line-clamp-1">
            {place.name}
          </h3>
          <p className="text-navy/60 text-sm leading-relaxed line-clamp-2 font-medium">
            {place.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-navy/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-navy/40 uppercase font-bold tracking-widest leading-none mb-1">From</span>
            <span className="text-navy text-lg font-bold font-sans">Ksh {(place.price || 4500).toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center transition-all group-hover:bg-safari shadow-lg">
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
