
import React, { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Star, Search, Utensils, Tent, Building2, Ticket, Users } from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Container } from './Container';

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
    <div className="relative min-h-[92vh] sm:min-h-screen md:h-[90vh] w-full overflow-hidden flex flex-col justify-between pt-24 md:pt-36">
      {/* Background - Single Image and Linear Gradient Blend */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801" 
          alt="Kenyan Safari" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }}></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-8 md:space-y-12 flex-1 flex flex-col justify-center items-center py-6">
        <div className="space-y-4 md:space-y-6">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-[clamp(2.2rem,6vw,3.5rem)] md:text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-[1.05] text-white tracking-tighter"
          >
            Experience the <br />
            <span className="text-safari italic">Majesty</span> of Kenya
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-[clamp(0.9rem,2.2vw,1.125rem)] text-white/85 max-w-2xl mx-auto font-light leading-relaxed"
          >
            A curated collective of the most authentic destinations in the heart of Africa.
          </motion.p>
        </div>

        <div className="space-y-8 w-full max-w-4xl mx-auto shrink-0">
          {/* Main Search Bar - Rounded Pill Shape with Focus Shadow Glow */}
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="relative group h-16 md:h-20 w-full max-w-3xl mx-auto"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl transition-all group-focus-within:bg-white group-focus-within:border-white group-focus-within:ring-4 group-focus-within:ring-navy/20"></div>
            <div className="absolute inset-y-0 left-6 flex items-center text-white/50 group-focus-within:text-navy">
              <Search size={22} />
            </div>
            <input 
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Where will your spirit wander?"
              className="absolute inset-0 bg-transparent pl-16 pr-32 md:pr-40 text-white group-focus-within:text-navy text-base md:text-lg font-medium outline-none placeholder:text-white/60 group-focus-within:placeholder:text-navy/45 tap-target text-left"
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button 
                type="submit"
                className="h-full px-6 md:px-10 bg-navy hover:bg-navy-light text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-xl transition-all active:scale-95 tap-target"
              >
                Explore
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Category Chips Scrollbar Custom Row — Frosted Deck Bottom Section */}
      <div className="relative bg-black/40 backdrop-blur-md border-t border-white/5 py-5 sm:py-6 z-10 w-full shrink-0">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide"
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => onSearch('', cat.id)}
                className="flex items-center gap-2 px-4 sm:px-5 h-10 sm:h-11 bg-white/5 hover:bg-navy border border-white/10 rounded-full text-white text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:border-white/30 hover:scale-[1.03] active:scale-95 group tap-target whitespace-nowrap"
              >
                <span className="text-safari group-hover:scale-110 transition-transform">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>
        </Container>
      </div>
    </div>
  );
};
