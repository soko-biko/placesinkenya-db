import React from 'react';
import { X, MapPin, Calendar, Users, Star, Share2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { Event } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  isSaved: boolean;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, isSaved }) => {
  const isFull = event.bookedCapacity >= event.totalCapacity;
  const spotsLeft = event.totalCapacity - event.bookedCapacity;
  const capacityPercent = (event.bookedCapacity / event.totalCapacity) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl scrollbar-hide"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="flex flex-col">
          {/* Hero Section */}
          <div className="relative h-[400px] md:h-[500px]">
            <img 
              src={event.imageUrl} 
              className="w-full h-full object-cover" 
              alt={event.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"></div>
            
            <div className="absolute bottom-12 left-12 right-12 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="bg-safari rounded-full px-5 h-8 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {event.category.replace('_', ' ')}
                </span>
                <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 h-8 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight max-w-3xl">
                {event.title}
              </h2>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 md:p-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold text-navy">About the Experience</h3>
                <p className="text-navy/60 text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Photo Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/30">Visual Preview</h4>
                   <div className="grid grid-cols-2 gap-4">
                      {event.gallery.map((img, i) => (
                        <div key={i} className="aspect-video rounded-3xl overflow-hidden shadow-lg group">
                          <img 
                            src={img} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={`Gallery ${i}`} 
                          />
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Organizer Card */}
              {event.organizer && (
                <div className="bg-cream/50 rounded-[40px] p-10 flex flex-col md:flex-row gap-8 items-center border border-navy/5">
                   <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0">
                      <img src={event.organizer.logo} className="w-full h-full object-cover" alt="Organizer" />
                   </div>
                   <div className="space-y-4 text-center md:text-left flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                         <h4 className="text-xl font-serif font-bold text-navy">{event.providerName}</h4>
                         <div className="flex items-center justify-center md:justify-start gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < event.organizer!.rating ? "fill-safari text-safari" : "text-navy/10"} />
                            ))}
                         </div>
                      </div>
                      <p className="text-navy/50 text-sm italic font-medium">"{event.organizer.bio}"</p>
                      <button className="text-[10px] font-black uppercase tracking-[0.3em] text-safari flex items-center gap-2 hover:translate-x-2 transition-transform">
                         View Professional Profile <ArrowRight size={12} />
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Sticky on desktop */}
            <div className="lg:col-span-5 space-y-8 h-fit lg:sticky lg:top-8">
              <div className="bg-navy rounded-[40px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-safari/10 rounded-bl-[60px]"></div>
                
                <div className="space-y-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-safari">Entry Secured By</span>
                   <p className="text-4xl font-serif font-bold tracking-tight">Ksh {event.price.toLocaleString()}</p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      <span>Limited Availability</span>
                      <span className={spotsLeft < 10 ? 'text-red-500' : 'text-safari'}>{spotsLeft} spots remaining</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${capacityPercent}%` }} 
                        className={`h-full transition-all duration-1000 ${spotsLeft < 20 ? 'bg-red-500' : 'bg-safari'}`} 
                      />
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-safari">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Location</p>
                       <p className="font-bold text-sm tracking-tight">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-safari">
                       <Calendar size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Date & Time</p>
                       <p className="font-bold text-sm tracking-tight">Starts at 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-safari">
                       <Users size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Interest</p>
                       <p className="font-bold text-sm tracking-tight">{event.interestedCount || 0} people viewing</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                   <a 
                     href={event.bookingLink || 'about:blank'}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={`w-full h-20 bg-safari hover:bg-safari-light text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all shadow-safari/20 active:scale-95 flex items-center justify-center gap-4 group ${isFull ? 'pointer-events-none opacity-50 grayscale' : ''}`}
                   >
                     {isFull ? 'Sold Out' : (
                       <>Reserve My Spot <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></>
                     )}
                   </a>
                   
                   <div className="flex gap-4">
                      <button className="flex-1 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 transition-colors border border-white/5 group">
                        <Share2 size={16} className="text-white/40 group-hover:text-safari" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Broadcast</span>
                      </button>
                      <button className="flex-1 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 transition-colors border border-white/5 group">
                        <ExternalLink size={16} className="text-white/40 group-hover:text-safari" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Get Map</span>
                      </button>
                   </div>
                </div>
              </div>

              {/* Secure Booking Badge */}
              <div className="p-8 border border-navy/5 rounded-[40px] flex items-center gap-4 text-navy/30">
                 <ShieldCheck size={24} className="text-safari" />
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    Verified collective event. <br />
                    Secure payment & instant confirmation.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
