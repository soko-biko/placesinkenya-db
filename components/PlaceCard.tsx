
import React from 'react';
import { Star, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  onClick: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
  return (
    <div 
      className="group bg-navy rounded-[2rem] overflow-hidden border border-white/5 hover:border-safari/50 transition-all cursor-pointer hover:-translate-y-2 shadow-2xl shadow-navy/20"
      onClick={() => onClick(place)}
    >
      <div className="h-48 sm:h-56 lg:h-64 overflow-hidden relative">
        <img 
          src={place.imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-navy/80 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-safari border border-safari/30">
            {place.category?.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy p-4">
          <div className="flex items-center gap-1 text-safari">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{place.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-5 space-y-3 bg-navy">
        <h3 className="text-lg sm:text-xl font-bold font-serif text-white group-hover:text-safari transition-colors line-clamp-1">{place.name}</h3>
        <div className="flex items-center gap-1 text-white/60 text-xs sm:text-sm">
          <MapPin size={12} className="text-safari" />
          <span>{place.location}</span>
        </div>
        <p className="text-white/60 text-xs sm:text-sm line-clamp-2 leading-relaxed font-light">
          {place.description}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {place.tags?.map(tag => (
            <span key={tag} className="text-[9px] sm:text-[10px] bg-white/10 px-2 py-1 rounded-lg text-white/40 uppercase tracking-widest font-black">
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
          <span className="text-safari font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
