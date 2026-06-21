import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Users, Briefcase, PlusCircle, ExternalLink, Clock, DollarSign, MessageCircle, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { Place, TourOperator, OperatorType, SavedItem } from '../types';
import { motion } from 'motion/react';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
  onAddToTrip: (place: Place, date?: string) => void;
  onExploreOperators: (tags: string[]) => void;
  onAddReview: (rating: number, comment: string, placeId: string) => void;
  savedItem?: SavedItem;
  operators: TourOperator[];
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ 
  place, 
  onClose, 
  onAddToTrip, 
  onExploreOperators, 
  onAddReview, 
  savedItem, 
  operators 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guides' | 'reviews'>('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [plannedDate, setPlannedDate] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const isSaved = !!savedItem;
  const isCompleted = savedItem?.completed;

  // Lock body scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmitReview = () => {
    if (comment.trim()) {
      onAddReview(rating, comment, place.id);
      setShowReviewForm(false);
      setComment('');
    }
  };

  const safariOperators = operators.filter(
    o => o.specialties?.includes('Safari') || o.type === OperatorType.COMPANY
  );

  return (
    // ── Overlay: Covers full screen, raised z-index to 150 to override bottom navigation bars ──
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-navy/95 backdrop-blur-md sm:backdrop-blur-lg" onClick={onClose}></div>
      
      {/* ── Popup Panel ──
          Width and height adapt perfectly to mobile sheet / centered modal sizes with max-height limits.
          Use overflow-hidden so scroll is constrained to the center scrollable zone.
      */}
      <div className="relative bg-navy w-full sm:w-[600px] md:w-[640px] lg:w-[640px] h-auto max-h-[calc(100vh-120px)] sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/5 animate-slide-up text-white flex flex-col overflow-hidden">
        
        {/* ══ SECTION A: IMAGE & HERO ══════════════════════════════════════ */}
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/8] shrink-0 max-h-[25vh] sm:max-h-[30vh]">
          <img 
            src={place.imageUrl || '/placeholder.jpg'} 
            alt={place.name}
            className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent"></div>
          
          {/* Close button inside image frame (as requested) */}
          <button 
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 p-2.5 bg-black/40 backdrop-blur-md hover:bg-safari rounded-full text-white transition-all border border-white/10 hover:border-white active:scale-90"
          >
            <X size={16} />
          </button>

          {/* Category Badge on the bottom left of the image */}
          {place.category && (
            <span className="absolute bottom-4 left-4 bg-safari text-white text-[9px] font-black uppercase tracking-[0.2em] px-3.5 h-6 rounded-full flex items-center border border-white/15">
              {place.category.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* ══ SECTION B: TITLE & METRICS ════════════════════════════════ */}
        <div className="px-5 sm:px-6 pt-3.5 pb-2 shrink-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-serif font-bold text-[clamp(1.15rem,2.8vw,1.6rem)] leading-tight text-white line-clamp-1">
              {place.name}
            </h2>
            <div className="flex items-center gap-1.5 text-yellow-500 bg-white/5 px-2.5 h-6 rounded-full border border-white/10 shrink-0 text-xs font-bold">
              <Star size={12} fill="currentColor" />
              <span>{place.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[clamp(0.72rem,1.8vw,0.85rem)] text-white/50">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-safari" />
              {place.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-safari" />
              7AM - 6PM Best Time
            </span>
            <span>•</span>
            <span className="text-safari font-semibold">● Family Friendly</span>
          </div>
        </div>

        {/* ══ SECTION C: SCROLLABLE EXPERIENCE PORTAL ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 no-scrollbar">
          
          {/* Tab Selector Buttons */}
          <div className="flex border-b border-white/10 shrink-0 mb-3 gap-2 sticky top-0 bg-navy z-10 pb-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'guides', label: 'Guides' },
              { id: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'reviews') setShowReviewForm(false);
                }}
                className={`pb-1 px-1 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-safari text-safari font-extrabold' 
                    : 'border-transparent text-white/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Panel Content */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-3">
                <p className="text-[clamp(0.78rem,1.8vw,0.92rem)] text-white/70 leading-relaxed font-light">
                  {place.description}
                </p>
                
                {/* Information Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[9px] font-black bg-white/5 border border-white/5 uppercase tracking-widest px-3 h-7 flex items-center rounded-full text-white/60">
                    💵 Ksh {(place.price || 1500).toLocaleString()}
                  </span>
                  {place.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] font-black bg-white/5 border border-white/5 uppercase tracking-widest px-3 h-7 flex items-center rounded-full text-white/40">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="space-y-3 flex flex-col justify-start">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  Verified Local Partners
                </p>
                <div className="space-y-2">
                  {safariOperators.slice(0, 1).map(op => (
                    <div key={op.id} className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-safari flex items-center justify-center font-black text-sm text-white shadow-md shrink-0">
                          {op.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-xs">{op.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-0.5">
                            <Star size={10} fill="currentColor" className="text-yellow-500" />
                            <span>{op.rating} • From Ksh {op.basePrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {safariOperators.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/10 p-3 text-center text-xs text-white/30 italic">
                      No direct partners matched. Click explore to contact overall agency guides.
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => onExploreOperators(place.tags || [])}
                  className="w-full h-9 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Users size={12} className="text-safari" />
                  <span>Contact Registered Guides</span>
                </button>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {!showReviewForm ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between shrink-0">
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        Guest Book Logs
                      </p>
                      {isSaved && isCompleted ? (
                        <button 
                          onClick={() => setShowReviewForm(true)}
                          className="text-[9px] font-black uppercase text-safari hover:underline cursor-pointer"
                        >
                          + Write Review
                        </button>
                      ) : (
                        <span className="text-[8px] text-white/30 italic uppercase tracking-wider">
                          Save as Completed to Comment
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3.5 bg-white/5 gap-2 rounded-2xl flex flex-col">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white/95">Maina W.</span>
                          <span className="text-safari flex gap-0.5 shrink-0"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></span>
                        </div>
                        <p className="text-xs text-white/60 leading-normal italic">
                          "An absolutely incredible experience. The views were completely breathtaking and we had great local assistance."
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={`${i <= rating ? 'text-safari fill-safari' : 'text-white/20'} cursor-pointer hover:scale-110 transition-transform`} 
                            onClick={() => setRating(i)}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setShowReviewForm(false)}
                        className="text-[9px] font-black uppercase text-white/40 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full h-20 bg-navy border border-white/10 rounded-xl p-3 text-xs focus:ring-1 focus:ring-safari outline-none transition-all placeholder:text-white/25 resize-none text-white bg-transparent"
                      placeholder="Detail your experience for other travellers..."
                    />
                    
                    <button 
                      onClick={handleSubmitReview}
                      disabled={!comment.trim()}
                      className="w-full h-9 bg-safari text-white rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-safari-light transition-all disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageCircle size={10} />
                      <span>Submit Review Dossier</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══ SECTION D: ACTION PANEL (BOTTOM STICKY) ═══════════════════ */}
        <div className="px-5 sm:px-6 pt-3 pb-5 sm:pb-6 border-t border-white/5 bg-navy shadow-inner flex flex-col gap-2 shrink-0 z-20">
          
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2.5 text-green-400 mb-1"
            >
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] font-bold">Successfully booked!</p>
                <p className="text-[9.5px] text-green-400/80">Added to your My Kenya library. Complete details via the booking link.</p>
              </div>
            </motion.div>
          )}

          {/* Quick Schedule Date Row (rendered only if not saved yet) */}
          {!isSaved && (
            <div className="flex items-center gap-2 justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1.5 leading-none">
                <Calendar size={11} className="text-safari" /> Planned Visit Date:
              </span>
              <input 
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 h-7 text-[10px] font-medium focus:ring-1 focus:ring-safari outline-none transition-all text-white w-28 shrink-0 relative"
              />
            </div>
          )}

          {/* Action Row Buttons */}
          <div className="flex gap-2 sm:gap-3 items-center">
            
            {/* Primary Action Button: Add to Planner */}
            <button 
              onClick={() => {
                onAddToTrip(place, plannedDate);
                setShowSuccess(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 h-11 ${
                isSaved 
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                  : 'bg-safari hover:bg-safari/95 text-white shadow-lg'
              } rounded-xl font-black uppercase text-[10px] tracking-wider cursor-pointer active:scale-95 transition-all`}
            >
              {isSaved ? <CheckCircle2 size={13} /> : <PlusCircle size={13} />}
              <span>{isSaved ? 'Scheduled in Trip' : 'Add to Trip'}</span>
            </button>

            {/* Link Action: Reserve Now */}
            <a 
              href={place.bookingLink || 'https://wa.me/254700000000'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onAddToTrip(place, plannedDate || new Date().toISOString().split('T')[0]);
                setShowSuccess(true);
              }}
              className="flex-1 h-11 bg-white hover:bg-safari hover:text-white text-navy rounded-xl font-black uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <ExternalLink size={12} />
              <span>Book Pass</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
