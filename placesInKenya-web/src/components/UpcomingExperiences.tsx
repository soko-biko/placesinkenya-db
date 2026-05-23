import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface UpcomingExperiencesProps {
  events: Event[];
  onViewAll: () => void;
}

export const UpcomingExperiences: React.FC<UpcomingExperiencesProps> = ({ events, onViewAll }) => {
  return (
    <section className="py-12 sm:py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 md:mb-14">
          <div className="space-y-3">
            <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">Upcoming Events</span>
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-serif font-bold text-navy tracking-tight leading-tight">Elite Experiences</h2>
          </div>
          <button 
            onClick={onViewAll}
            className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 hover:text-safari transition-colors shrink-0"
          >
            View All Events <div className="w-10 h-10 rounded-full border border-navy/5 flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-all"><ArrowRight size={16} /></div>
          </button>
        </div>

        {/* Horizontal scroll on mobile, responsive grid on desktop */}
        <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 snap-x no-scrollbar">
          {events.slice(0, 6).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[270px] sm:min-w-0 snap-center w-full"
            >
              <div className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col h-full relative border border-navy/5">
                {/* Image Section - aspect-[4/3] matching PlaceCard */}
                <div className="relative aspect-[4/3] overflow-hidden bg-navy/5 shrink-0">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-safari text-white text-[8px] font-black uppercase tracking-[0.15em] px-2.5 h-6 flex items-center rounded-full shadow border border-white/10 select-none">
                      {event.category?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <div className="bg-white/90 backdrop-blur-md px-2.5 h-8 rounded-lg flex flex-col items-center justify-center shadow-md border border-navy/5">
                      <span className="text-[7px] font-black text-safari leading-none">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                      <span className="text-xs font-bold text-navy leading-none mt-0.5">{new Date(event.date).getDate()}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section - matching PlaceCard sizes */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <div className="space-y-1.5 flex-1">
                    <div className="space-y-0.5">
                      <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-navy tracking-tight line-clamp-1 leading-tight group-hover:text-safari transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1 text-navy/40">
                        <MapPin size={9} className="text-safari" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] truncate">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-navy/60 text-[11.5px] sm:text-xs leading-normal line-clamp-2 font-sans-serif">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-navy/5">
                    <div className="flex flex-col">
                      <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">Tickets from</span>
                      <span className="text-navy text-sm font-bold font-sans tracking-tight">Ksh {(event.price * 130).toLocaleString()}</span>
                    </div>
                    <button className="h-7.5 px-2.5 sm:px-3 bg-navy text-white rounded-full flex items-center justify-center gap-1 transition-all hover:bg-safari shadow cursor-pointer text-[7.5px] sm:text-[8px] font-black uppercase tracking-normal sm:tracking-wider whitespace-nowrap shrink-0">
                      <span>Reserve Spot</span>
                      <ArrowRight size={9} className="shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
