import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

interface CatalogueHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const CatalogueHeader: React.FC<CatalogueHeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <section 
      id="explore-search-section" 
      className="relative w-full bg-off-white z-20 overflow-visible"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="relative group w-full">
          <div className="relative flex items-center w-full bg-white rounded-2xl border border-navy/15 shadow-sm hover:border-navy/30 focus-within:border-safari focus-within:ring-2 focus-within:ring-safari/20 transition-all z-10 pointer-events-auto">
            <label 
              htmlFor="explore-search-input"
              className="pl-4 sm:pl-5 pr-2 flex items-center text-navy/45 group-focus-within:text-safari transition-colors pointer-events-none cursor-text shrink-0"
            >
              <Search size={20} />
            </label>
            <input 
              id="explore-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search places by name, category, or location..."
              className="w-full h-12 sm:h-14 bg-transparent text-navy font-medium outline-none placeholder:text-navy/40 text-sm sm:text-base pr-3 cursor-text pointer-events-auto"
            />
            {searchQuery && (
              <button
                type="button"
                id="clear-explore-search-btn"
                onClick={() => onSearchChange('')}
                className="mr-3 sm:mr-4 p-1.5 rounded-full hover:bg-navy/5 text-navy/40 hover:text-navy transition-colors cursor-pointer pointer-events-auto shrink-0"
                title="Clear search"
                aria-label="Clear search input"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
