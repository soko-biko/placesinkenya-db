import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Users, Star, Share2, ShieldCheck, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Event } from '../types';
import { motion } from 'motion/react';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  isSaved: boolean;
  onAddToTrip?: (event: Event) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, isSaved, onAddToTrip }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'capacity' | 'organizer'>('overview');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isFull = event.bookedCapacity >= event.totalCapacity;
  const spotsLeft = event.totalCapacity - event.bookedCapacity;
  const capacityPercent = (event.bookedCapacity / event.totalCapacity) * 100;

  // Lock body scroll while modal is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close when hitting escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    // ── Overlay: Dark blurred layout background with z-index elevated to 9999 ──
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-navy/95 backdrop-blur-md sm:backdrop-blur-lg" onClick={onClose}></div>
      
      {/* ── Modal Main Frame ── */}
      <div className="relative bg-white w-full sm:w-[600px] md:w-[640px] lg:w-[640px] h-auto max-h-[calc(100vh-120px)] sm:max-h-[85vh] lg:max-h-[80vh] overflow-hidden rounded-t-[2.5rem] sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-navy/5 animate-slide-up flex flex-col text-navy">
        
        {/* ══ SECTION A: IMAGE HERO ZONE ══════════════════════════════════════ */}
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/8] shrink-0 max-h-[25vh] sm:max-h-[30vh]">
          <img 
            src={event.imageUrl || '/placeholder.jpg'} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          
          {/* Close button top right */}
          <button 
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 p-2.5 bg-black/40 backdrop-blur-md hover:bg-safari rounded-full text-white transition-all border border-white/10 active:scale-90 cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="bg-safari text-white text-[9px] font-black uppercase tracking-[0.2em] px-3.5 h-6 rounded-full flex items-center shadow-lg">
              {event.category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* ══ SECTION B: TITLE & METRICS ZONE ═════════════════════════════ */}
        <div className="px-5 sm:px-6 pt-3.5 pb-2 shrink-0">
          <h2 className="font-serif font-bold text-[clamp(1.15rem,2.8vw,1.6rem)] leading-snug text-navy line-clamp-1">
            {event.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[clamp(0.72rem,1.8vw,0.85rem)] text-navy/60">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-safari" />
              {event.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-navy">
              <Calendar size={12} className="text-safari" />
              {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* ══ SECTION C: SCROLLABLE EXPERIENCE DETAIL ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 no-scrollbar">
          
          {/* Tabs Selector row */}
          <div className="flex border-b border-navy/10 shrink-0 mb-3 gap-2 sticky top-0 bg-white z-10 pb-2">
            {[
              { id: 'overview', label: 'About Experience' },
              { id: 'capacity', label: 'Availability' },
              { id: 'organizer', label: 'Organizer' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1 px-1 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-safari text-safari font-extrabold' 
                    : 'border-transparent text-navy/40 hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content Dynamic Area */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-3">
                <p className="text-[clamp(0.78rem,1.8vw,0.92rem)] text-navy/75 leading-relaxed font-light">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[9px] font-black bg-navy/5 border border-navy/5 uppercase tracking-widest px-3 h-7 flex items-center rounded-full text-navy/60">
                    🎟 Entry fee: Ksh {event.price.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-black bg-navy/5 border border-navy/5 uppercase tracking-widest px-3 h-7 flex items-center rounded-full text-navy/60">
                    🏆 Verified Collective Event
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'capacity' && (
              <div className="space-y-3 flex flex-col justify-start">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-navy/50">
                  <span>Spots allocated: {event.totalCapacity}</span>
                  <span className={spotsLeft < 15 ? 'text-red-500 font-bold' : 'text-safari'}>{spotsLeft} remaining</span>
                </div>
                
                {/* Visual Capacity gauge */}
                <div className="h-2 w-full bg-navy/5 rounded-full overflow-hidden shrink-0">
                  <div 
                    style={{ width: `${capacityPercent}%` }}
                    className={`h-full transition-all duration-700 ${spotsLeft < 15 ? 'bg-red-500' : 'bg-safari'}`} 
                  />
                </div>

                <div className="p-3 bg-navy/5 rounded-[20px] flex items-center gap-3 text-navy/60 text-xs leading-normal">
                  <ShieldCheck size={18} className="text-safari shrink-0" />
                  <p className="text-[10px] uppercase font-bold tracking-wide">
                    Verified real-time capacity counter. Secure your ticket immediately to guarantee entry.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'organizer' && (
              <div className="space-y-3.5 flex flex-col">
                {event.organizer ? (
                  <div className="flex items-center gap-3 bg-navy/5 p-3.5 rounded-[24px]">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                      <img src={event.organizer.logo || "/placeholder.jpg"} className="w-full h-full object-cover" alt="Organizer" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-serif font-bold text-xs text-navy leading-none">{event.providerName}</span>
                        <div className="flex text-safari shrink-0"><Star size={10} fill="currentColor" /></div>
                      </div>
                      <p className="text-[10px] text-navy/50 mt-1 italic">
                        "{event.organizer.bio || 'Verified Host of Local Experiences'}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-navy/10 p-3 text-center text-xs text-navy/30 italic">
                    Registered through overall PlacesInKenya platform provider framework.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══ SECTION D: RESERVATIONS AND ACTIONS (BOTTOM STICKY) ═════ */}
        <div className="px-5 sm:px-6 pt-2 pb-4.5 sm:pb-5 border-t border-navy/5 bg-white flex flex-col gap-2 shrink-0 shadow-inner z-20">
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2.5 text-green-700 mb-1"
            >
              <CheckCircle2 size={16} className="text-green-600 shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] font-bold">Successfully registered!</p>
                <p className="text-[9.5px] text-green-600/80">Added to your My Kenya library. Follow the reservation link to complete payment.</p>
              </div>
            </motion.div>
          )}
          <div className="flex gap-2 sm:gap-3 items-center">
            
            {/* Primary Reserve Button */}
            <a 
              href={event.bookingLink || 'https://wa.me/254700000000'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onAddToTrip?.(event);
                setShowSuccess(true);
              }}
              className={`flex-1 h-11 bg-safari hover:bg-safari/95 text-white rounded-full font-black uppercase text-[10px] tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${isFull ? 'pointer-events-none opacity-40 grayscale' : ''}`}
            >
              <ExternalLink size={12} />
              <span>{isFull ? 'Sold Out' : 'Reserve My Spot'}</span>
            </a>

            {/* Broadcast action button */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`Join me at "${event.title}" on PlacesInKenya! 🇰🇪`);
                alert('Event share link copied!');
              }}
              className="px-4.5 h-11 bg-navy/5 hover:bg-navy/10 text-navy rounded-full text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 size={12} className="text-safari" />
              <span>Share</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
