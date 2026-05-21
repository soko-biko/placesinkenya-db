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
    <section className="py-12 sm:py-20 md:py-24 bg-off-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.slice(0, 3).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] hover:-translate-y-[4px] transition-all duration-[400ms] flex flex-col h-full border border-navy/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[400ms] ease-out" />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md px-3 h-8 rounded-lg flex flex-col items-center justify-center shadow-lg border border-navy/5">
                    <span className="text-[8px] font-black text-safari leading-none">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-xs font-bold text-navy leading-none mt-0.5">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 mb-4">
                  <div>
                    <span className="bg-safari hover:bg-safari/90 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 h-6 inline-flex items-center rounded-full shadow-md border border-white/10">
                      {event.category?.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-[0.9375rem] sm:text-base lg:text-[1.0625rem] font-serif font-bold text-navy group-hover:text-safari transition-colors leading-tight">{event.title}</h3>
                  <p className="text-navy/60 text-[0.8125rem] sm:text-sm leading-relaxed line-clamp-2 font-sans">{event.description}</p>
                </div>
                
                <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-navy/40">
                        <MapPin size={12} className="text-safari" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{event.location}</span>
                    </div>
                    <div className="text-navy font-bold text-sm">
                        from ${event.price}
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
