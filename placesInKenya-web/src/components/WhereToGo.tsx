import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock, Smile, Sparkles, Star, Users, ArrowRight, ShieldCheck, Search, Loader2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Event } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { EventDetailModal } from './EventDetailModal';
import { Container } from './Container';
import { useSiteSettings } from '../hooks/useFirestore';

interface WhereToGoProps {
  events: Event[];
  onAddToTrip: (event: Event) => void;
  savedItemIds: string[];
}


const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WhereToGo: React.FC<WhereToGoProps> = ({ events, onAddToTrip, savedItemIds }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { settings } = useSiteSettings();


  // Initialize selectedDate to today
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Calendar navigation state
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const categories = ['ALL', 'FESTIVALS', 'FOOD_DRINK', 'ADVENTURES', 'CULTURE', 'WILDLIFE'];

  // Days in current viewMonth
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Helper arrays for dates
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDayIndex });

  // Get date strings with events for dot indicators
  const eventDatesSet = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      const d = new Date(e.date);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return set;
  }, [events]);

  const hasEventOnDate = (day: number) => {
    return eventDatesSet.has(`${viewYear}-${viewMonth}-${day}`);
  };

  const isSelectedDate = (day: number) => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === viewMonth &&
           selectedDate.getFullYear() === viewYear;
  };

  const isTodayDate = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === viewMonth &&
           today.getFullYear() === viewYear;
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
  };

  const handleJumpToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  // Filter events based on active filters
  const displayedEvents = useMemo(() => {
    return events.filter(e => {
      const eDate = new Date(e.date);
      const isSameDay = eDate.getDate() === selectedDate.getDate() &&
                         eDate.getMonth() === selectedDate.getMonth() &&
                         eDate.getFullYear() === selectedDate.getFullYear();
      const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
      return isSameDay && matchesCat;
    });
  }, [events, selectedDate, selectedCategory]);

  // Nearest event logic
  const nearestUpcomingEvent = useMemo(() => {
    if (displayedEvents.length > 0) return null;
    return events
      .filter(e => {
        const eDate = new Date(e.date);
        eDate.setHours(0,0,0,0);
        const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
        return eDate >= selectedDate && matchesCat;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events, selectedDate, selectedCategory, displayedEvents]);

  return (
    <div className="min-h-screen bg-off-white pb-32">
      {/* Dynamic Header Area */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 bg-navy overflow-hidden">
        <div id="events-header-bg" className="absolute inset-0 z-0">
          <img 
            src={settings.eventsBgImage || "https://images.unsplash.com/photo-1547448415-e9f5b28e570d"}
            className="w-full h-full object-cover opacity-20 grayscale mix-blend-overlay transition-all duration-700"
            alt="Scenic Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy to-navy"></div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-safari font-black uppercase tracking-[0.4em] text-[10px] truncate max-w-full block"
          >
            Temporal Excursions
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight"
          >
            {settings.eventsTitle || "Ways to Experience Kenya"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-sm sm:text-base font-light italic line-clamp-1"
          >
            {settings.eventsSubtitle || "A sequence of scheduled prestige events, from athletic safaris to jazz festivals in the city."}
          </motion.p>
        </div>
      </section>


      {/* Main Dual-Panel Layout Container */}
      <Container className="py-10 md:py-14 space-y-8" id="events-main">
        {/* Events category filter chips */}
        <div 
          className="flex flex-row gap-2 overflow-x-auto pb-2 scrollbar-none w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 h-9 px-5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-150 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-navy text-white border-navy shadow-sm'
                  : 'bg-white text-navy/65 border-navy/5 hover:border-safari'
              }`}
            >
              {cat.replace('_', ' & ')}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* LEFT COLUMN: Sticky Calendar Date Picker & Filter Set */}
          <aside className="w-full lg:w-[320px] lg:sticky lg:top-24 shrink-0 space-y-8">
            
            {/* Calendar Block Container */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-navy/5 p-5 select-none">
              
              {/* Header Navigator */}
              <div className="flex items-center justify-between mb-4 border-b border-navy/5 pb-3">
                <button 
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-navy/5 text-navy transition-colors active:scale-90"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-serif font-bold text-sm tracking-tight text-navy">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-navy/5 text-navy transition-colors active:scale-90"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2 text-center text-[10px] font-black uppercase tracking-wider text-navy/30">
                {DAYS_SHORT.map(day => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                {/* Pad out empty spaces */}
                {emptyCells.map((_, i) => (
                  <div key={`empty-${i}`} className="w-8 h-8" />
                ))}

                {/* Day Buttons */}
                {daysArray.map(day => {
                  const sel = isSelectedDate(day);
                  const isT = isTodayDate(day);
                  const hasEv = hasEventOnDate(day);

                  return (
                    <button
                      key={day}
                      onClick={() => handleDaySelect(day)}
                      className={`relative mx-auto w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        sel 
                          ? 'bg-navy text-white shadow-md' 
                          : isT 
                          ? 'border-2 border-safari text-safari' 
                          : 'text-navy hover:bg-navy/5'
                      }`}
                    >
                      <span>{day}</span>
                      {/* Active Event Dot */}
                      {hasEv && !sel && (
                        <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-safari" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Jump to Today Button */}
              <button
                onClick={handleJumpToToday}
                className="mt-5 w-full h-9 bg-navy/5 text-navy hover:bg-navy hover:text-white transition-all text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5"
              >
                <Calendar size={12} className="text-safari" />
                <span>Jump To Today</span>
              </button>
            </div>



          </aside>

          {/* RIGHT COLUMN: Interactive Events Listing Panel */}
          <section className="flex-1 w-full min-w-0">
            
            {/* List Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-navy/5 pb-4 mb-6 gap-3">
              <div className="space-y-0.5">
                <h2 className="font-serif font-bold text-lg md:text-xl text-navy">
                  Expeditions on {selectedDate.toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <p className="text-xs text-navy/40">
                  Curated premium live schedule matching selections
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-navy/5 text-navy/60 h-7 px-3 rounded-full flex items-center w-max">
                {displayedEvents.length} Active {displayedEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {displayedEvents.length > 0 ? (
                <div key="events-responsive-wrapper" className="w-full">
                  {/* Mobile View: Clean full-width list layout */}
                  <div className="space-y-4 lg:hidden divide-y divide-navy/10">
                    {displayedEvents.map(event => {
                      const spotsLeft = event.totalCapacity - event.bookedCapacity;
                      const isFull = spotsLeft <= 0;
                      const itemIsSaved = savedItemIds.includes(event.id);

                      return (
                        <motion.article 
                          key={event.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="py-5 border-b border-navy/10 last:border-b-0 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-navy/[0.01] transition-all duration-200 group cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {/* Event Image Zone */}
                          <div className="relative w-full sm:w-32 md:w-40 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-navy/5 shrink-0 z-0">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                            />
                            <div className="absolute top-1.5 left-1.5 z-10">
                              <span className="bg-navy/80 backdrop-blur-md text-white font-black text-[7px] uppercase tracking-widest px-2 h-5 flex items-center border border-white/5 select-none">
                                {event.category.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Event Content & Actions Zone */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="space-y-1.5">
                              {/* Meta items */}
                              <div className="flex flex-wrap items-center gap-3 text-[10px] text-navy/50 font-semibold uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-safari font-black">
                                  <Calendar size={11} />
                                  {new Date(event.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', weekday: 'short' })}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} className="text-safari" />
                                  {event.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={11} className="text-safari" />
                                  {event.time || 'All Day'}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-serif font-bold text-sm sm:text-base text-navy leading-snug group-hover:text-safari transition-colors line-clamp-1">
                                {event.title}
                              </h3>

                              {/* Short bio if existing, or description */}
                              <p className="text-navy/60 text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2">
                                {event.description}
                              </p>
                            </div>

                            {/* Capacity Indicator & Bottom Action Row inside Card */}
                            <div className="mt-3 pt-3 border-t border-navy/5 flex flex-row items-center justify-between gap-4">
                              
                              {/* Exclusivity spotsLeft gauge */}
                              <div className="space-y-1 flex-1 max-w-[160px] hidden sm:block">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-wider text-navy/40">
                                  <span>Spots remaining</span>
                                  <span className={spotsLeft < 10 ? 'text-red-500' : 'text-safari'}>
                                    {isFull ? 'Sold Out' : `${spotsLeft} / ${event.totalCapacity}`}
                                  </span>
                                </div>
                                <div className="h-1 bg-navy/5 rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: `${Math.min(100, (event.bookedCapacity / event.totalCapacity) * 100)}%` }}
                                    className={`h-full transition-all duration-[600ms] ${spotsLeft < 10 ? 'bg-red-500' : 'bg-safari'}`}
                                  />
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex items-center justify-end gap-2 shrink-0 ml-auto select-none">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToTrip(event);
                                  }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                                    itemIsSaved 
                                      ? 'bg-safari/15 border-safari text-safari' 
                                      : 'border-navy/10 hover:border-navy text-navy hover:bg-navy/5'
                                  }`}
                                  title={itemIsSaved ? "Saved" : "Save to Trip"}
                                >
                                  {itemIsSaved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}
                                  className="h-8 px-3 bg-navy hover:bg-safari text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                                >
                                  <span>Book Pass</span>
                                  <ArrowRight size={9} />
                                </button>
                              </div>

                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>

                  {/* Desktop/Tablet View: Pristine Grid Cards layout */}
                  <div className="hidden lg:grid lg:grid-cols-2 gap-6">
                    {displayedEvents.map(event => {
                      const spotsLeft = event.totalCapacity - event.bookedCapacity;
                      const isFull = spotsLeft <= 0;
                      const itemIsSaved = savedItemIds.includes(event.id);

                      return (
                        <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.98, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex flex-col h-full group cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {/* Event Image Zone */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-navy/5 shrink-0">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 z-10 w-max">
                              <span className="bg-navy/80 backdrop-blur-md text-white font-black text-[7.5px] uppercase tracking-widest px-2.5 h-6 flex items-center border border-white/5 select-none rounded-full">
                                {event.category.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Event Content & Actions Zone */}
                          <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                            <div className="space-y-1.5 flex-1">
                              {/* Meta items */}
                              <div className="flex flex-wrap items-center gap-2.5 text-[9px] text-navy/50 font-semibold uppercase tracking-wider font-sans">
                                <span className="flex items-center gap-1 text-safari font-black">
                                  <Calendar size={10} />
                                  {new Date(event.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} className="text-safari" />
                                  {event.location}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-serif font-bold text-sm text-navy leading-snug group-hover:text-safari transition-colors line-clamp-1">
                                {event.title}
                              </h3>

                              {/* Description */}
                              <p className="text-navy/60 text-[11px] leading-relaxed line-clamp-2">
                                {event.description}
                              </p>

                              {/* Custom gauge */}
                              <div className="space-y-1 pt-2 w-full">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-wider text-navy/40">
                                  <span>Spots remaining</span>
                                  <span className={spotsLeft < 10 ? 'text-red-500' : 'text-safari'}>
                                    {isFull ? 'Sold Out' : `${spotsLeft} / ${event.totalCapacity}`}
                                  </span>
                                </div>
                                <div className="h-1 bg-navy/5 rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: `${Math.min(100, (event.bookedCapacity / event.totalCapacity) * 100)}%` }}
                                    className={`h-full transition-all duration-[600ms] ${spotsLeft < 10 ? 'bg-red-500' : 'bg-safari'}`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Actions and Pricing Footer */}
                            <div className="mt-4 pt-3 border-t border-navy/5 flex items-center justify-between gap-2 select-none">
                              <div className="flex flex-col">
                                <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">Tickets from</span>
                                <span className="text-navy text-xs font-bold font-sans tracking-tight">Ksh {(event.price * 130).toLocaleString()}</span>
                              </div>

                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToTrip(event);
                                  }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                                    itemIsSaved 
                                      ? 'bg-safari/15 border-safari text-safari' 
                                      : 'border-navy/10 hover:border-navy text-navy hover:bg-navy/5'
                                  }`}
                                  title={itemIsSaved ? "Saved" : "Save to Trip"}
                                >
                                  {itemIsSaved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}
                                  className="h-8 px-3 bg-navy hover:bg-safari text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                                >
                                  <span>Book Pass</span>
                                  <ArrowRight size={9} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <motion.div 
                  key="no-events-view"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="py-16 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-2xl border border-dashed border-navy/10 px-6 shadow-sm"
                >
                  <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center text-navy/10 relative">
                    <Calendar size={32} />
                    <div className="absolute inset-0 animate-ping bg-navy/5 rounded-full scale-110 opacity-15" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-navy">No Scheduled Expeditions</h3>
                    <p className="text-navy/40 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
                      No matching premium events are scheduled for this date. Check our nearest upcoming discovery below or select another date.
                    </p>
                  </div>

                  {nearestUpcomingEvent && (
                    <div className="bg-cream/30 p-5 sm:p-6 rounded-xl border border-navy/5 space-y-4 max-w-md w-full text-left mt-4 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-safari block">Nearest Upcoming Discovery</span>
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 border-white shadow-md">
                          <img src={nearestUpcomingEvent.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-navy leading-normal line-clamp-1">{nearestUpcomingEvent.title}</h4>
                          <p className="text-[10px] font-black text-safari uppercase tracking-wider">
                            {new Date(nearestUpcomingEvent.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const nDate = new Date(nearestUpcomingEvent.date);
                          setSelectedDate(nDate);
                          setViewMonth(nDate.getMonth());
                          setViewYear(nDate.getFullYear());
                        }}
                        className="w-full h-9 bg-navy hover:bg-safari hover:scale-[1.01] text-white rounded-lg font-black uppercase tracking-widest text-[9px] transition-all"
                      >
                        Navigate to this day
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </section>

        </div>
      </Container>

      {/* Modals */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal 
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            isSaved={savedItemIds.includes(selectedEvent.id)}
            onAddToTrip={onAddToTrip}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
