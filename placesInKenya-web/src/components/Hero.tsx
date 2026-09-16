
import React, { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Star, Search, Utensils, Tent, Building2, Ticket, Users } from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Container } from './Container';
import { useSiteSettings } from '../hooks/useFirestore';

interface HeroProps {
  onSearch: (val: string, category?: string) => void;
  trendingPlaces: Place[];
}

export const Hero: React.FC<HeroProps> = ({ onSearch, trendingPlaces }) => {
  const [val, setVal] = useState('');
  const { settings } = useSiteSettings();

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

  const heroBg = settings.heroBgImage || "https://images.unsplash.com/photo-1516426122078-c23e76319801";

  return (
    <div 
      id="hero-section"
      className="relative min-h-screen md:h-[90vh] w-full overflow-hidden flex flex-col justify-between pt-32 sm:pt-36 bg-cover bg-center"
      style={{
        backgroundImage: `url("${heroBg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%'
      }}
    >
      {/* Full-bleed semi-transparent dark gradient overlay for text contrast across entire hero height */}
      <div 
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.70) 100%)'
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 flex-1 flex flex-col justify-center items-center py-6">
        <div className="space-y-3">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-white tracking-tight"
          >
            {settings.heroTitle} <br />
            <span className="text-safari italic">{settings.heroTitleHighlight}</span> of Kenya
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-sm sm:text-base text-white/90 max-w-xl mx-auto font-normal leading-relaxed"
          >
            {settings.heroSubtitle}
          </motion.p>
        </div>

        <div className="space-y-6 w-full max-w-2xl mx-auto shrink-0">
          {/* Main Search Bar - Rounded Pill Shape with Focus Shadow Glow */}
          <motion.form 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="relative group h-14 sm:h-16 md:h-20 w-full max-w-xl mx-auto"
          >
            <div className="absolute inset-0 bg-white/15 backdrop-blur-2xl rounded-full border border-white/25 shadow-2xl transition-all group-focus-within:bg-white group-focus-within:border-white group-focus-within:ring-4 group-focus-within:ring-navy/20"></div>
            <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center text-white/60 group-focus-within:text-navy">
              <Search size={20} />
            </div>
            <input 
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder={settings.heroSearchPlaceholder || "Search name, location..."}
              className="absolute inset-0 bg-transparent pl-12 pr-28 sm:pl-16 sm:pr-36 text-white group-focus-within:text-navy text-sm sm:text-base md:text-lg font-medium outline-none placeholder:text-white/70 group-focus-within:placeholder:text-navy/45 text-left"
            />

            <div className="absolute inset-y-1.5 sm:inset-y-2 right-1.5 sm:right-2 flex items-center">
              <button 
                type="submit"
                className="h-full px-5 sm:px-8 bg-navy hover:bg-navy-light text-white rounded-full font-black uppercase tracking-[0.15em] text-[10px] sm:text-[11px] shadow-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Explore
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Category Chips Scrollbar Row — seamless transparent overlay allowing full-bleed hero image to show through */}
      <div className="relative py-4 sm:py-5 z-10 w-full shrink-0">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide"
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => onSearch('', cat.id)}
                className="flex items-center gap-2 px-3.5 sm:px-4.5 h-9 sm:h-10 bg-white/15 hover:bg-navy border border-white/20 rounded-full text-white text-[10px] font-semibold capitalize tracking-normal transition-all hover:border-white/30 hover:scale-[1.03] active:scale-95 group tap-target whitespace-nowrap cursor-pointer backdrop-blur-xs"
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
