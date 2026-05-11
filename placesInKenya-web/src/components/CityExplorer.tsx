import React from 'react';
import { motion } from 'motion/react';

interface CityExplorerProps {
  onCityClick: (city: string) => void;
}

export const CityExplorer: React.FC<CityExplorerProps> = ({ onCityClick }) => {
  const cities = [
    { name: 'Nairobi', image: 'https://images.unsplash.com/photo-1542152862-239634e32049' },
    { name: 'Mombasa', image: 'https://images.unsplash.com/photo-1624320299532-680f4f9f7ba3' },
    { name: 'Kisumu', image: 'https://images.unsplash.com/photo-1627845773177-1111666992ee' },
    { name: 'Eldoret', image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3' },
    { name: 'Nakuru', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
    { name: 'Diani', image: 'https://images.unsplash.com/photo-1589197331516-4d845f3eb618' },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-4 mb-16 text-center">
          <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">Regional Hubs</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy">The Geographic Collective</h2>
        </div>

        {/* Mobile: Horizontal scroll pills */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
          {cities.map((city, i) => (
            <button
              key={i}
              onClick={() => onCityClick(city.name)}
              className="shrink-0 px-8 h-12 bg-navy/5 rounded-2xl text-navy font-black uppercase tracking-[0.2em] text-[10px] snap-center whitespace-nowrap"
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Desktop: Grid with overlays */}
        <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-4 h-[700px]">
          {cities.map((city, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              onClick={() => onCityClick(city.name)}
              className={`relative overflow-hidden group cursor-pointer rounded-[40px] shadow-lux ${
                i === 0 ? 'col-span-8 row-span-1' : 
                i === 1 ? 'col-span-4 row-span-1' : 
                i === 2 ? 'col-span-4 row-span-1' :
                i === 3 ? 'col-span-4 row-span-1' :
                i === 4 ? 'col-span-4 row-span-1' : 'hidden md:block col-span-3'
              }`}
            >
              <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute inset-0 flex items-end p-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-safari translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Explore Hub</span>
                  <h3 className="text-3xl font-serif font-bold text-white leading-tight">{city.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
