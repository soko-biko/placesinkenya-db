
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
  const [selectedEventCat, setSelectedEventCat] = useState<string>('ALL');
  const [showEmpty, setShowEmpty] = useState(false);
  const [baseDate, setBaseDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const eventCategories = ['ALL', 'FESTIVALS', 'FOOD & DRINK', 'LIVE MUSIC', 'SPORT', 'CULTURE & ART', 'FAMILY'];

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
      const matchesDate = eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
      const matchesCat = selectedEventCat === 'ALL' || e.category?.toUpperCase() === selectedEventCat;
      return matchesDate && matchesCat;
    }).sort((a, b) => b.registrations - a.registrations);
  }, [events, selectedMonth, selectedYear, selectedEventCat]);

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

  const emptyDatesCount = weekDays.filter(day => getEventsForDate(day).length === 0).length;

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="sticky top-[72px] bg-cream/98 z-30 pt-8 pb-4 -mx-4 px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-navy/5 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-navy">Ways to Experience Kenya</h1>
          <p className="text-navy/40 text-sm md:text-base font-medium">Plan your days with top-rated local events.</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-navy/5">
            <div className="relative group">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="appearance-none bg-navy/5 text-navy font-bold uppercase tracking-widest text-[9px] pl-4 pr-8 py-2 rounded-xl outline-none cursor-pointer border border-transparent hover:border-safari transition-all"
              >
                {months.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="appearance-none bg-navy/5 text-navy font-bold uppercase tracking-widest text-[9px] pl-4 pr-8 py-2 rounded-xl outline-none cursor-pointer border border-transparent hover:border-safari transition-all"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-2 -mx-4 px-4 w-screen md:w-auto">
            {eventCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedEventCat(cat)}
                className={`shrink-0 px-5 h-9 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${selectedEventCat === cat ? 'bg-navy text-white' : 'bg-white text-navy/40 border border-navy/5 hover:border-navy/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[200px_1fr] gap-12">
        {/* Navigation Sidebar (Desktop) / Header (Mobile) */}
        <div className="lg:sticky lg:top-[200px] h-fit space-y-8 mb-12 lg:mb-0">
          <div className="flex lg:flex-col items-center justify-between lg:items-start gap-4">
            <div className="flex items-center gap-2">
               <button 
                  onClick={() => moveDate(-7)}
                  className="w-11 h-11 bg-navy rounded-full hover:bg-safari text-white transition-all flex items-center justify-center shadow-md active:scale-90"
                  title="Previous Week"
               >
                 <ChevronLeft size={20} />
               </button>
               <button 
                  onClick={() => moveDate(7)}
                  className="w-11 h-11 bg-navy rounded-full hover:bg-safari text-white transition-all flex items-center justify-center shadow-md active:scale-90"
                  title="Next Week"
               >
                 <ChevronRight size={20} />
               </button>
            </div>
            
            <div className="lg:pt-4">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-safari mb-1">Schedule</p>
               <p className="text-xl font-bold font-serif text-navy leading-tight">
                  {baseDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}<br className="hidden lg:block" /> - <br className="hidden lg:block" />{weekDays[6].toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
               </p>
            </div>
          </div>
        </div>

        {/* Main Content: Event List */}
        <div className="space-y-12">
          {weekDays.map((day, idx) => {
            const dayEvents = getEventsForDate(day);
            const isEmpty = dayEvents.length === 0;
            
            if (isEmpty && !showEmpty) return null;

            return (
              <div key={idx} className="space-y-6">
                <div className={`flex items-center gap-6 p-5 rounded-2xl border ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'bg-safari/5 border-safari/20' : 'bg-white border-navy/5 shadow-sm'}`}>
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-sm border ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'bg-safari text-white border-safari' : 'bg-navy text-white border-navy'}`}>
                    <p className="text-[9px] font-black uppercase opacity-80">{daysOfWeek[day.getDay()].slice(0, 3)}</p>
                    <p className="text-xl font-bold font-serif">{day.getDate()}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-navy">{months[day.getMonth()]} {day.getFullYear()}</h3>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-navy/40">
                      {isEmpty ? 'No events scheduled' : `${dayEvents.length} Experience${dayEvents.length > 1 ? 's' : ''} Found`}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dayEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onAdd={onAddToTrip} 
                      isSaved={savedItemIds.includes(event.id)}
                    />
                  ))}
                </div>
                
                {isEmpty && (
                  <div className="py-8 border-2 border-dashed border-navy/10 rounded-2xl flex items-center justify-center opacity-50">
                    <p className="text-[10px] uppercase font-black tracking-widest text-navy">Empty Slot</p>
                  </div>
                )}
              </div>
            );
          })}

          {emptyDatesCount > 0 && (
            <button 
              onClick={() => setShowEmpty(!showEmpty)}
              className="w-full py-4 text-xs font-bold text-navy/40 hover:text-navy transition-colors border-t border-navy/5 mt-8"
            >
              {showEmpty ? 'Hide empty days' : `Show dates with no plans (${emptyDatesCount})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<EventCardProps> = ({ event, onAdd, isSaved }) => {
  const isFull = event.bookedCapacity >= event.totalCapacity;
  const capacityPercent = Math.min(100, (event.bookedCapacity / event.totalCapacity) * 100);

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="flex flex-col bg-white border border-navy/5 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all cursor-pointer group text-navy w-full h-full relative"
    >
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
        
        {/* Category Badge inside card bounding box */}
        <div className="absolute top-3 left-3 overflow-hidden rounded text-white">
          <span className="bg-navy text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 shadow-md border border-white/10">
            {event.category?.replace('_', ' ')}
          </span>
        </div>
        
        <div className="absolute bottom-3 right-3 bg-white px-2.5 py-1.5 rounded-lg border border-navy/10 text-[10px] font-bold font-serif text-safari shadow-sm">
           {new Date(event.date).toLocaleDateString([], { day: 'numeric', month: 'short' })}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="space-y-1">
          <h4 className="font-bold text-base leading-tight text-navy group-hover:text-safari transition-colors line-clamp-1">{event.title}</h4>
          <div className="flex items-center gap-2 text-[11px] text-navy/40 font-medium font-sans">
            <MapPin size={10} className="text-safari shrink-0" />
            <span className="truncate uppercase tracking-tight">{event.location}</span>
          </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-navy/40">
              <span className="flex items-center gap-1"><Users size={10} /> Capacity</span>
              <span className={isFull ? 'text-red-500' : 'text-safari'}>{isFull ? 'FULLY BOOKED' : `Capacity: ${Math.round(capacityPercent)}%`}</span>
           </div>
           <div className="h-1.5 w-full bg-navy/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${capacityPercent}%` }} className={`h-full ${isFull ? 'bg-red-500' : 'bg-safari'}`} />
           </div>
        </div>

        <div className="pt-4 border-t border-navy/5 flex items-center justify-between mt-auto">
           <div className="flex flex-col">
              <span className="text-[10px] text-navy/30 uppercase font-bold tracking-widest leading-none mb-1">{event.providerName}</span>
              <p className="text-base font-bold text-navy">Ksh {event.price.toLocaleString()}</p>
           </div>
           <button 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(event);
              }}
              disabled={isFull && !isSaved}
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-95 border border-navy/5 shadow-sm ${isSaved ? 'bg-green-600 text-white' : 'bg-safari text-white hover:bg-safari-light'}`}
            >
              {isSaved ? <CheckCircle2 size={20} /> : <PlusCircle size={20} />}
            </button>
        </div>
      </div>
    </motion.div>
  );
};
