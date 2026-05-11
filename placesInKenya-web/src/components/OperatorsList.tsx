
import React, { useState, useMemo } from 'react';
import { TourOperator, OperatorType } from '../types';
import { Star, MessageCircle, Calendar, ShieldCheck, Search, Filter, ArrowRight, MapPin, Languages, Briefcase } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] overflow-hidden border border-navy/5 shadow-lux hover:shadow-2xl transition-all duration-500 flex flex-col h-full group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff`} 
          alt={operator.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent"></div>
        
        {operator.isVerified && (
          <div className="absolute top-4 right-4">
             <div className="bg-green-500 text-white px-3 h-7 rounded-full flex items-center gap-1.5 shadow-lg">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
             </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
           <div className="space-y-1">
              <div className="flex items-center gap-1 text-safari">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill={i < Math.floor(operator.rating) ? "currentColor" : "none"} />
                 ))}
                 <span className="text-[10px] font-bold text-white/60 ml-1">({operator.reviewsCount || 0})</span>
              </div>
              <h3 className="text-2xl font-serif font-bold tracking-tight">{operator.name}</h3>
           </div>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="space-y-4 flex-1">
           <p className="text-navy/50 text-sm leading-relaxed line-clamp-2">
             {operator.bio}
           </p>
           
           <div className="flex flex-wrap gap-2">
              {operator.specialties?.slice(0, 3).map(s => (
                <span key={s} className="bg-navy/5 text-navy/40 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-navy/5">
                  {s}
                </span>
              ))}
              {operator.specialties && operator.specialties.length > 3 && (
                <span className="text-navy/20 text-[9px] font-black uppercase tracking-widest px-3 py-1.5">+ {operator.specialties.length - 3} More</span>
              )}
           </div>
        </div>

        <div className="pt-8 mt-8 border-t border-navy/5 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-navy/20 leading-none mb-1">From</span>
              <span className="text-lg font-bold text-navy font-sans">Ksh {operator.basePrice.toLocaleString()}</span>
           </div>
           <div className="flex gap-2">
              <button className="w-12 h-12 flex items-center justify-center bg-navy/5 text-navy/40 rounded-xl hover:bg-safari hover:text-white hover:border-safari transition-all border border-transparent">
                 <MessageCircle size={18} />
              </button>
              <a 
                href={operator.bookingLink || 'about:blank'}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 bg-safari text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 shadow-lg hover:bg-safari-light transition-all shadow-safari/20"
              >
                Reserve Now <Calendar size={14} />
              </a>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const GuideCard: React.FC<{ operator: TourOperator }> = ({ operator }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] p-8 border border-navy/5 shadow-lux hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
              <img 
                src={operator.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(operator.name)}&background=0D1B2A&color=fff&rounded=true`} 
                className="w-full h-full object-cover" 
                alt={operator.name} 
              />
           </div>
           <div className="absolute -inset-2 bg-gradient-to-tr from-safari via-transparent to-navy/10 rounded-full animate-spin-slow z-0 opacity-20" />
           {operator.isVerified && (
             <div className="absolute top-0 right-0 z-20 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <ShieldCheck size={18} />
             </div>
           )}
        </div>

        <div className="space-y-2">
           <h3 className="text-2xl font-serif font-bold text-navy">{operator.name}</h3>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-safari">{operator.title}</p>
        </div>

        <div className="flex items-center gap-1 justify-center text-safari">
           {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(operator.rating) ? "currentColor" : "none"} />
           ))}
           <span className="text-[11px] font-bold text-navy/30 ml-2 uppercase tracking-widest">({operator.tripsCompleted} Trips)</span>
        </div>

        <p className="text-navy/50 text-sm italic line-clamp-2 max-w-xs mx-auto">
          "{operator.bio}"
        </p>

        <div className="w-full space-y-4 pt-4">
           <div className="flex flex-wrap gap-2 justify-center">
              {operator.specialties?.slice(0, 3).map(s => (
                <span key={s} className="bg-navy/5 text-navy/50 text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-navy/5">
                  {s}
                </span>
              ))}
           </div>
           
           <div className="flex items-center justify-center gap-4 text-[9px] text-navy/30 uppercase font-black tracking-widest">
              <div className="flex items-center gap-1.5">
                 <Languages size={12} className="text-safari" />
                 {operator.languages?.join(', ')}
              </div>
              <div className="w-1 h-1 bg-navy/10 rounded-full" />
              <div className="flex items-center gap-1.5">
                 <MapPin size={12} className="text-safari" />
                 {operator.location}
              </div>
           </div>
        </div>

        <div className="w-full pt-8 mt-4 border-t border-navy/5 flex items-center justify-between">
           <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20 leading-none mb-1">Standard Rate</p>
              <p className="text-lg font-bold text-navy font-sans tracking-tight">Ksh {operator.basePrice.toLocaleString()}<span className="text-xs font-normal text-navy/30"> / day</span></p>
           </div>
           <div className="flex gap-2">
              <button className="w-12 h-12 flex items-center justify-center bg-navy/5 text-navy/40 rounded-2xl hover:bg-safari hover:text-white transition-all">
                 <MessageCircle size={20} />
              </button>
              <a 
                href={operator.bookingLink || 'about:blank'}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 bg-safari text-white rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 shadow-lg hover:bg-safari-light transition-all shadow-safari/20"
              >
                Book {operator.name.split(' ')[0]} <Calendar size={14} />
              </a>
           </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-16">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-lux border border-navy/5 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
           <div className="md:col-span-4 relative group">
              <div className="absolute inset-y-0 left-6 flex items-center text-navy/20 group-focus-within:text-safari transition-colors">
                 <Search size={20} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or specialty..."
                className="w-full h-16 bg-navy/5 hover:bg-navy/10 focus:bg-white focus:ring-2 focus:ring-safari/20 rounded-2xl pl-16 pr-6 text-navy font-medium outline-none transition-all placeholder:text-navy/20"
              />
           </div>

           <div className="md:col-span-8 flex flex-wrap items-center gap-4 justify-end">
              <div className="flex items-center gap-2 p-1.5 bg-navy/5 rounded-2xl">
                 <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-white text-navy shadow-sm' : 'text-navy/40 hover:text-navy'}`}
                 > All </button>
                 <button 
                  onClick={() => setActiveTab(OperatorType.COMPANY)}
                  className={`px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === OperatorType.COMPANY ? 'bg-white text-navy shadow-sm' : 'text-navy/40 hover:text-navy'}`}
                 > Companies </button>
                 <button 
                  onClick={() => setActiveTab(OperatorType.INDIVIDUAL)}
                  className={`px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === OperatorType.INDIVIDUAL ? 'bg-white text-navy shadow-sm' : 'text-navy/40 hover:text-navy'}`}
                 > Guides </button>
              </div>

              <div className="flex items-center gap-4">
                 <select 
                   value={selectedSpecialty}
                   onChange={(e) => setSelectedSpecialty(e.target.value)}
                   className="h-14 bg-navy/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer border border-transparent hover:border-navy/10"
                 >
                    <option value="ALL">All Specialties</option>
                    {specialties.filter(s => s !== 'ALL').map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
                 </select>
                 <select 
                   value={selectedLocation}
                   onChange={(e) => setSelectedLocation(e.target.value)}
                   className="h-14 bg-navy/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer border border-transparent hover:border-navy/10"
                 >
                    <option value="ALL">In Every Region</option>
                    {locations.filter(l => l !== 'ALL').map(l => <option key={l as string} value={l as string}>{l as string}</option>)}
                 </select>
              </div>
           </div>
        </div>
      </div>

      {/* Grid Rendering */}
      <AnimatePresence mode="popLayout">
         {filteredOperators.length > 0 ? (
           <motion.div 
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           >
             {filteredOperators.map(o => (
               o.type === OperatorType.COMPANY ? <CompanyCard key={o.id} operator={o} /> : <GuideCard key={o.id} operator={o} />
             ))}
           </motion.div>
         ) : (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-[60px] border border-dashed border-navy/10"
           >
             <div className="w-24 h-24 bg-navy/5 rounded-full flex items-center justify-center text-navy/10 mb-8">
               <Search size={48} />
             </div>
             <h3 className="text-3xl font-serif font-bold text-navy mb-4">No Partners Found</h3>
             <p className="text-navy/40 max-w-sm mx-auto text-lg leading-relaxed mb-8">
               Our collective is vast, but these specific filters yield no results. Try broadening your criteria.
             </p>
             <button 
               onClick={() => {
                   setSearchQuery('');
                   setSelectedSpecialty('ALL');
                   setSelectedLocation('ALL');
                   setActiveTab('ALL');
               }}
               className="h-16 px-10 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-safari transition-all"
             > Clear Refinements </button>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
