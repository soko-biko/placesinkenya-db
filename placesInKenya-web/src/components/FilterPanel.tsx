import React from 'react';
import { PlaceCategory } from '../types';
import { Check, Filter, Calendar, X } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: PlaceCategory | 'ALL';
  onCategoryChange: (cat: PlaceCategory | 'ALL') => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  maxPrice: number | null;
  onPriceChange: (price: number | null) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  verifiedOnly: boolean;
  onVerifiedToggle: () => void;
  landscape?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  verifiedOnly,
  onVerifiedToggle,
  landscape = false,
}) => {
  const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru', 'Diani', 'Watamu'];

  const formatCategoryName = (cat: string) => {
    if (cat === 'ALL') return 'All Collections';
    return cat
      .toLowerCase()
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  if (landscape) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 border border-navy/10 shadow-sm flex flex-wrap items-center gap-4 text-[12px] font-semibold text-navy">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-navy/50 flex items-center gap-1 shrink-0">
            <Filter size={13} className="text-safari" /> Category:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-xs">
            <button
              onClick={() => onCategoryChange('ALL')}
              className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all shrink-0 ${selectedCategory === 'ALL' ? 'bg-navy text-white shadow-sm' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}
            >
              All Collections
            </button>
            {Object.values(PlaceCategory).map(cat => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all shrink-0 ${selectedCategory === cat ? 'bg-navy text-white shadow-sm' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}
              >
                {formatCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Geographic Hub / Region */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-navy/50 shrink-0">Region:</span>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="h-9 bg-navy/5 border border-navy/10 rounded-xl px-3 text-[12px] font-semibold text-navy outline-none cursor-pointer"
          >
            <option value="">All Regions</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Max Price */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-navy/50 shrink-0">Max Price:</span>
          <input
            type="number"
            placeholder="e.g. 15000"
            value={maxPrice && maxPrice > 0 ? maxPrice : ''}
            onChange={(e) => onPriceChange(e.target.value ? Math.max(0, Number(e.target.value)) : null)}
            className="w-28 h-9 bg-navy/5 border border-navy/10 rounded-xl px-3 text-[12px] font-semibold text-navy outline-none placeholder:text-navy/30"
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-bold text-navy/50 shrink-0">Rating:</span>
          {[3, 4, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => onRatingChange(minRating === rating ? 0 : rating)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-all border ${minRating === rating ? 'bg-navy text-white border-navy' : 'bg-navy/5 border-transparent text-navy/60 hover:bg-navy/10'}`}
            >
              {rating}+ Stars
            </button>
          ))}
        </div>

        {/* Verified Toggle */}
        <button
          onClick={onVerifiedToggle}
          className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all border ${verifiedOnly ? 'bg-navy text-white border-navy' : 'bg-navy/5 border-transparent text-navy/60 hover:bg-navy/10'}`}
        >
          Verified Only
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Section */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-bold text-navy/50 flex items-center gap-2">
          <Filter size={13} className="text-safari" /> Sphere Of Interest
        </h4>
        <div className="flex flex-wrap gap-1.5">
           <button 
             onClick={() => onCategoryChange('ALL')}
             className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${selectedCategory === 'ALL' ? 'bg-navy text-white shadow-md' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}
           >
             All Collections
           </button>
           {Object.values(PlaceCategory).map(cat => (
             <button 
               key={cat}
               onClick={() => onCategoryChange(cat)}
               className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${selectedCategory === cat ? 'bg-navy text-white shadow-md' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}
             >
               {formatCategoryName(cat)}
             </button>
           ))}
        </div>
      </div>

      {/* Region Section */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-bold text-navy/50">Geographic Hub</h4>
        <div className="grid grid-cols-2 gap-1.5">
           {cities.map(city => (
             <button 
               key={city}
               onClick={() => onCityChange(selectedCity === city ? '' : city)}
               className={`flex items-center justify-between px-3 h-9 rounded-xl text-[12px] font-semibold transition-all border ${selectedCity === city ? 'bg-safari/10 border-safari text-navy' : 'bg-white border-navy/5 text-navy/60 hover:border-navy/10'}`}
             >
               {city}
               {selectedCity === city && <Check size={14} className="text-safari" />}
             </button>
           ))}
        </div>
      </div>

      {/* Price Spectrum Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-bold text-navy/50">Maximum Price (Ksh)</h4>
            <span className="text-[12px] font-bold text-safari">
              {maxPrice && maxPrice > 0 ? `Up to Ksh ${(maxPrice * 2).toLocaleString()}` : 'Any Price'}
            </span>
        </div>
        
        <div className="relative flex items-center">
          <input 
            type="number"
            min="0"
            step="500"
            placeholder="Enter max price (e.g. 15000)"
            value={maxPrice && maxPrice > 0 ? maxPrice : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || isNaN(Number(val))) {
                onPriceChange(null);
              } else {
                onPriceChange(Math.max(0, Number(val)));
              }
            }}
            className="w-full h-10 bg-white border border-navy/10 rounded-xl px-3.5 pr-16 text-[12px] font-semibold text-navy focus:ring-2 focus:ring-safari/20 outline-none transition-all placeholder:text-navy/30"
          />
          {maxPrice && maxPrice > 0 && (
            <button 
              type="button"
              onClick={() => onPriceChange(null)}
              className="absolute right-2.5 px-2 py-0.5 bg-navy/5 hover:bg-navy/10 rounded-lg text-[12px] font-semibold text-navy/60 hover:text-navy cursor-pointer flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {maxPrice && maxPrice > 0 && (
          <p className="text-[11px] text-navy/40 font-medium">
            Filters items priced up to Ksh {(maxPrice * 2).toLocaleString()} (2× threshold)
          </p>
        )}

        {/* Quick price presets */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {[2500, 5000, 10000, 25000, 50000].map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => onPriceChange(maxPrice === preset ? null : preset)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-all border ${
                maxPrice === preset 
                  ? 'bg-navy text-white border-navy shadow-sm' 
                  : 'bg-navy/5 border-transparent text-navy/60 hover:bg-navy/10'
              }`}
            >
              Under {preset >= 1000 ? `${preset / 1000}k` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-bold text-navy/50">Minimum Rating</h4>
        <div className="flex gap-1.5">
           {[3, 4, 4.5].map(rating => (
             <button 
               key={rating}
               onClick={() => onRatingChange(minRating === rating ? 0 : rating)}
               className={`flex-1 h-9 rounded-xl text-[12px] font-semibold border transition-all ${minRating === rating ? 'bg-navy text-white shadow-md border-navy' : 'bg-white border-navy/5 text-navy/60 hover:border-navy/10'}`}
             >
               {rating}+ Stars
             </button>
           ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-bold text-navy/50 flex items-center gap-2">
            <Calendar size={13} className="text-safari" /> Date Filter
        </h4>
        <div className="relative group">
           <input 
             type="date" 
             className="w-full h-10 bg-white border border-navy/10 rounded-xl px-3.5 font-semibold text-navy text-[12px] focus:ring-2 focus:ring-safari/20 outline-none transition-all cursor-pointer appearance-none"
           />
           <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-safari group-hover:scale-110 transition-transform">
              <Calendar size={15} />
           </div>
        </div>
        <div className="flex gap-1.5">
           {['This Weekend', 'Next Week'].map(period => (
             <button 
               key={period} 
               className="flex-1 h-8 bg-navy/5 hover:bg-safari hover:text-white rounded-xl text-[12px] font-semibold text-navy/60 transition-all"
             >
                {period}
             </button>
           ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="pt-2 border-t border-navy/5">
        <button 
          onClick={onVerifiedToggle}
          className={`w-full h-10 rounded-xl flex items-center justify-between px-3.5 transition-all ${verifiedOnly ? 'bg-navy text-white' : 'bg-navy/5 text-navy/60'}`}
        >
          <span className="text-[12px] font-semibold">Verified Only</span>
          <div className={`w-8 h-4.5 rounded-full relative transition-all ${verifiedOnly ? 'bg-safari' : 'bg-navy/10'}`}>
             <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
};

