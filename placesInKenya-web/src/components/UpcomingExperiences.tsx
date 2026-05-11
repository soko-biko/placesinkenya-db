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
    <section className="py-24 md:py-32 bg-off-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-safari font-black uppercase tracking-[0.3em] text-[10px]">Upcoming Events</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy leading-tight">Elite Experiences</h2>
          </div>
          <button 
            onClick={onViewAll}
            className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 hover:text-safari transition-colors"
          >
            View All Events <div className="w-10 h-10 rounded-full border border-navy/5 flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-all"><ArrowRight size={16} /></div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.slice(0, 3).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] overflow-hidden shadow-lux group hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 h-10 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black text-safari leading-none">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-sm font-bold text-navy leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
              </div>
              <div className="p-10 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-safari font-black uppercase tracking-[0.2em] text-[10px] bg-safari/5 px-4 h-8 inline-flex items-center rounded-full">
                    {event.category?.replace('_', ' ')}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-navy group-hover:text-safari transition-colors leading-tight">{event.title}</h3>
                  <p className="text-navy/50 text-sm font-medium line-clamp-2 leading-relaxed">{event.description}</p>
                </div>
                
                <div className="pt-6 border-t border-navy/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-navy/40">
                        <MapPin size={14} className="text-safari" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{event.location}</span>
                    </div>
                    <div className="text-navy font-black text-sm">
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
