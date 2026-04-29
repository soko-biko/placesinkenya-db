
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
      className="group bg-navy rounded-[2rem] overflow-hidden border border-white/5 hover:border-safari/50 transition-all cursor-pointer hover:-translate-y-1 shadow-2xl shadow-navy/20 h-full flex flex-col"
      onClick={() => onClick(place)}
    >
      <div className="h-36 sm:h-40 overflow-hidden relative shrink-0">
        <img 
          src={place.imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-navy/80 backdrop-blur-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full text-safari border border-safari/30">
            {place.category === 'EATS_ENT' ? 'Eats & Ent' : place.category?.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy p-2">
          <div className="flex items-center gap-1 text-safari">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold">{place.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 space-y-1.5 bg-navy flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base font-bold font-serif text-white group-hover:text-safari transition-colors line-clamp-1">{place.name}</h3>
        <div className="flex items-center gap-1 text-white/50 text-[9px] sm:text-[10px]">
          <MapPin size={8} className="text-safari" />
          <span className="line-clamp-1">{place.location}</span>
        </div>
        <p className="text-white/50 text-[10px] sm:text-[11px] line-clamp-2 leading-tight font-light flex-1">
          {place.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 pt-1">
          {place.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-[7px] sm:text-[8px] bg-white/5 px-1.5 py-0.5 rounded-md text-white/30 uppercase tracking-widest font-black">
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-auto">
          <span className="text-safari font-black text-[9px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Explore <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </div>
  );
};
