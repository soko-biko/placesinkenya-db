
import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
    <div className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center pt-20">
      {/* Background - Single Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801" 
          alt="Kenyan Safari" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/30 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-5xl md:text-8xl font-bold leading-tight text-white tracking-tight"
          >
            Experience the <br />
            <span className="text-safari italic">Majesty of Kenya</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed"
          >
            From legendary safaris to rooftop restaurants, hidden cafés to midnight concerts — PlacesInKenya is your guide to experiencing Kenya, fully.
          </motion.p>
        </div>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
        >
          <button 
            onClick={() => onSearch('')}
            className="px-12 h-16 bg-safari hover:bg-safari-light text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all"
          >
            Explore Catalogue
          </button>
        </motion.div>
      </div>
    </div>
  );
};
