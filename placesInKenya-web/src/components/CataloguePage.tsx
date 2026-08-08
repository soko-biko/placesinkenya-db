import React, { useState, useEffect, useMemo } from 'react';
import { Place, PlaceCategory } from '../types';
import { CatalogueHeader } from './CatalogueHeader';
import { FilterPanel } from './FilterPanel';
import { PlaceCard } from './PlaceCard';
import { Filter, X, LayoutGrid, List, SlidersHorizontal, Loader2, Search, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DestinationMap } from './DestinationMap';

interface CataloguePageProps {
  initialPlaces: Place[];
  initialSearch?: string;
  initialCategory?: PlaceCategory | 'ALL';
  onPlaceClick: (place: Place) => void;
  onSave: (id: string) => void;
  savedItemIds: string[];
}

export const CataloguePage: React.FC<CataloguePageProps> = ({ 
  initialPlaces, 
  initialSearch = '', 
  initialCategory = 'ALL' ,
  onPlaceClick,
  onSave,
  savedItemIds
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'ALL'>(initialCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMapExpanded, setIsMapExpanded] = useState(true);

  // Sync with props if search/category changes from outside
  useEffect(() => {
    setSearchQuery(initialSearch);
    setSelectedCategory(initialCategory);
  }, [initialSearch, initialCategory]);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedCity, priceRange, minRating, verifiedOnly]);

  const filteredPlaces = useMemo(() => {
    return initialPlaces.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesCity = !selectedCity || p.location.includes(selectedCity);
      const matchesPrice = (p.price || 0) <= priceRange[1];
      const matchesRating = p.rating >= minRating;
      const matchesVerified = !verifiedOnly || p.isVerified;
      
      return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesRating && matchesVerified;
    });
  }, [initialPlaces, searchQuery, selectedCategory, selectedCity, priceRange, minRating, verifiedOnly]);

  const displayedPlaces = filteredPlaces.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
        setVisibleCount(prev => prev + 12);
        setIsLoading(false);
    }, 600);
  };

  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedCategory !== 'ALL') filters.push({ id: 'cat', label: selectedCategory.replace('_', ' '), onRemove: () => setSelectedCategory('ALL') });
    if (selectedCity) filters.push({ id: 'city', label: selectedCity, onRemove: () => setSelectedCity('') });
    if (minRating > 0) filters.push({ id: 'rate', label: `${minRating}+ Stars`, onRemove: () => setMinRating(0) });
    if (priceRange[1] < 50000) filters.push({ id: 'price', label: `Under Ksh ${priceRange[1].toLocaleString()}`, onRemove: () => setPriceRange([0, 50000]) });
    return filters;
  }, [selectedCategory, selectedCity, minRating, priceRange]);

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <CatalogueHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content Area */}
      <div className={`w-full ${isMapExpanded ? 'max-w-[1920px] px-4 sm:px-6 xl:px-8' : 'max-w-7xl mx-auto px-6 sm:px-6'} py-12 flex-1 transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">

          {/* Desktop Sidebar (Sticky) */}
          <aside className="hidden lg:block w-80 shrink-0 sticky top-32 h-fit">
            <FilterPanel 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minRating={minRating}
              onRatingChange={setMinRating}
              verifiedOnly={verifiedOnly}
              onVerifiedToggle={() => setVerifiedOnly(!verifiedOnly)}
            />
          </aside>

          {/* Results Area */}
          <div className="flex-1 space-y-10">
            {/* Mobile Category Chips */}
            <div className="lg:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide flex gap-2 pb-2">
                <button 
                  onClick={() => setSelectedCategory('ALL')}
                  className={`shrink-0 px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === 'ALL' ? 'bg-navy text-white border-navy' : 'bg-white text-navy/40 border-navy/5'}`}
                >
                  All
                </button>
                {Object.values(PlaceCategory).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-navy text-white border-navy' : 'bg-white text-navy/40 border-navy/5'}`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
            </div>

            {/* Results Header: Count + Active Filters */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="flex flex-col flex-1 max-w-md">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-safari leading-none">Discovery Report</span>
                        <span className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">{Math.min(visibleCount, filteredPlaces.length)} / {filteredPlaces.length} Collections</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(Math.min(visibleCount, filteredPlaces.length) / filteredPlaces.length) * 100}%` }}
                            className="h-full bg-safari rounded-full"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm cursor-pointer ${isMapExpanded ? 'bg-navy text-white border-navy hover:bg-navy/90' : 'bg-white text-navy border-navy/5 hover:border-navy/10'}`}
                  >
                    <Map size={14} className={isMapExpanded ? 'text-safari' : ''} />
                    <span>{isMapExpanded ? 'Hide Map View' : 'Show Map View'}</span>
                  </button>

                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 h-12 bg-navy text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-md tap-target"
                  >
                    <SlidersHorizontal size={14} /> <span>Filter Treasures</span>
                  </button>
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map(filter => (
                    <button 
                      key={filter.id}
                      onClick={filter.onRemove}
                      className="px-4 h-9 bg-navy/5 hover:bg-navy/10 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy transition-all"
                    >
                      {filter.label} <X size={12} className="text-safari" />
                    </button>
                  ))}
                  <button 
                    onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedCity('');
                        setMinRating(0);
                        setPriceRange([0, 50000]);
                        setVerifiedOnly(false);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-navy/30 hover:text-red-500 transition-colors ml-2"
                  >
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Grid & Map Split Container */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Side: Results List */}
              <div className="flex-1 w-full min-w-0">
                {isLoading && visibleCount === 12 ? (
                  <div className="flex flex-col">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-5 border-b border-navy/10 animate-pulse w-full">
                        <div className="w-full sm:w-32 md:w-40 aspect-[16/10] sm:aspect-[4/3] bg-navy/5 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-3 py-1">
                          <div className="h-4 bg-navy/10 rounded-full w-1/3" />
                          <div className="h-3 bg-navy/5 rounded-full w-1/4" />
                          <div className="space-y-1.5 pt-2">
                            <div className="h-3 bg-navy/5 rounded-full w-3/4" />
                            <div className="h-3 bg-navy/5 rounded-full w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredPlaces.length > 0 ? (
                  <div className="space-y-8">
                    <div className="flex flex-col">
                        {displayedPlaces.map((place, i) => (
                        <motion.div
                            key={place.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: (i % 4) * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <PlaceCard 
                              place={place} 
                              layout="list"
                              onClick={onPlaceClick} 
                              onSave={() => onSave(place.id)}
                              isSaved={savedItemIds.includes(place.id)}
                            />
                        </motion.div>
                        ))}
                    </div>

                    {visibleCount < filteredPlaces.length && (
                        <div className="flex flex-col items-center gap-4 py-8 border-t border-navy/5">
                            <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em]">
                                You've revealed {displayedPlaces.length} of {filteredPlaces.length} gems
                            </p>
                            <button 
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="group h-12 px-10 bg-white hover:bg-navy text-navy hover:text-white border-2 border-navy rounded-full font-black uppercase tracking-[0.3em] text-[10px] sm:text-[11px] transition-all flex items-center justify-center gap-3 shadow-lux active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
                                    <>Reveal More Wonders <div className="w-8 h-8 bg-navy/5 group-hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"><LayoutGrid size={14} /></div></>
                                )}
                            </button>
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="py-16 md:py-24 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-2xl border border-dashed border-navy/10 px-6 animate-fade-in">
                    <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center text-navy/10">
                      <Search size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy">No Treasures Found</h3>
                      <p className="text-navy/40 max-w-sm mx-auto text-sm leading-relaxed">
                        The wild spirit is vast, but it seems we couldn't find a match for your current filters. Broaden your horizons.
                      </p>
                    </div>
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('ALL');
                            setSelectedCity('');
                        }}
                        className="h-10 px-6 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-safari transition-all cursor-pointer"
                    >
                        Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side Sticky Map (Desktop) / Collapsible Map (Mobile) */}
              {isMapExpanded && filteredPlaces.length > 0 && (
                <div className="w-full lg:w-[460px] xl:w-[560px] 2xl:w-[680px] lg:sticky lg:top-32 h-[50vh] sm:h-[60vh] lg:h-[75vh] shrink-0 rounded-3xl overflow-hidden shadow-lux border border-navy/5 order-first lg:order-last mb-8 lg:mb-0 transition-all duration-300">
                  <DestinationMap 
                    places={filteredPlaces}
                    onPlaceClick={onPlaceClick}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-md z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[120] p-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-serif font-bold text-navy">Curate Search</h3>
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-12 h-12 flex items-center justify-center bg-navy/5 rounded-2xl text-navy"
                >
                    <X size={24} />
                </button>
              </div>
              <FilterPanel 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onRatingChange={setMinRating}
                verifiedOnly={verifiedOnly}
                onVerifiedToggle={() => setVerifiedOnly(!verifiedOnly)}
              />
              <div className="mt-12 pt-12 border-t border-navy/5">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full h-20 bg-navy text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-lux"
                >
                  Apply Refinements
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
