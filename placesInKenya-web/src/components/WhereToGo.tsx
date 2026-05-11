
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { Event } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { EventDetailModal } from './EventDetailModal';

interface WhereToGoProps {
  events: Event[];
  onAddToTrip: (event: Event) => void;
  savedItemIds: string[];
}

export const WhereToGo: React.FC<WhereToGoProps> = ({ events, onAddToTrip, savedItemIds }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['ALL', 'FESTIVALS', 'FOOD_DRINK', 'ADVENTURES', 'CULTURE', 'WILDLIFE'];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate current week view based on selectedDate
  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const displayedEvents = useMemo(() => {
    return events.filter(e => {
      const eDate = new Date(e.date);
      const isSameDay = eDate.toDateString() === selectedDate.toDateString();
      const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
      return isSameDay && matchesCat;
    });
  }, [events, selectedDate, selectedCategory]);

  const nearestEvent = useMemo(() => {
    if (displayedEvents.length > 0) return null;
    return events
      .filter(e => new Date(e.date) >= selectedDate && (selectedCategory === 'ALL' || e.category === selectedCategory))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events, selectedDate, selectedCategory, displayedEvents]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };

  const jumpToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  const moveWeek = (direction: number) => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(next);
  };

  return (
    <div className="min-h-screen bg-off-white pb-32">
      {/* Dynamic Header Area */}
      <section className="relative pt-40 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547448415-e9f5b28e570d"
            className="w-full h-full object-cover opacity-20 grayscale mix-blend-overlay"
            alt="Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy to-navy"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="space-y-4">
             <motion.span 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               className="text-safari font-black uppercase tracking-[0.4em] text-[10px]"
             >
               Temporal Explorations
             </motion.span>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tight"
             >
               Ways to <span className="italic text-safari font-light">Experience</span> Kenya
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
               className="text-white/40 max-w-2xl mx-auto text-lg font-light italic"
             >
               Discover a curated sequence of events, from mountain bikes in the valley to jazz festivals in the city.
             </motion.p>
          </div>
        </div>
      </section>

      {/* Navigator & Filters Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-y border-navy/5 shadow-lux pb-2">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Row: Year/Month Selector + Today Button */}
          <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-6">
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => {
                       const m = parseInt(e.target.value);
                       setSelectedMonth(m);
                       const d = new Date(selectedDate);
                       d.setMonth(m);
                       setSelectedDate(d);
                    }}
                    className="appearance-none bg-navy/5 hover:bg-navy/10 h-10 px-6 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer transition-all"
                  >
                    {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" size={12} />
               </div>
               <div className="relative group">
                  <select 
                    value={selectedYear}
                    onChange={(e) => {
                        const y = parseInt(e.target.value);
                        setSelectedYear(y);
                        const d = new Date(selectedDate);
                        d.setFullYear(y);
                        setSelectedDate(d);
                    }}
                    className="appearance-none bg-navy/5 hover:bg-navy/10 h-10 px-6 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer transition-all"
                  >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" size={12} />
               </div>
               <button 
                onClick={jumpToToday}
                className="h-10 px-6 rounded-xl bg-safari text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-safari/20 transition-all active:scale-95"
               >
                 Today
               </button>
            </div>

            <div className="flex items-center gap-2">
               <button onClick={() => moveWeek(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-navy/5 hover:bg-navy hover:text-white transition-all"><ChevronLeft size={18} /></button>
               <div className="flex items-center gap-2 px-6 h-10 bg-navy/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-navy/40">
                  <Calendar size={14} className="text-safari" />
                  Week of {weekDays[0].toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
               </div>
               <button onClick={() => moveWeek(1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-navy/5 hover:bg-navy hover:text-white transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Middle Row: Week Navigator Pills */}
          <div className="grid grid-cols-7 gap-3 py-4 border-t border-navy/5">
            {weekDays.map((day, i) => {
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                    <button 
                        key={i}
                        onClick={() => handleDayClick(day)}
                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[20px] transition-all relative overflow-hidden ${isSelected ? 'bg-navy text-white shadow-2xl scale-105 z-10' : 'bg-navy/5 text-navy/40 hover:bg-navy/10'}`}
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{daysOfWeek[day.getDay()]}</span>
                        <span className="text-xl font-serif font-bold">{day.getDate()}</span>
                        {isToday && !isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-safari rounded-full" />}
                        {isSelected && <motion.div layoutId="selection-bubble" className="absolute inset-0 bg-navy -z-10" />}
                    </button>
                )
            })}
          </div>

          {/* Bottom Row: Category Toggles */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-4 mt-2 border-t border-navy/5">
            {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative group py-2"
                >
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${selectedCategory === cat ? 'text-navy' : 'text-navy/30 group-hover:text-navy/60'}`}>
                        {cat.replace('_', ' & ')}
                    </span>
                    {selectedCategory === cat && (
                        <motion.div 
                          layoutId="cat-indicator" 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-safari flex items-center justify-center"
                        >
                            <div className="w-1 h-1 bg-safari rotate-45" />
                        </motion.div>
                    )}
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-32">
            <AnimatePresence mode="wait">
                {displayedEvents.length > 0 ? (
                    <motion.div 
                        key={selectedDate.toISOString()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                        {displayedEvents.map(event => (
                            <ExperienceCard 
                                key={event.id}
                                event={event}
                                onClick={() => setSelectedEvent(event)}
                                isSaved={savedItemIds.includes(event.id)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center text-center space-y-12 bg-white rounded-[60px] border border-dashed border-navy/10 px-8"
                    >
                        <div className="w-24 h-24 bg-navy/5 rounded-full flex items-center justify-center text-navy/10 relative">
                            <Calendar size={48} />
                            <div className="absolute inset-0 animate-ping bg-navy/5 rounded-full scale-150 opacity-20" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-serif font-bold text-navy">No Experiences Today</h3>
                            <p className="text-navy/40 max-w-sm mx-auto text-lg leading-relaxed">
                                The temporal currents are calm on this day. Explore a different date or discover our nearest upcoming wonder.
                             </p>
                        </div>
                        
                        {nearestEvent && (
                            <div className="bg-cream/30 p-10 rounded-[40px] border border-navy/5 space-y-6 max-w-lg w-full">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-safari">Next Curated Discovery</span>
                                <div className="flex gap-6 items-center text-left">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-xl">
                                        <img src={nearestEvent.imageUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-serif font-bold text-navy leading-tight">{nearestEvent.title}</h4>
                                        <p className="text-xs font-bold text-safari uppercase tracking-widest">
                                            {new Date(nearestEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                  onClick={() => handleDayClick(new Date(nearestEvent.date))}
                                  className="w-full h-16 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-safari transition-all"
                                >
                                    Jump to this Experience
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedEvent && (
            <EventDetailModal 
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                isSaved={savedItemIds.includes(selectedEvent.id)}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ExperienceCardProps {
    event: Event;
    onClick: () => void;
    isSaved: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ event, onClick, isSaved }) => {
    const isFull = event.bookedCapacity >= event.totalCapacity;
    const capacityPercent = (event.bookedCapacity / event.totalCapacity) * 100;
    const spotsLeft = event.totalCapacity - event.bookedCapacity;

    return (
        <motion.div 
            onClick={onClick}
            whileHover={{ y: -10 }}
            className="group bg-white rounded-[40px] overflow-hidden shadow-lux hover:shadow-2xl transition-all duration-700 cursor-pointer border border-navy/5 flex flex-col h-full"
        >
            <div className="relative aspect-video overflow-hidden">
                <img src={event.imageUrl} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Date Badge Overlay */}
                <div className="absolute top-6 left-6 flex flex-col items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl border border-navy/5">
                    <span className="text-[10px] font-black uppercase text-safari">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    <span className="text-2xl font-serif font-bold text-navy leading-none">{new Date(event.date).getDate()}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 right-6">
                    <span className="bg-navy/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 h-8 flex items-center rounded-xl border border-white/10 shadow-xl">
                        {event.category.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="p-10 space-y-8 flex-1 flex flex-col">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-navy/30">
                        <MapPin size={12} className="text-safari" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{event.location}</span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-navy group-hover:text-safari transition-colors leading-tight line-clamp-2">
                        {event.title}
                    </h3>
                </div>

                {/* Capacity UI */}
                <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                        <span className="text-navy/30">Exclusivity Gauge</span>
                        <span className={spotsLeft < 10 ? 'text-red-500' : 'text-safari'}>
                            {spotsLeft} spots left of {event.totalCapacity}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-navy/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${capacityPercent}%` }}
                          className={`h-full transition-all duration-1000 ${spotsLeft < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-safari shadow-[0_0_10px_rgba(232,98,26,0.3)]'}`}
                        />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 border-t border-navy/5 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/30 leading-none mb-1">Pass From</span>
                        <span className="text-2xl font-bold text-navy font-sans tracking-tight">Ksh {event.price.toLocaleString()}</span>
                    </div>
                    
                    <button className="h-14 px-8 bg-navy group-hover:bg-safari text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95">
                        <span className="text-[10px] font-black uppercase tracking-widest">Reserve My Spot</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ChevronDown = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
      className={className} 
      width={size || 24} height={size || 24} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
);
