import React from 'react';
import { PlaceCategory } from '../types';
import { Check, X, Filter, ChevronDown, SlidersHorizontal, Calendar } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: PlaceCategory | 'ALL';
  onCategoryChange: (cat: PlaceCategory | 'ALL') => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  verifiedOnly: boolean;
  onVerifiedToggle: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  verifiedOnly,
  onVerifiedToggle,
}) => {
  const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru', 'Diani', 'Watamu'];

  return (
    <div className="space-y-12">
      {/* Category Section */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40 flex items-center gap-2">
            <Filter size={12} className="text-safari" /> Sphere of Interest
        </h4>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => onCategoryChange('ALL')}
             className={`px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'ALL' ? 'bg-navy text-white shadow-lg' : 'bg-navy/5 text-navy/40 hover:bg-navy/10'}`}
           >
             All Collections
           </button>
           {Object.values(PlaceCategory).map(cat => (
             <button 
               key={cat}
               onClick={() => onCategoryChange(cat)}
               className={`px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-navy text-white shadow-lg' : 'bg-navy/5 text-navy/40 hover:bg-navy/10'}`}
             >
               {cat.replace('_', ' ')}
             </button>
           ))}
        </div>
      </div>

      {/* Region Section */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40">Geographic Hub</h4>
        <div className="grid grid-cols-2 gap-2">
           {cities.map(city => (
             <button 
               key={city}
               onClick={() => onCityChange(selectedCity === city ? '' : city)}
               className={`flex items-center justify-between px-5 h-12 rounded-2xl text-[11px] font-bold transition-all border ${selectedCity === city ? 'bg-safari/5 border-safari text-navy' : 'bg-white border-navy/5 text-navy/40 hover:border-navy/10'}`}
             >
               {city}
               {selectedCity === city && <Check size={14} className="text-safari" />}
             </button>
           ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40">Price Spectrum</h4>
            <span className="text-[11px] font-bold text-safari">Up to Ksh {priceRange[1].toLocaleString()}</span>
        </div>
        <input 
          type="range"
          min="0"
          max="50000"
          step="500"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
          className="w-full h-1.5 bg-navy/5 rounded-lg appearance-none cursor-pointer accent-safari"
        />
      </div>

      {/* Minimum Rating */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40">Minimum Distinction</h4>
        <div className="flex gap-2">
           {[3, 4, 4.5].map(rating => (
             <button 
               key={rating}
               onClick={() => onRatingChange(rating)}
               className={`flex-1 h-12 rounded-2xl text-[11px] font-bold border transition-all ${minRating === rating ? 'bg-navy text-white shadow-lg border-navy' : 'bg-white border-navy/5 text-navy/40'}`}
             >
               {rating}+ Stars
             </button>
           ))}
        </div>
      </div>

      {/* Temporal Window (Date) */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40 flex items-center gap-2">
            <Calendar size={12} className="text-safari" /> Temporal Window
        </h4>
        <div className="relative group">
           <input 
             type="date" 
             className="w-full h-14 bg-white border border-navy/5 rounded-2xl px-6 font-bold text-navy text-sm focus:ring-4 focus:ring-safari/10 outline-none transition-all cursor-pointer appearance-none"
           />
           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-safari group-hover:scale-110 transition-transform">
              <Calendar size={18} />
           </div>
        </div>
        <div className="flex gap-2">
           {['This Weekend', 'Next Week'].map(period => (
             <button 
               key={period} 
               className="flex-1 h-10 bg-navy/5 hover:bg-safari hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-navy/40 transition-all"
             >
                {period}
             </button>
           ))}
        </div>
      </div>

      {/* verified only */}
      <div className="pt-6 border-t border-navy/5">
        <button 
          onClick={onVerifiedToggle}
          className={`w-full h-16 rounded-3xl flex items-center justify-between px-6 transition-all ${verifiedOnly ? 'bg-navy text-white' : 'bg-navy/5 text-navy/40'}`}
        >
          <span className="text-[11px] font-black uppercase tracking-widest">Verified Only</span>
          <div className={`w-10 h-6 rounded-full relative transition-all ${verifiedOnly ? 'bg-safari' : 'bg-navy/10'}`}>
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${verifiedOnly ? 'left-5' : 'left-1'}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
};
