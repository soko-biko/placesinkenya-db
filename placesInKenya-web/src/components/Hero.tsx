
import React, { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Star, Search, Utensils, Tent, Building2, Ticket, Users } from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onSearch: (val: string, category?: string) => void;
  trendingPlaces: Place[];
}

export const Hero: React.FC<HeroProps> = ({ onSearch, trendingPlaces }) => {
  const [val, setVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(val);
  };

  const categories = [
    { label: 'Restaurants', icon: <Utensils size={14} />, id: PlaceCategory.RESTAURANT },
    { label: 'Safaris', icon: <Tent size={14} />, id: PlaceCategory.SAFARI },
    { label: 'Hotels', icon: <Building2 size={14} />, id: PlaceCategory.HOTEL },
    { label: 'Experiences', icon: <Ticket size={14} />, id: PlaceCategory.EXPERIENCE },
    { label: 'Guides', icon: <Users size={14} />, id: 'GUIDES' },
  ];

  return (
    <div className="relative min-h-screen md:h-[85vh] w-full overflow-hidden flex items-center justify-center pt-24 md:pt-40 pb-20">
      {/* Background - Single Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801" 
          alt="Kenyan Safari" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/20 to-navy/80"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-12 md:space-y-16">
        <div className="space-y-6">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-5xl md:text-9xl font-bold leading-[0.9] text-white tracking-tighter"
          >
            Experience the <br />
            <span className="text-safari italic">Majesty</span> of Kenya
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed font-sans italic"
          >
            A curated collective of the most authentic destinations in the heart of Africa.
          </motion.p>
        </div>

        <div className="space-y-8 w-full max-w-4xl mx-auto">
          {/* Main Search Bar */}
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="relative group h-20 md:h-24"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl transition-all group-focus-within:bg-white group-focus-within:border-white"></div>
            <div className="absolute inset-y-0 left-8 flex items-center text-white/30 group-focus-within:text-safari">
              <Search size={28} />
            </div>
            <input 
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Where will your spirit wander?"
              className="absolute inset-0 bg-transparent px-20 text-white group-focus-within:text-navy text-lg md:text-2xl font-medium outline-none placeholder:text-white/30 group-focus-within:placeholder:text-navy/20 tap-target"
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button 
                type="submit"
                className="h-full px-8 md:px-12 bg-safari hover:bg-safari-light text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all active:scale-95 tap-target"
              >
                Explore
              </button>
            </div>
          </motion.form>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 md:gap-4"
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => onSearch('', cat.id)}
                className="flex items-center gap-3 px-6 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:border-white/30 active:scale-95 group tap-target"
              >
                <span className="text-safari group-hover:scale-110 transition-transform">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
