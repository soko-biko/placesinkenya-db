import React from 'react';
import { MapPin } from 'lucide-react';

interface ExploreByCityProps {
  onCityClick: (city: string) => void;
}

export const ExploreByCity: React.FC<ExploreByCityProps> = ({ onCityClick }) => {
  const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Diani', 'Malindi', 'Nanyuki', 'Eldoret'];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-20 border-t border-navy/5">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Regional Guides</span>
          <h2 className="text-3xl font-serif font-bold text-navy">Explore Kenya City by City</h2>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onCityClick(city)}
            className="shrink-0 flex items-center gap-3 bg-navy text-white px-8 h-14 rounded-2xl font-bold text-sm hover:bg-safari transition-all group shadow-lg"
          >
            <MapPin size={18} className="text-safari group-hover:text-white transition-colors" />
            <span>{city}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
