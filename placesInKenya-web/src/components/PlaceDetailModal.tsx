
import React, { useState } from 'react';
import { X, MapPin, Star, Users, Briefcase, PlusCircle, ExternalLink, Clock, DollarSign, MessageCircle, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { Place, TourOperator, OperatorType, SavedItem } from '../types';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
  onAddToTrip: (place: Place, date?: string) => void;
  onExploreOperators: (tags: string[]) => void;
  onAddReview: (rating: number, comment: string, placeId: string) => void;
  savedItem?: SavedItem;
  operators: TourOperator[];
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose, onAddToTrip, onExploreOperators, onAddReview, savedItem, operators }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [plannedDate, setPlannedDate] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const isSaved = !!savedItem;
  const isCompleted = savedItem?.completed;

  const handleSubmitReview = () => {
    if (comment.trim()) {
      onAddReview(rating, comment, place.id);
      setShowReviewForm(false);
      setComment('');
    }
  };

  const safariOperators = operators.filter(o => o.specialties?.includes('Safari') || o.type === OperatorType.COMPANY);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-navy/95 backdrop-blur-md sm:backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-navy w-full lg:max-w-6xl h-[95vh] sm:h-[90vh] overflow-hidden rounded-t-[2.5rem] sm:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 animate-slide-up sm:animate-scale-up text-white flex flex-col">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0 bg-navy/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center p-2">
                <img src="/regenerated_image_1777526382608.png" className="w-full h-full object-contain" alt="" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-safari leading-none mb-1">Detailed Dossier</p>
                <h2 className="font-serif font-bold text-lg leading-none">{place.name}</h2>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-safari rounded-2xl text-white transition-all border border-white/10 hover:border-white shadow-xl active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
            {/* Left Column: Photos & Featured Operators */}
            <div className="lg:col-span-5 h-[350px] lg:h-auto relative lg:sticky lg:top-0">
              <img 
                src={place.imageUrl} 
                alt={place.name}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"></div>
              
              {place.category === 'SAFARI' && (
                <div className="absolute bottom-12 left-10 right-10 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-safari flex items-center gap-2">
                    <Briefcase size={16} /> Partnered Operators
                  </h4>
                  <div className="space-y-3">
                    {safariOperators.slice(0, 2).map(op => (
                      <div key={op.id} className="bg-white/5 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/10 flex items-center justify-between group cursor-pointer hover:border-safari/50 hover:bg-white/10 transition-all shadow-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-safari flex items-center justify-center font-black text-lg text-white shadow-lg">
                            {op.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-base group-hover:text-safari transition-colors">{op.name}</p>
                            <div className="flex items-center gap-1 text-[11px] text-white/40 font-medium">
                              <Star size={12} fill="currentColor" className="text-yellow-500" />
                              {op.rating} • <span className="text-white/60">From Ksh {op.basePrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 px-6 sm:px-12 py-10 sm:py-16 bg-navy space-y-12">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                   <span className="bg-safari/20 text-safari text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full border border-safari/30 uppercase tracking-[0.2em]">
                    {place.category?.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2 text-yellow-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold">{place.rating}</span>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-[1.1]">{place.name}</h1>
                <div className="flex items-center gap-2 text-white/50 text-base sm:text-xl">
                  <MapPin size={20} className="text-safari font-serif" />
                  <span>{place.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-8 border-y border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <DollarSign size={14} /> Est. Price
                  </p>
                  <p className="text-xl font-bold">Ksh {place.price?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Clock size={14} /> Best Time
                  </p>
                  <p className="text-xl font-bold">7AM - 6PM</p>
                </div>
                <div className="space-y-1 hidden lg:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <Users size={14} /> Accessibility
                  </p>
                  <p className="text-xl font-bold">Family Friendly</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                  <h3 className="text-2xl font-serif font-bold tracking-tight">The Experience</h3>
                  <div className="flex flex-wrap gap-2">
                     {place.tags?.map(t => (
                       <span key={t} className="text-[9px] bg-white/5 px-3 py-1 rounded-full border border-white/5 text-white/40 uppercase font-black tracking-widest">
                         #{t}
                       </span>
                     ))}
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed text-lg sm:text-xl font-light">
                  {place.description}
                </p>
              </div>

              {/* Enhanced Review Section */}
              <div className="space-y-8 p-8 glass rounded-[2.5rem] border border-white/5">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <h4 className="text-xl font-bold flex items-center gap-3">
                      <MessageCircle size={24} className="text-safari" /> Collective Feedback
                    </h4>
                    {isSaved && isCompleted ? (
                      <button 
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="px-6 py-3 bg-safari text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-safari-light transition-all"
                      >
                        {showReviewForm ? 'Cancel Review' : 'Add Official Review'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                        <AlertCircle size={14} />
                        {isSaved ? 'Mark as attended to review' : 'Add to trip to review'}
                      </div>
                    )}
                 </div>

                 {showReviewForm && (
                   <div className="space-y-6 p-6 bg-white/5 rounded-3xl border border-safari/20 animate-fade-in">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star 
                              key={i} 
                              size={24} 
                              className={`${i <= rating ? 'text-safari fill-safari' : 'text-white/20'} cursor-pointer hover:scale-110 transition-transform`} 
                              onClick={() => setRating(i)}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-white/40">{rating}/5 Rating</span>
                      </div>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-32 bg-navy border border-white/10 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-safari/50 outline-none transition-all placeholder:text-white/20"
                        placeholder="Detail your experience for the collective..."
                      />
                      <button 
                        onClick={handleSubmitReview}
                        className="w-full h-14 bg-safari text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl disabled:opacity-50"
                        disabled={!comment.trim()}
                      >
                        Submit Dossier
                      </button>
                   </div>
                 )}

                 <div className="space-y-6">
                    {[1].map(i => (
                      <div key={i} className="p-6 bg-white/5 rounded-[2rem] space-y-4 border border-white/5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-safari/20 flex items-center justify-center font-black text-safari text-sm">MW</div>
                            <div>
                               <p className="font-bold text-sm leading-none mb-1">Maina W.</p>
                               <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Verified Explorer</p>
                            </div>
                          </div>
                          <div className="flex text-safari"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                        </div>
                        <p className="text-base text-white/60 leading-relaxed font-light italic">"An absolutely breathtaking experience. The guides were professional and the views were unmatched!"</p>
                      </div>
                    ))}
                 </div>
              </div>

               {/* Bottom Sticky-style Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-12 border-t border-white/5">
                <div className="flex flex-col gap-4">
                  {!isSaved && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2 flex items-center gap-2">
                        <Calendar size={12} className="text-safari" /> Planned Visit Date
                      </label>
                      <input 
                        type="date"
                        value={plannedDate}
                        onChange={(e) => setPlannedDate(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:ring-1 focus:ring-safari/50 outline-none transition-all"
                      />
                    </div>
                  )}
                  <button 
                    onClick={() => onExploreOperators(place.tags || [])}
                    className="flex items-center justify-center gap-3 px-8 py-5 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 group text-base tap-target"
                  >
                    <Users size={20} className="group-hover:text-safari transition-colors" />
                    Find Local Guide
                  </button>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => onAddToTrip(place, plannedDate)}
                    className={`w-full flex items-center justify-center gap-3 px-8 py-5 h-24 ${isSaved ? 'bg-green-600/20 text-green-500 border border-green-600/30' : 'bg-safari hover:bg-safari-light text-white shadow-2xl shadow-safari/20'} rounded-2xl font-bold transition-all text-base hover:scale-[1.02] active:scale-95 tap-target md:self-end`}
                  >
                    {isSaved ? <CheckCircle2 size={24} /> : <PlusCircle size={24} />}
                    <div className="text-left">
                       <p className="leading-none">{isSaved ? 'Included in Itinerary' : 'Add to Trip'}</p>
                       {isSaved && savedItem?.plannedDate && (
                         <p className="text-[10px] font-medium opacity-60 mt-1 uppercase tracking-widest">Scheduled for {new Date(savedItem.plannedDate).toLocaleDateString()}</p>
                       )}
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 animate-fade-in">
                <a 
                  href={place.bookingLink || 'about:blank'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 h-16 bg-white text-navy rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-safari hover:text-white transition-all shadow-xl group"
                >
                  <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                  Reserve / Book Now
                </a>
                <p className="text-[9px] text-white/30 text-center mt-3 uppercase tracking-[0.2em] font-medium italic">
                  External booking platforms (WhatsApp, Email, or Website)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number; className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
