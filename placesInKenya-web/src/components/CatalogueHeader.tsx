import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface CatalogueHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const CatalogueHeader: React.FC<CatalogueHeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden bg-navy">
      {/* Abstract Kenyan Landscape overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1547448415-e9f5b28e570d"
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-overlay"
          alt="Landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy to-navy"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-10">
        <div className="space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-safari font-black uppercase tracking-[0.4em] text-[10px]"
          >
            The Curated Selection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight"
          >
            Catalogue of <span className="italic text-safari">Wonders</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-all group-focus-within:bg-white group-focus-within:border-white"></div>
          <div className="absolute inset-y-0 left-6 flex items-center text-white/30 group-focus-within:text-safari">
            <Search size={24} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, vibe, or location..."
            className="relative w-full h-16 bg-transparent px-16 text-white group-focus-within:text-navy font-medium outline-none placeholder:text-white/20 group-focus-within:placeholder:text-navy/20 tap-target"
          />
        </motion.div>
      </div>
    </section>
  );
};
