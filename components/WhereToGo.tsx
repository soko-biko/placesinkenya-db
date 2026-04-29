
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Star, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Event } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface WhereToGoProps {
  events: Event[];
  onAddToTrip: (event: Event) => void;
  savedItemIds: string[];
}

export const WhereToGo: React.FC<WhereToGoProps> = ({ events, onAddToTrip, savedItemIds }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [baseDate, setBaseDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      return date;
    });
  }, [baseDate]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
    }).sort((a, b) => b.registrations - a.registrations);
  }, [events, selectedMonth, selectedYear]);

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(e => {
      const eventDate = new Date(e.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2024, 2025, 2026];

  const moveDate = (days: number) => {
    setBaseDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + days);
      return next;
    });
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-navy">Planned Events</h1>
          <p className="text-navy/40 text-lg md:text-xl font-light">Your curated calendar of Kenyan experiences.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-navy p-4 rounded-[2.5rem] shadow-2xl shadow-navy/30">
          <div className="relative group">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="appearance-none bg-white/5 text-white font-black uppercase tracking-widest text-[10px] pl-5 pr-10 py-3 rounded-xl outline-none cursor-pointer border border-white/10 hover:border-safari transition-all"
            >
              {months.map((m, i) => (
                <option key={m} value={i} className="bg-navy">{m}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-white/40 pointer-events-none group-hover:text-safari transition-colors" size={16} />
          </div>

          <div className="relative group">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="appearance-none bg-white/5 text-white font-black uppercase tracking-widest text-[10px] pl-5 pr-10 py-3 rounded-xl outline-none cursor-pointer border border-white/10 hover:border-safari transition-all"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-navy">{y}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-white/40 pointer-events-none group-hover:text-safari transition-colors" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => moveDate(-7)}
                className="p-4 bg-navy rounded-2xl hover:bg-safari text-white transition-all shadow-xl shadow-navy/10 active:scale-90"
                title="Previous Week"
             >
               <ChevronLeft size={24} />
             </button>
             <button 
                onClick={() => moveDate(-1)}
                className="p-4 bg-navy rounded-2xl hover:bg-safari text-white transition-all shadow-xl shadow-navy/10 active:scale-90"
                title="Previous Day"
             >
               <ChevronLeft size={18} />
             </button>
          </div>
          
          <div className="text-center px-8">
             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-safari mb-1">Weekly Itinerary</p>
             <p className="text-2xl font-bold font-serif text-navy">
                {baseDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
             </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => moveDate(1)}
                className="p-4 bg-navy rounded-2xl hover:bg-safari text-white transition-all shadow-xl shadow-navy/10 active:scale-90"
                title="Next Day"
             >
               <ChevronRight size={18} />
             </button>
             <button 
                onClick={() => moveDate(7)}
                className="p-4 bg-navy rounded-2xl hover:bg-safari text-white transition-all shadow-xl shadow-navy/10 active:scale-90"
                title="Next Week"
             >
               <ChevronRight size={24} />
             </button>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-7 gap-6">
          {weekDays.map((day, idx) => (
            <div key={idx} className="space-y-6">
              <div className={`text-center p-8 rounded-[2rem] transition-all flex flex-col items-center justify-center border ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'bg-safari text-white border-safari shadow-2xl shadow-safari/30' : 'bg-navy text-white border-white/5'}`}>
                <p className={`text-[10px] uppercase font-black tracking-widest mb-2 ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'text-white/80' : 'text-safari'}`}>{daysOfWeek[day.getDay()].slice(0, 3)}</p>
                <p className="text-4xl font-bold font-serif">{day.getDate()}</p>
              </div>
              
              <div className="space-y-6">
                {getEventsForDate(day).map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onAdd={onAddToTrip} 
                    isSaved={savedItemIds.includes(event.id)}
                  />
                ))}
                {getEventsForDate(day).length === 0 && (
                  <div className="py-16 border-2 border-dashed border-navy/10 rounded-[2.5rem] flex flex-col items-center justify-center opacity-30 group hover:opacity-100 transition-opacity">
                    <Calendar size={32} className="mb-3 text-navy/40" />
                    <p className="text-[10px] uppercase font-black tracking-widest text-navy">Open Slot</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-12">
          {weekDays.map((day, idx) => (
            <div key={idx} className="space-y-6">
              <div className={`flex items-center gap-6 p-6 rounded-[2rem] border ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'bg-safari text-white border-safari animate-pulse' : 'bg-navy text-white border-white/5 shadow-xl'}`}>
                <div className={`px-6 py-4 rounded-2xl text-center min-w-[90px] shadow-2xl ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'bg-white text-safari' : 'bg-safari text-white'}`}>
                  <p className="text-[10px] font-black uppercase opacity-80">{daysOfWeek[day.getDay()].slice(0, 3)}</p>
                  <p className="text-3xl font-bold font-serif">{day.getDate()}</p>
                </div>
                <div>
                  <h3 className="font-bold text-2xl font-serif">{months[day.getMonth()]} {day.getFullYear()}</h3>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-black ${day.getDate() === new Date().getDate() ? 'text-white/80' : 'text-safari'}`}>
                    {getEventsForDate(day).length} PLANNED EXPERIENCES
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {getEventsForDate(day).map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onAdd={onAddToTrip} 
                    isSaved={savedItemIds.includes(event.id)}
                  />
                ))}
              </div>
              {getEventsForDate(day).length === 0 && (
                  <div className="py-12 border-2 border-dashed border-navy/10 rounded-[2.5rem] flex items-center justify-center opacity-30">
                    <p className="text-[10px] uppercase font-black tracking-widest text-navy">No plans currently scheduled</p>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  event: Event;
  onAdd: (e: Event) => void;
  isSaved: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onAdd, isSaved }) => {
  const isFull = event.bookedCapacity >= event.totalCapacity;
  const capacityPercent = Math.min(100, (event.bookedCapacity / event.totalCapacity) * 100);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none overflow-hidden border border-white/5 group bg-navy/60 backdrop-blur-xl hover:border-safari/50 transition-all flex h-[280px] shadow-3xl shadow-navy/60 relative"
    >
      {/* Content Section - Left */}
      <div className="flex-1 p-8 flex flex-col justify-between z-10 text-white bg-gradient-to-r from-navy/40 to-transparent">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-xl font-serif font-bold group-hover:text-safari transition-colors leading-tight line-clamp-1">{event.title}</h4>
            <div className="flex items-center gap-2 text-white/40 text-[10px]">
              <MapPin size={12} className="text-safari" />
              <span className="uppercase font-bold tracking-tight">{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-safari/10 border border-safari/20 py-2 px-3 rounded-xl flex items-center gap-3 shrink-0">
               <Calendar size={14} className="text-safari" />
               <div className="flex flex-col">
                 <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Date</span>
                 <span className="text-[10px] font-bold font-serif">{new Date(event.date).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
               </div>
            </div>

            <div className="flex-1 space-y-1.5">
               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/30">
                  <span>Capacity</span>
                  <span className={isFull ? 'text-red-500' : 'text-safari'}>{isFull ? 'SOLD' : `${Math.round(capacityPercent)}%`}</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${capacityPercent}%` }} className={`h-full ${isFull ? 'bg-red-500' : 'bg-safari'}`} />
               </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase font-black tracking-widest leading-none mb-1">{event.providerName}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] text-white/30 font-black">KSH</span>
                <p className="text-2xl font-bold font-serif text-white">{event.price.toLocaleString()}</p>
              </div>
            </div>
            <button 
              onClick={() => onAdd(event)}
              disabled={isFull && !isSaved}
              className={`p-3 rounded-xl transition-all active:scale-95 border border-white/10 shadow-xl ${isSaved ? 'bg-green-600 text-white' : 'bg-safari text-white hover:bg-safari-light'}`}
            >
              {isSaved ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
            </button>
        </div>
      </div>

      {/* Image Section - Right */}
      <div className="w-1/3 h-full relative overflow-hidden shrink-0 group-hover:w-[32%] transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-navy/10 to-transparent z-10"></div>
        <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-navy/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-white border border-white/10">
            {event.category?.replace('_', ' ')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
