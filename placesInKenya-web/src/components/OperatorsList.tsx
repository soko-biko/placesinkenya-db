import React, { useState, useMemo } from 'react';
import { TourOperator, OperatorType } from '../types';
import { Star, MessageCircle, Calendar, ShieldCheck, Search, MapPin, Languages, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OperatorsListProps {
  operators: TourOperator[];
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operators }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [activeTab, setActiveTab] = useState<OperatorType | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const specialties = useMemo(() => {
    const all = operators.flatMap(o => o.specialties || []);
    return ['ALL', ...Array.from(new Set(all))];
  }, [operators]);

  const locations = useMemo(() => {
    const all = operators.map(o => o.location).filter(Boolean);
    return ['ALL', ...Array.from(new Set(all as string[]))];
  }, [operators]);

  const filteredOperators = useMemo(() => {
    return operators.filter(o => {
      const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (o.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesSpecialty = selectedSpecialty === 'ALL' || o.specialties?.includes(selectedSpecialty);
      const matchesLocation = selectedLocation === 'ALL' || o.location === selectedLocation;
      const matchesTab = activeTab === 'ALL' || o.type === activeTab;
      return matchesSearch && matchesSpecialty && matchesLocation && matchesTab;
    });
  }, [operators, searchQuery, selectedSpecialty, selectedLocation, activeTab]);

  const HorizontalOperatorCard: React.FC<{ operator: TourOperator }> = ({ operator }) => {
    const isCompany = operator.type === OperatorType.COMPANY;

    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 py-5 border-b border-navy/10 hover:bg-navy/[0.01] transition-colors cursor-pointer w-full text-left"
      >
        {/* Left Image Section - Pure image container without badges */}
        <div className="relative w-full sm:w-36 md:w-48 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-navy/5 shrink-0 z-0">
          <img 
            src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff`} 
            alt={operator.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </div>

        {/* Right Info Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1.5">
            {/* Category Tag & Verified Badge outside image div */}
            <div className="flex items-center gap-2">
              <span className="bg-safari/10 text-safari text-[8px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border border-safari/20 select-none">
                {isCompany ? 'Fleet Operator' : operator.title || 'Elite Guide'}
              </span>
              {operator.isVerified && (
                <span className="bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 text-[8px] font-black uppercase tracking-wider">
                  <ShieldCheck size={10} className="text-green-600 shrink-0" />
                  Verified
                </span>
              )}
            </div>

            {/* Header: Name and Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-navy truncate group-hover:text-safari transition-colors">
                {operator.name}
              </h3>

              <div className="flex items-center gap-0.5 text-safari shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < Math.floor(operator.rating) ? "currentColor" : "none"} className="text-safari border-0" />
                ))}
                <span className="text-[10px] font-bold text-navy ml-1 font-sans">
                  {operator.rating.toFixed(1)}
                </span>
                <span className="text-[9px] text-navy/40 font-medium font-sans">
                  ({operator.reviewsCount || operator.tripsCompleted || 0})
                </span>
              </div>
            </div>

            {/* Meta Items: Location & Languages */}
            <div className="flex flex-wrap items-center gap-2.5 text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider text-navy/50">
              {operator.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-safari" />
                  {operator.location}
                </span>
              )}
              {operator.languages && operator.languages.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Languages size={11} className="text-safari" />
                    {operator.languages.slice(0, 3).join(', ')}
                  </span>
                </>
              )}
            </div>

            {/* Bio */}
            <p className="text-navy/60 text-[11px] sm:text-xs leading-relaxed line-clamp-2 font-sans">
              {operator.bio}
            </p>

            {/* Specialties Chips */}
            {operator.specialties && operator.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {operator.specialties.slice(0, 4).map(s => (
                  <span key={s} className="bg-navy/5 text-navy/60 text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-navy/5">
                    {s}
                  </span>
                ))}
                {operator.specialties.length > 4 && (
                  <span className="text-navy/30 text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5">
                    +{operator.specialties.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 pt-2.5 border-t border-navy/5">
            <div className="flex flex-col sm:items-end sm:mr-3">
              <span className="text-[7px] text-navy/30 uppercase font-black tracking-widest leading-none mb-0.5">
                {isCompany ? 'Rates From' : 'Daily Guide Rate'}
              </span>
              <span className="text-navy text-xs sm:text-sm font-bold tracking-tight font-sans">
                Ksh {operator.basePrice.toLocaleString()} {!isCompany && <span className="text-[8.5px] font-normal text-navy/30"> / day</span>}
              </span>
            </div>

            <div className="flex items-center gap-1.5 select-none">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const text = encodeURIComponent(`Hi, I'm interested in booking ${operator.name} on PlacesInKenya!`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-navy/10 hover:border-navy text-navy hover:bg-navy/5 transition-all cursor-pointer"
                title="Contact Operator"
              >
                <MessageCircle size={12} />
              </button>

              <a 
                href={operator.bookingLink || 'about:blank'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-8 px-3.5 bg-navy hover:bg-safari text-white rounded-full flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span className="text-[7.5px] font-black uppercase tracking-wider">{isCompany ? 'Reserve' : 'Book Guide'}</span>
                <Calendar size={11} />
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  const CompanyCard: React.FC<{ operator: TourOperator }> = ({ operator }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex flex-col h-full group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff`} 
          alt={operator.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent font-sans"></div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white font-sans">
           <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-0.5 text-safari mb-0.5">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={8} fill={i < Math.floor(operator.rating) ? "currentColor" : "none"} className="text-safari border-none" />
                 ))}
                 <span className="text-[8px] font-bold text-white/70 ml-1">({operator.reviewsCount || 0})</span>
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold tracking-tight truncate">{operator.name}</h3>
           </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="space-y-3 flex-1">
           {/* Category & Verified Badges outside image div */}
           <div className="flex items-center gap-2">
              <span className="bg-safari/10 text-safari text-[8px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border border-safari/20 select-none">
                Fleet Operator
              </span>
              {operator.isVerified && (
                 <span className="bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 text-[8px] font-black uppercase tracking-wider">
                    <ShieldCheck size={10} className="text-green-600 shrink-0" />
                    Verified
                 </span>
              )}
           </div>

           <p className="text-navy/50 text-xs leading-normal line-clamp-2">
             {operator.bio}
           </p>
           
           <div className="flex flex-wrap gap-1.5 pt-0.5">
              {operator.specialties?.slice(0, 3).map(s => (
                <span key={s} className="bg-navy/5 text-navy/50 text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border border-navy/5 leading-none">
                  {s}
                </span>
              ))}
              {operator.specialties && operator.specialties.length > 3 && (
                <span className="text-navy/20 text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 leading-none">+ {operator.specialties.length - 3}</span>
              )}
           </div>
        </div>

        <div className="pt-3.5 mt-3.5 border-t border-navy/5 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[7.5px] font-black uppercase tracking-widest text-navy/20 leading-none mb-0.5">From</span>
              <span className="text-[14px] sm:text-[15px] font-bold text-navy font-sans leading-none">Ksh {operator.basePrice.toLocaleString()}</span>
           </div>
           <div className="flex gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center bg-navy/5 text-navy/40 rounded-lg hover:bg-safari hover:text-white transition-all border border-transparent cursor-pointer">
                 <MessageCircle size={14} />
              </button>
              <a 
                href={operator.bookingLink || 'about:blank'}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 bg-safari text-white rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1 shadow shadow-safari/10 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Reserve <Calendar size={11} />
              </a>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const GuideCard: React.FC<{ operator: TourOperator }> = ({ operator }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-navy/5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 group"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Pure Avatar image div without absolute badges */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow shadow-navy/5">
           <img 
             src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff&rounded=true`} 
             className="w-full h-full object-cover" 
             alt={operator.name} 
           />
        </div>

        {/* Category & Verified Badges outside avatar image div */}
        <div className="flex items-center gap-2 justify-center flex-wrap">
           <span className="bg-safari/10 text-safari text-[8px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border border-safari/20">
             {operator.title || 'Elite Guide'}
           </span>
           {operator.isVerified && (
              <span className="bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 text-[8px] font-black uppercase tracking-wider">
                 <ShieldCheck size={10} className="text-green-600 shrink-0" />
                 Verified
              </span>
           )}
        </div>

        <div className="space-y-0.5">
           <h3 className="text-base sm:text-[17px] font-serif font-bold text-navy">{operator.name}</h3>
        </div>

        <div className="flex items-center gap-0.5 justify-center text-safari">
           {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < Math.floor(operator.rating) ? "currentColor" : "none"} className="text-safari border-0" />
           ))}
           <span className="text-[9px] font-bold text-navy/30 ml-1.5 uppercase tracking-widest leading-none">({operator.tripsCompleted})</span>
        </div>

        <p className="text-navy/50 text-xs italic line-clamp-2 max-w-xs mx-auto">
          "{operator.bio}"
        </p>

        <div className="w-full space-y-3 pt-2">
           <div className="flex flex-wrap gap-1 justify-center">
              {operator.specialties?.slice(0, 3).map(s => (
                <span key={s} className="bg-navy/5 text-navy/50 text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-navy/5">
                  {s}
                </span>
              ))}
           </div>
           
           <div className="flex items-center justify-center gap-3 text-[8px] text-navy/30 uppercase font-black tracking-widest">
              <div className="flex items-center gap-1 leading-none">
                 <Languages size={10} className="text-safari" />
                 {operator.languages?.slice(0, 2).join(', ')}
              </div>
              <div className="w-0.5 h-0.5 bg-navy/10 rounded-full" />
              <div className="flex items-center gap-1 leading-none">
                 <MapPin size={10} className="text-safari" />
                 {operator.location}
              </div>
           </div>
        </div>

        <div className="w-full pt-3 mt-2 border-t border-navy/5 flex items-center justify-between">
           <div className="text-left font-sans">
              <p className="text-[7.5px] font-black uppercase tracking-widest text-navy/20 leading-none mb-0.5">Standard Rate</p>
              <p className="text-[14px] sm:text-[15px] font-bold text-navy tracking-tight leading-none">Ksh {operator.basePrice.toLocaleString()}<span className="text-[8.5px] font-normal text-navy/30"> / day</span></p>
           </div>
           <div className="flex gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center bg-navy/5 text-navy/40 rounded-lg hover:bg-safari hover:text-white transition-all border border-transparent cursor-pointer">
                 <MessageCircle size={14} />
              </button>
              <a 
                href={operator.bookingLink || 'about:blank'}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 bg-safari text-white rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1 shadow shadow-safari/10 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Book <Calendar size={11} />
              </a>
           </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 select-none">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-navy/5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
           <div className="relative group flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-4 flex items-center text-navy/25 group-focus-within:text-safari transition-colors pointer-events-none">
                 <Search size={16} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search operators or guides..."
                className="w-full h-10 bg-navy/5 hover:bg-navy/10 focus:bg-white focus:ring-1 focus:ring-safari rounded-xl pl-10 pr-4 text-xs text-navy outline-none transition-all placeholder:text-navy/20"
              />
           </div>

           <div 
             className="flex flex-row items-center gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 shrink-0"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
              <div className="flex items-center gap-1 p-1 bg-navy/5 rounded-xl shrink-0">
                 <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3.5 h-8 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'ALL' ? 'bg-white text-navy shadow-sm' : 'text-navy/40 hover:text-navy'}`}
                 > All </button>
                 <button 
                  onClick={() => setActiveTab(OperatorType.COMPANY)}
                  className={`px-3.5 h-8 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === OperatorType.COMPANY ? 'bg-white text-navy shadow-sm' : 'text-navy/40 hover:text-navy'}`}
                 > Companies </button>
                 <button 
                  onClick={() => setActiveTab(OperatorType.INDIVIDUAL)}
                  className={`px-3.5 h-8 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === OperatorType.INDIVIDUAL ? 'bg-white text-navy shadow-sm' : 'text-navy/40 hover:text-navy'}`}
                 > Guides </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                 <select 
                   value={selectedSpecialty}
                   onChange={(e) => setSelectedSpecialty(e.target.value)}
                   className="h-9 bg-navy/5 rounded-xl px-3 text-[8.5px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer border border-transparent hover:border-navy/10"
                 >
                    <option value="ALL">All Specialties</option>
                    {specialties.filter(s => s !== 'ALL').map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
                 </select>
                 <select 
                   value={selectedLocation}
                   onChange={(e) => setSelectedLocation(e.target.value)}
                   className="h-9 bg-navy/5 rounded-xl px-3 text-[8.5px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer border border-transparent hover:border-navy/10"
                 >
                    <option value="ALL">Every Region</option>
                    {locations.filter(l => l !== 'ALL').map(l => <option key={l as string} value={l as string}>{l as string}</option>)}
                 </select>
              </div>
           </div>
        </div>

        {/* Info & View Layout Toggle Bar */}
        <div className="flex items-center justify-between border-t border-navy/5 pt-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-navy/40">
            {filteredOperators.length} {filteredOperators.length === 1 ? 'Partner' : 'Partners & Guides'}
          </span>

          <div className="flex items-center gap-1 bg-navy/5 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-navy shadow-sm' : 'text-navy/30 hover:text-navy'}`}
              title="Horizontal List Presentation"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-navy shadow-sm' : 'text-navy/30 hover:text-navy'}`}
              title="Grid Presentation"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Listing View */}
      <AnimatePresence mode="popLayout">
         {filteredOperators.length > 0 ? (
           <div className="w-full">
             {viewMode === 'list' ? (
               /* Horizontal Listing Presentation */
               <motion.div 
                 className="flex flex-col w-full divide-y divide-navy/10"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
               >
                 {filteredOperators.map(o => (
                   <HorizontalOperatorCard key={o.id} operator={o} />
                 ))}
               </motion.div>
             ) : (
               /* Grid Presentation */
               <motion.div 
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
               >
                 {filteredOperators.map(o => (
                   o.type === OperatorType.COMPANY ? <CompanyCard key={o.id} operator={o} /> : <GuideCard key={o.id} operator={o} />
                 ))}
               </motion.div>
             )}
           </div>
         ) : (
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-navy/10"
           >
             <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center text-navy/10 mb-5">
               <Search size={24} />
             </div>
             <h3 className="text-xl font-serif font-bold text-navy mb-1.5">No Partners Found</h3>
             <p className="text-navy/40 max-w-sm mx-auto text-xs leading-normal mb-6 px-4">
               Our collective is vast, but these specific filters yield no results. Try broadening your criteria.
             </p>
             <button 
               onClick={() => {
                   setSearchQuery('');
                   setSelectedSpecialty('ALL');
                   setSelectedLocation('ALL');
                   setActiveTab('ALL');
               }}
               className="h-10 px-6 bg-navy text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-safari transition-all cursor-pointer"
             > Clear Refinements </button>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
