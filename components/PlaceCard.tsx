
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
      className="group bg-navy/60 backdrop-blur-xl rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none overflow-hidden border border-white/5 hover:border-safari/50 transition-all cursor-pointer shadow-3xl shadow-navy/60 flex h-[340px] relative"
      onClick={() => onClick(place)}
    >
      {/* Content Section - Left */}
      <div className="flex-1 p-8 flex flex-col justify-between z-10 bg-gradient-to-r from-navy/40 to-transparent">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-safari/20 text-safari text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-safari/20">
                {place.category?.replace('_', ' ')}
              </span>
              {place.isTrending && (
                <span className="bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-red-500/20">
                  Best Choice
                </span>
              )}
            </div>
            <h3 className="text-2xl font-serif font-bold text-white group-hover:text-safari transition-colors leading-tight line-clamp-1">
              {place.name}
            </h3>
            <div className="flex items-center gap-4 text-white/40 text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={12} className="text-safari shrink-0" />
                <span className="font-medium tracking-wide uppercase italic truncate">{place.location}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock size={12} className="text-white/30" />
                <span className="font-bold tracking-widest uppercase">Full Day</span>
              </div>
            </div>
          </div>
          
          <p className="text-white/50 text-[13px] leading-relaxed line-clamp-2 font-light max-w-[90%]">
            {place.description}
          </p>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="bg-safari text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-safari/20">
                {place.rating}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Exceptional</span>
                  <ShieldCheck size={10} className="text-green-500" />
                </div>
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">350+ Reviews</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/5"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-glow shadow-green-500/50"></div>
                <span className="text-[9px] text-white/40 font-bold uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Experience From</span>
            <span className="text-white text-xl font-bold font-serif">Ksh {(place.price || 4500).toLocaleString()}</span>
          </div>
          <button className="bg-safari hover:bg-safari-light text-white w-12 h-12 rounded-2xl transition-all flex items-center justify-center shadow-xl shadow-safari/20 group/btn">
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Image Section - Right */}
      <div className="w-1/3 h-full relative overflow-hidden shrink-0 group-hover:w-[32%] transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-navy/10 to-transparent z-10"></div>
        <img 
          src={place.imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          {place.tags?.slice(0, 1).map(tag => (
            <span key={tag} className="bg-navy/60 backdrop-blur-md text-[8px] font-black text-white px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
