import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Container } from './Container';
import { Card } from './Card';
import { useSiteSettings } from '../hooks/useFirestore';

interface UpcomingExperiencesProps {
  events: Event[];
  onViewAll: () => void;
}

export const UpcomingExperiences: React.FC<UpcomingExperiencesProps> = ({ events, onViewAll }) => {
  const { settings } = useSiteSettings();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <section className="py-8 sm:py-12 bg-off-white relative">
      {settings.eventsBgImage && (
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
          <img src={settings.eventsBgImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 md:mb-8">
          <div className="space-y-1">
            <span className="text-safari font-semibold uppercase tracking-wider text-xs">Upcoming Events</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy tracking-tight leading-tight">
              {settings.eventsTitle || 'Elite Experiences'}
            </h2>
            {settings.eventsSubtitle && (
              <p className="text-navy/70 text-sm font-normal max-w-xl">
                {settings.eventsSubtitle}
              </p>
            )}
          </div>
          <button 
            type="button"
            onClick={onViewAll}
            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-navy/60 hover:text-safari transition-colors shrink-0 cursor-pointer"
          >
            View All Events <div className="w-8 h-8 rounded-full border border-navy/10 flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-all"><ArrowRight size={14} /></div>
          </button>
        </div>

        {/* Responsive dual layouts: list on mobile, grid cards on big screens */}
        <div className="w-full">
          {/* Mobile View: List layout */}
          <div className="flex flex-col w-full divide-y divide-navy/10 md:hidden">
            {events.slice(0, 6).map((event, i) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                onClick={onViewAll}
                className="py-6 border-b border-navy/10 last:border-b-0 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-navy/[0.01] transition-all duration-200 group cursor-pointer w-full"
              >
                {/* Event Image Zone */}
                <div className="relative w-full sm:w-32 md:w-40 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden shrink-0 z-0">
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'} 
                    alt={event.title} 
                    loading="lazy"
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="bg-navy/80 backdrop-blur-md text-white font-black text-[7px] uppercase tracking-widest px-2 h-5 flex items-center border border-white/5 select-none">
                      {event.category?.replace('_', ' ')}
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
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-sm sm:text-base text-navy leading-snug group-hover:text-safari transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-navy/60 text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Price & Bottom Action Row inside Card */}
                  <div className="mt-3 pt-3 border-t border-navy/5 flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">Tickets from</span>
                      <span className="text-navy text-sm font-bold font-sans tracking-tight">Ksh {(event.price * 130).toLocaleString()}</span>
                    </div>

                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewAll();
                      }}
                      className="h-8 px-3.5 bg-navy hover:bg-safari text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all select-none"
                    >
                      <span>Reserve Spot</span>
                      <ArrowRight size={9} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Desktop/Tablet View: Beautiful Card Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                onClick={onViewAll}
                className="bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex flex-col h-full group cursor-pointer"
              >
                {/* Event Image Zone - 16:9 Aspect Ratio */}
                <div className="relative w-full aspect-[16/9] overflow-hidden shrink-0">
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'} 
                    alt={event.title} 
                    loading="lazy"
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="absolute top-2.5 left-2.5 z-10 w-max">
                    <span className="bg-navy/80 backdrop-blur-md text-white font-semibold text-xs uppercase tracking-wider px-2.5 py-0.5 flex items-center border border-white/5 select-none rounded-full">
                      {event?.category?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Event Content & Actions Zone */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                  <div className="space-y-1.5 flex-1">
                    {/* Meta items - text-xs metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-navy/50 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-safari font-bold">
                        <Calendar size={11} />
                        {new Date(event.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-safari" />
                        {event.location}
                      </span>
                    </div>

                    {/* Title - h3: text-base font-bold */}
                    <h3 className="font-serif font-bold text-base text-navy leading-snug group-hover:text-safari transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    {/* Description - text-sm body */}
                    <p className="text-navy/70 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Price & Bottom Action Row inside Card */}
                  <div className="mt-4 pt-3 border-t border-navy/5 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">Tickets from</span>
                      <span className="text-navy text-xs font-bold font-sans tracking-tight">Ksh {(event.price * 130).toLocaleString()}</span>
                    </div>

                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewAll();
                      }}
                      className="h-7 px-2.5 bg-navy hover:bg-safari text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-all select-none"
                    >
                      <span>Reserve</span>
                      <ArrowRight size={8} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
