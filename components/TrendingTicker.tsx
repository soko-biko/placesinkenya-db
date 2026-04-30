
import React from 'react';
import { Place } from '../types';
import { MapPin } from 'lucide-react';

interface TrendingTickerProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({ places, onPlaceClick }) => {
  // Triple the items for a smooth loop
  const tickerItems = [...places, ...places, ...places];

  return (
    <div className="bg-navy py-12 overflow-hidden border-y border-white/5 relative">
      <div className="max-w-[1200px] mx-auto px-4 mb-10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-safari rounded-full"></span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Where the action is at</span>
        </div>
      </div>

      <div className="flex gap-10 animate-marquee whitespace-nowrap mb-16">
        {tickerItems.map((place, i) => (
          <div 
            key={`${place.id}-${i}`}
            onClick={() => onPlaceClick(place)}
            className="flex-shrink-0 w-[300px] md:w-[400px] group cursor-pointer"
          >
            <div className="h-[200px] md:h-[280px] w-full rounded-2xl overflow-hidden mb-6 relative shadow-2xl border border-white/10">
              <img 
                src={place.imageUrl} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={place.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-safari text-white text-[9px] font-black px-3 py-1.5 rounded-lg border border-white/20 shadow-xl uppercase tracking-widest">
                Trending
              </div>
            </div>
            <div className="space-y-2 px-2">
              <h4 className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-safari transition-colors truncate">{place.name}</h4>
              <div className="flex items-center gap-2 text-[11px] text-white/40 font-bold uppercase tracking-widest">
                <MapPin size={12} className="text-safari" />
                {place.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">Curating the heartbeat of <span className="text-safari">Kenya</span></h3>
            <p className="text-white/40 text-base leading-relaxed">
              From the bustling streets of Nairobi to the serene shores of the Coast, we verify every destination. PlacesInKenya is the definitive collective for modern explorers seeking the authentic, the luxury, and the hidden.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '2.5k+', label: 'Places' },
              { val: '120+', label: 'Events' },
              { val: '500+', label: 'Guides' }
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                <div className="text-xl font-bold text-safari">{stat.val}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
