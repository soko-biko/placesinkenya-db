import React from 'react';
import { MapPin } from 'lucide-react';

interface ExploreByCityProps {
  onCityClick: (city: string) => void;
}

export const ExploreByCity: React.FC<ExploreByCityProps> = ({ onCityClick }) => {
  const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Diani', 'Malindi', 'Nanyuki', 'Eldoret', 'Lamu', 'Naivasha', 'Watamu', 'Tsavo'];
  const tickerCities = [...cities, ...cities, ...cities];

  return (
    <section className="py-20 border-t border-navy/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 mb-10 text-center">
        <div className="space-y-1">
          <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Regional Guides</span>
          <h2 className="text-3xl font-serif font-bold text-navy">Explore Kenya City by City</h2>
        </div>
      </div>
      
      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {tickerCities.map((city, i) => (
          <button
            key={`${city}-${i}`}
            onClick={() => onCityClick(city)}
            className="shrink-0 flex items-center gap-3 bg-navy text-white px-10 h-16 rounded-2xl font-bold text-sm hover:bg-safari transition-all group shadow-md"
          >
            <MapPin size={18} className="text-safari group-hover:text-white transition-colors" />
            <span className="uppercase tracking-widest">{city}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
