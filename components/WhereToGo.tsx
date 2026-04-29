
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
      whileHover={{ y: -6 }}
      className="rounded-[2rem] overflow-hidden border border-white/5 group bg-navy hover:border-safari/50 transition-all flex flex-col shadow-2xl shadow-navy/30 h-full"
    >
      <div className="h-32 overflow-hidden relative shrink-0">
        <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
        <div className="absolute top-3 right-3 bg-navy/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1 text-white">
           <Star size={10} className="text-yellow-500" fill="currentColor" /> Featured
        </div>
      </div>
      
      <div className="p-4 space-y-3 flex-1 flex flex-col text-white">
        <div className="space-y-1">
          <p className="text-[8px] font-black text-safari uppercase tracking-[0.3em]">{event.category === 'EATS_ENT' ? 'Eats & Ent' : event.category?.replace('_', ' ')}</p>
          <h4 className="text-lg font-serif font-bold line-clamp-1 group-hover:text-safari transition-colors">{event.title}</h4>
          <div className="flex items-center gap-2 text-white/50 text-[10px]">
            <MapPin size={12} className="text-safari" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        
        <p className="text-[11px] text-white/50 line-clamp-2 flex-1 leading-tight font-light">
          {event.description}
        </p>

        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="space-y-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-white/40">
             <div className="flex justify-between">
                <span>Registrations</span>
                <span className={isFull ? 'text-red-500' : 'text-safari'}>{isFull ? 'FULL' : `${event.bookedCapacity}/${event.totalCapacity}`}</span>
             </div>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${capacityPercent}%` }} className={`h-full ${isFull ? 'bg-red-500' : 'bg-safari'}`} />
             </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <p className="text-[8px] text-white/30 uppercase font-bold tracking-[0.05em] line-clamp-1">{event.providerName}</p>
              <p className="text-lg font-bold font-serif text-white">Ksh {event.price.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => onAdd(event)}
              disabled={isFull}
              className={`p-3 rounded-xl ${isSaved ? 'bg-green-600 text-white' : 'bg-white/5 hover:bg-safari text-white/40 hover:text-white'} transition-all hover:scale-105 active:scale-95 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl`}
            >
              {isSaved ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
