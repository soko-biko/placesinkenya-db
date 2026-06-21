import React, { useState, useMemo } from 'react';
import { TourOperator, OperatorType } from '../types';
import { Star, MessageCircle, Calendar, ShieldCheck, Search, MapPin, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OperatorsListProps {
  operators: TourOperator[];
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operators }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [activeTab, setActiveTab] = useState<OperatorType | 'ALL'>('ALL');

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
        
        {operator.isVerified && (
          <div className="absolute top-2.5 right-2.5">
             <div className="bg-green-500 text-white px-2.5 h-6 rounded-full flex items-center gap-1 shadow">
                <ShieldCheck size={10} />
                <span className="text-[7.5px] font-black uppercase tracking-widest">Verified</span>
             </div>
          </div>
        )}

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
        <div className="relative">
           <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow shadow-navy/5 relative z-10">
              <img 
                src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff&rounded=true`} 
                className="w-full h-full object-cover" 
                alt={operator.name} 
              />
           </div>
           {operator.isVerified && (
             <div className="absolute top-0 right-0 z-20 w-6.5 h-6.5 bg-green-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow">
                <ShieldCheck size={11} />
             </div>
           )}
        </div>

        <div className="space-y-0.5">
           <h3 className="text-base sm:text-[17px] font-serif font-bold text-navy">{operator.name}</h3>
           <p className="text-[8px] font-black uppercase tracking-[0.2em] text-safari leading-none">{operator.title}</p>
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

  const MobileOperatorListItem: React.FC<{ operator: TourOperator }> = ({ operator }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-5 flex gap-4 items-start w-full border-b border-navy/10 last:border-b-0"
    >
      {/* Left Side: Image/Avatar */}
      <div className="relative shrink-0 select-none">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-navy/5 border border-navy/5">
          <img 
            src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff`} 
            alt={operator.name}
            className="w-full h-full object-cover"
          />
        </div>
        {operator.isVerified && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
            <ShieldCheck size={11} />
          </div>
        )}
      </div>

      {/* Right Side: Info and CTA */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[7.5px] font-black uppercase tracking-widest text-safari leading-none block mb-0.5">
                {operator.type === OperatorType.COMPANY ? 'Featured Fleet' : operator.title || 'Elite Guide'}
              </span>
              <h3 className="text-sm font-serif font-bold text-navy truncate leading-none">
                {operator.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-0.5 text-safari shrink-0">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-bold text-navy ml-1 leading-none">
                {operator.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-navy/60 text-[11px] leading-relaxed line-clamp-1 pr-2">
            {operator.bio}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-navy/5 pt-1.5">
          <div>
            <span className="text-[11px] font-bold text-navy font-sans leading-none">
              Ksh {operator.basePrice.toLocaleString()} {operator.type === OperatorType.INDIVIDUAL && <span className="text-[8.5px] font-normal text-navy/30"> / day</span>}
            </span>
          </div>

          <div className="flex gap-1 shrink-0 select-none">
            <button className="w-7.5 h-7.5 flex items-center justify-center bg-navy/5 text-navy/40 rounded-lg hover:bg-safari hover:text-white transition-all cursor-pointer">
              <MessageCircle size={12} />
            </button>
            <a 
              href={operator.bookingLink || 'about:blank'}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7.5 px-3 bg-safari text-white rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1 shadow shadow-safari/10 hover:opacity-90 transition-opacity cursor-pointer"
            >
              Book <Calendar size={11} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 select-none">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-navy/5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
           <div className="relative group flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-4 flex items-center text-navy/25 group-focus-within:text-safari transition-colors pointer-events-none">
                 <Search size={16} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partners..."
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
      </div>

      {/* Responsive Layout Representation */}
      <AnimatePresence mode="popLayout">
         {filteredOperators.length > 0 ? (
           <div className="w-full">
             {/* Mobile View: List-based Layout */}
             <motion.div 
               className="flex flex-col w-full divide-y divide-navy/5 md:hidden"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
               {filteredOperators.map(o => (
                 <MobileOperatorListItem key={o.id} operator={o} />
               ))}
             </motion.div>

             {/* Big Screen View: Grid of Cards Layout */}
             <motion.div 
               className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
               {filteredOperators.map(o => (
                 o.type === OperatorType.COMPANY ? <CompanyCard key={o.id} operator={o} /> : <GuideCard key={o.id} operator={o} />
               ))}
             </motion.div>
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
