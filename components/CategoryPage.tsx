import React, { useState } from 'react';
import { Place, PlaceCategory } from '../types';
import { PlaceCard } from './PlaceCard';
import { Search, MapPin, Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryPageProps {
  title: string;
  subtitle: string;
  category: PlaceCategory;
  places: Place[];
  onPlaceClick: (place: Place) => void;
  subcategories: string[];
  heroImage?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ 
  title, 
  subtitle, 
  category, 
  places, 
  onPlaceClick, 
  subcategories,
  heroImage 
}) => {
  const [selectedSub, setSelectedSub] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = places.filter(p => {
    const matchesSub = selectedSub === 'ALL' || p.tags?.some(t => t.toUpperCase() === selectedSub);
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className={`relative h-[400px] flex items-center justify-center overflow-hidden rounded-b-[4rem]`}>
        {heroImage ? (
          <img src={heroImage} className="absolute inset-0 w-full h-full object-cover" alt="" />
        ) : (
          <div className="absolute inset-0 bg-navy"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy"></div>
        <div className="relative z-10 text-center max-w-3xl px-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
             <span className="text-safari font-bold uppercase tracking-widest text-xs">Explore Kenya</span>
             <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">{title}</h1>
             <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed">{subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 space-y-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-6 rounded-3xl shadow-sm border border-navy/5">
          <div className="flex overflow-x-auto gap-2 w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`shrink-0 px-6 h-10 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${selectedSub === sub ? 'bg-navy text-white shadow-md' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}
              >
                {sub}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-navy/5 rounded-xl pl-12 pr-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-safari/30 border border-transparent transition-all"
              placeholder="Search in this category..."
            />
          </div>
        </div>

        {/* Featured Section (if any) */}
        {category === PlaceCategory.RESTAURANTS && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border-l-8 border-safari shadow-lg flex flex-col md:flex-row gap-10 items-center">
             <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-xl">
               <img src="https://images.unsplash.com/photo-1544025162-d76694265947" className="w-full h-full object-cover" alt="" />
             </div>
             <div className="flex-1 space-y-6">
                <span className="bg-safari/10 text-safari text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">✦ Editor's Pick</span>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif font-bold text-navy">Carnivore Restaurant, Nairobi</h3>
                  <p className="text-navy/60 text-lg font-medium">From nyama choma joints to rooftop fine dining — Kenya's food scene is wilder than you think.</p>
                </div>
                <button onClick={() => onPlaceClick(places.find(p => p.id === 'r1')!)} className="flex items-center gap-3 bg-navy text-white px-8 h-14 rounded-2xl font-bold text-sm hover:bg-safari transition-all group">
                  See Menu & Location <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(place => (
            <PlaceCard key={place.id} place={place} onClick={onPlaceClick} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center space-y-6">
               <div className="w-20 h-20 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto text-navy/10">
                 <Search size={40} />
               </div>
               <div className="space-y-1">
                 <p className="text-2xl font-serif font-bold text-navy opacity-40">No results found</p>
                 <p className="text-navy/30 text-sm font-bold uppercase tracking-widest">Try adjusting your filters or search term</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
