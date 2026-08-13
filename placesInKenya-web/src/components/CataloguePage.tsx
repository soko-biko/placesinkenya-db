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
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMapView, setIsMapView] = useState(false);

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
  }, [searchQuery, selectedCategory, selectedCity, maxPrice, minRating, verifiedOnly]);

  const filteredPlaces = useMemo(() => {
    return (initialPlaces || []).filter(p => {
      if (!p) return false;
      const safeName = (p.name || '').toLowerCase();
      const safeLocation = (p.location || '').toLowerCase();
      const safeDesc = (p.description || '').toLowerCase();
      const safeQuery = (searchQuery || '').toLowerCase();
      
      const matchesSearch = safeName.includes(safeQuery) || 
        safeLocation.includes(safeQuery) ||
        safeDesc.includes(safeQuery);
      
      const safeCat = p.category || 'EXPLORE';
      const matchesCategory = selectedCategory === 'ALL' || safeCat === selectedCategory;
      const matchesCity = !selectedCity || safeLocation.includes(selectedCity.toLowerCase());
      
      const itemPrice = typeof p.price === 'number' ? p.price : (parseFloat(p.price as any) || 0);
      const priceCap = maxPrice && maxPrice > 0 ? maxPrice * 2 : 0;
      const matchesPrice = !maxPrice || maxPrice === 0 || itemPrice <= priceCap;
      const matchesRating = (p.rating || 0) >= minRating;
      const matchesVerified = !verifiedOnly || Boolean(p.isVerified);
      
      return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesRating && matchesVerified;
    });
  }, [initialPlaces, searchQuery, selectedCategory, selectedCity, maxPrice, minRating, verifiedOnly]);

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
    if (selectedCategory !== 'ALL') {
      const catLabel = selectedCategory
        .toLowerCase()
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      filters.push({ id: 'cat', label: catLabel, onRemove: () => setSelectedCategory('ALL') });
    }
    if (selectedCity) filters.push({ id: 'city', label: selectedCity, onRemove: () => setSelectedCity('') });
    if (minRating > 0) filters.push({ id: 'rate', label: `${minRating}+ Stars`, onRemove: () => setMinRating(0) });
    if (maxPrice && maxPrice > 0) filters.push({ id: 'price', label: `Up to Ksh ${(maxPrice * 2).toLocaleString()}`, onRemove: () => setMaxPrice(null) });
    if (verifiedOnly) filters.push({ id: 'verified', label: 'Verified Only', onRemove: () => setVerifiedOnly(false) });
    return filters;
  }, [selectedCategory, selectedCity, minRating, maxPrice, verifiedOnly]);

  const gridCols = useMemo(() => {
    const count = filteredPlaces.length;
    if (count > 500) return 5;
    if (count > 350) return 4;
    if (count > 200) return 3;
    if (count > 50) return 2;
    return 1;
  }, [filteredPlaces.length]);

  const isLargeSet = filteredPlaces.length > 500;

  const gridClass = useMemo(() => {
    switch (gridCols) {
      case 5:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';
      case 4:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
      default:
        return 'flex flex-col';
    }
  }, [gridCols]);

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <CatalogueHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content Area */}
      <div className={`w-full transition-all duration-300 flex-1 ${
        isMapView 
          ? 'max-w-[1920px] mx-auto px-2 sm:px-4 py-4 sm:py-6' 
          : 'max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-10'
      }`}>
        <div className={`flex flex-col ${!isLargeSet ? 'lg:flex-row' : ''} gap-8 xl:gap-10`}>

          {/* Desktop Sidebar (Sticky) - Hidden if > 500 items (Landscape Filter used instead) */}
          {!isLargeSet && (
            <aside className="hidden lg:block w-72 shrink-0 sticky top-32 h-fit">
              <FilterPanel 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                minRating={minRating}
                onRatingChange={setMinRating}
                verifiedOnly={verifiedOnly}
                onVerifiedToggle={() => setVerifiedOnly(!verifiedOnly)}
              />
            </aside>
          )}

          {/* Results Area */}
          <div className="flex-1 space-y-8 min-w-0">
            {/* Top Landscape Filter Tab when > 500 items */}
            {isLargeSet && (
              <div className="hidden lg:block">
                <FilterPanel 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                  maxPrice={maxPrice}
                  onPriceChange={setMaxPrice}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                  verifiedOnly={verifiedOnly}
                  onVerifiedToggle={() => setVerifiedOnly(!verifiedOnly)}
                  landscape={true}
                />
              </div>
            )}

            {/* Mobile Category Chips */}
            <div className="lg:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide flex gap-2 pb-2">
                <button 
                  onClick={() => setSelectedCategory('ALL')}
                  className={`shrink-0 px-4 h-9 rounded-full text-[12px] font-semibold border transition-all ${selectedCategory === 'ALL' ? 'bg-navy text-white border-navy' : 'bg-white text-navy/60 border-navy/5'}`}
                >
                  All
                </button>
                {Object.values(PlaceCategory).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-4 h-9 rounded-full text-[12px] font-semibold border transition-all ${selectedCategory === cat ? 'bg-navy text-white border-navy' : 'bg-white text-navy/60 border-navy/5'}`}
                  >
                    {cat.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
            </div>

            {/* Results Header: Count + Active Filters */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col flex-1 max-w-md">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[12px] font-bold text-safari leading-none">Places</span>
                        <span className="text-[12px] font-medium text-navy/40">{Math.min(visibleCount, filteredPlaces.length)} of {filteredPlaces.length} Places</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(Math.min(visibleCount, filteredPlaces.length) / (filteredPlaces.length || 1)) * 100}%` }}
                            className="h-full bg-safari rounded-full"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => setIsMapView(!isMapView)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 h-11 rounded-xl text-[12px] font-semibold border transition-all duration-300 shadow-sm cursor-pointer ${isMapView ? 'bg-navy text-white border-navy hover:bg-navy/90' : 'bg-white text-navy border-navy/10 hover:border-navy/20'}`}
                  >
                    {isMapView ? (
                      <>
                        <List size={15} className="text-safari" />
                        <span>Show List View</span>
                      </>
                    ) : (
                      <>
                        <Map size={15} />
                        <span>Show Map</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 h-11 bg-navy text-white rounded-xl font-semibold text-[12px] shadow-md tap-target"
                  >
                    <SlidersHorizontal size={15} /> <span>Filter Places</span>
                  </button>
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {activeFilters.map(filter => (
                    <button 
                      key={filter.id}
                      onClick={filter.onRemove}
                      className="px-3.5 h-8 bg-navy/5 hover:bg-navy/10 rounded-full flex items-center gap-2 text-[12px] font-medium text-navy transition-all"
                    >
                      {filter.label} <X size={12} className="text-safari" />
                    </button>
                  ))}
                  <button 
                    onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedCity('');
                        setMinRating(0);
                        setMaxPrice(null);
                        setVerifiedOnly(false);
                    }}
                    className="text-[12px] font-semibold text-navy/40 hover:text-red-500 transition-colors ml-2 cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* View Area: Fullscreen Map View OR List View */}
            {isMapView ? (
              <div className="w-full h-[72vh] sm:h-[80vh] min-h-[550px] rounded-3xl overflow-hidden shadow-lux border border-navy/5 relative bg-navy/5">
                <DestinationMap 
                  places={filteredPlaces}
                  onPlaceClick={onPlaceClick}
                />
              </div>
            ) : (
              <div className="w-full min-w-0">
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
                    <div className={gridClass}>
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
                              layout={gridCols > 1 ? "grid" : "list"}
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
                                Showing {displayedPlaces.length} of {filteredPlaces.length} places
                            </p>
                            <button 
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="group h-12 px-10 bg-white hover:bg-navy text-navy hover:text-white border-2 border-navy rounded-full font-black uppercase tracking-[0.3em] text-[10px] sm:text-[11px] transition-all flex items-center justify-center gap-3 shadow-lux active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
                                    <>Load More <div className="w-8 h-8 bg-navy/5 group-hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"><LayoutGrid size={14} /></div></>
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
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy">No Places Found</h3>
                      <p className="text-navy/40 max-w-sm mx-auto text-sm leading-relaxed">
                        We couldn't find any places matching your current filters. Try adjusting your search criteria.
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
            )}
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
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[120] p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-navy">Filter Places</h3>
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-navy/5 rounded-xl text-navy cursor-pointer"
                >
                    <X size={20} />
                </button>
              </div>
              <FilterPanel 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                minRating={minRating}
                onRatingChange={setMinRating}
                verifiedOnly={verifiedOnly}
                onVerifiedToggle={() => setVerifiedOnly(!verifiedOnly)}
              />
              <div className="mt-8 pt-6 border-t border-navy/5">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full h-12 bg-navy text-white rounded-2xl font-semibold text-[12px] shadow-lux cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
