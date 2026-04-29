
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
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-10">
        <div className="space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-5xl md:text-8xl font-bold leading-tight"
          >
            Experience <br />
            <span className="text-safari italic">Kenya's Majesty</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            From legendary safaris to white-sand paradises. Plan your perfect Kenyan escape with the ultimate local guide.
          </motion.p>
        </div>

        <div className="space-y-12">
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="relative max-w-3xl mx-auto"
          >
            <div className="glass rounded-full p-2 flex items-center shadow-2xl border-white/20">
              <div className="flex items-center gap-3 px-6 flex-1 border-r border-white/10">
                <Search className="text-safari" size={24} />
                <input 
                  type="text" 
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder="Where to? (e.g. Maasai Mara, Diani, Nairobi)"
                  className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/50 py-4 text-lg"
                />
              </div>
              <button 
                type="submit"
                className="bg-safari hover:bg-safari-light text-white px-10 py-4 rounded-full font-bold transition-all ml-2 shadow-lg hover:scale-105 active:scale-95"
              >
                Explore
              </button>
            </div>
          </motion.form>

          {/* Carousel Details - Now Positioned Below Search Bar */}
          <AnimatePresence mode="wait">
            {currentPlace && (
              <motion.div 
                key={currentPlace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-auto flex items-stretch glass rounded-[2rem] border-white/10 max-w-xl h-44 overflow-hidden text-white"
              >
                <div className="w-2/5 shrink-0 relative">
                   <img src={currentPlace.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="text-left p-6 space-y-2 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="text-safari font-black uppercase tracking-widest text-[9px]">Trending Now</span>
                    <div className="flex gap-1">
                       <button onClick={prev} className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={14} /></button>
                       <button onClick={next} className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={14} /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-serif line-clamp-1">{currentPlace.name}</h3>
                  <div className="flex items-center gap-4 text-[11px] text-white/50 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-safari" /> {currentPlace.location}</span>
                    <span className="flex items-center gap-1 text-safari font-black"><Star size={12} fill="currentColor" /> {currentPlace.rating}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
