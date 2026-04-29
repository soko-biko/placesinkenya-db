
import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Place } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onSearch: (val: string) => void;
  trendingPlaces: Place[];
}

export const Hero: React.FC<HeroProps> = ({ onSearch, trendingPlaces }) => {
  const [val, setVal] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (trendingPlaces.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingPlaces.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trendingPlaces.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(val);
  };

  const currentPlace = trendingPlaces[currentIndex];

  const next = () => setCurrentIndex((prev) => (prev + 1) % trendingPlaces.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + trendingPlaces.length) % trendingPlaces.length);

  return (
    <div className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center pt-20">
      {/* Background - Single Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801" 
          alt="Kenyan Safari" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/20 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-10">
        <div className="space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-5xl md:text-8xl font-bold leading-tight text-white"
          >
            Experience <br />
            <span className="text-safari italic">Magical Kenya</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            From legendary safaris to rooftop restaurants, hidden cafés to midnight concerts — PlacesInKenya is your guide to experiencing Kenya, fully.
          </motion.p>
        </div>

        <div className="space-y-12 w-full">
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="relative max-w-3xl mx-auto w-full"
          >
            <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row items-center shadow-xl w-full">
              <div className="flex items-center gap-3 px-6 w-full md:flex-1 border-b md:border-b-0 md:border-r border-navy/5">
                <Search className="text-safari" size={24} />
                <input 
                  type="text" 
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder="Search restaurants, hikes, bars, safaris, hangout spots…"
                  className="bg-transparent border-none outline-none w-full text-navy placeholder:text-navy/30 py-4 text-base font-bold uppercase tracking-wider"
                />
              </div>
              <button 
                type="submit"
                className="bg-safari hover:bg-safari-light text-white w-full md:w-auto px-10 py-4 h-[52px] rounded-xl md:rounded-full font-semibold transition-all mt-2 md:mt-0 md:ml-2 shadow-lg active:scale-95 whitespace-nowrap"
              >
                Start Exploring
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};
