
import React, { useState } from 'react';
import { X, MapPin, Star, Users, Briefcase, PlusCircle, ExternalLink, Clock, DollarSign, MessageCircle } from 'lucide-react';
import { Place, TourOperator, OperatorType } from '../types';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
  onAddToTrip: (place: Place) => void;
  onExploreOperators: (tags: string[]) => void;
  isSaved: boolean;
  operators: TourOperator[];
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose, onAddToTrip, onExploreOperators, isSaved, operators }) => {
  const [showRatings, setShowRatings] = useState(false);

  const safariOperators = operators.filter(o => o.specialties?.includes('Safari') || o.type === OperatorType.COMPANY);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-navy w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-[0_0_100px_rgba(15,23,42,0.5)] border border-white/5 animate-scale-up text-white">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 z-[70] p-4 bg-navy/80 hover:bg-safari rounded-full text-white transition-all border border-white/10 hover:border-white shadow-2xl active:scale-90"
        >
          <X size={28} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Photos & Featured Operators */}
          <div className="lg:col-span-5 h-[400px] lg:h-[800px] relative lg:sticky lg:top-0">
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
                  <button 
                    onClick={() => onExploreOperators(place.tags || [])}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-safari transition-all border border-white/5 rounded-xl hover:bg-white/5"
                  >
                    Explore all {safariOperators.length} safari partners
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-16 space-y-10 sm:space-y-12 bg-navy">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="bg-safari/20 text-safari text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full border border-safari/30 uppercase tracking-[0.2em]">
                  {place.category?.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2 text-yellow-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{place.rating}</span>
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold leading-tight">{place.name}</h2>
              <div className="flex items-center gap-2 text-white/50 text-lg sm:text-xl">
                <MapPin size={24} className="text-safari font-serif" />
                <span>{place.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <DollarSign size={14} /> Est. Price
                </p>
                <p className="text-lg sm:text-xl font-bold">Ksh {place.price?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <Clock size={14} /> Best Time
                </p>
                <p className="text-lg sm:text-xl font-bold">7:00 AM - 6:00 PM</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <Users size={14} /> Accessibility
                </p>
                <p className="text-lg sm:text-xl font-bold">Family Friendly</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                <h3 className="text-2xl font-serif font-bold">The Experience</h3>
                <div className="flex flex-wrap gap-2">
                   {place.tags?.map(t => (
                     <span key={t} className="text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/5 text-white/40 uppercase font-black tracking-widest">
                       #{t}
                     </span>
                   ))}
                </div>
              </div>
              <p className="text-white/70 leading-relaxed text-lg sm:text-xl font-light">
                {place.description}
              </p>
            </div>

            {/* Ratings / Reviews placeholder */}
            <div className="space-y-6 p-8 glass rounded-3xl border-white/5">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold flex items-center gap-3">
                    <MessageCircle size={20} className="text-safari" /> Guest Reviews
                  </h4>
                  <button className="text-safari text-sm font-bold hover:underline">Write a review</button>
               </div>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-sm">Maina W.</p>
                      <div className="flex text-yellow-500"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                    </div>
                    <p className="text-sm text-white/60">"An absolutely breathtaking experience. The guides were professional and the views were unmatched!"</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12">
              <button 
                onClick={() => onExploreOperators(place.tags || [])}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 group text-lg"
              >
                <Users size={24} className="group-hover:text-safari transition-colors" />
                Find Best Guide
              </button>
              <button 
                onClick={() => onAddToTrip(place)}
                className={`flex items-center justify-center gap-3 px-8 py-5 ${isSaved ? 'bg-green-600' : 'bg-safari hover:bg-safari-light'} text-white rounded-2xl font-bold transition-all shadow-xl shadow-safari/20 text-lg hover:scale-[1.02] active:scale-95`}
              >
                {isSaved ? <CheckCircle2 size={24} /> : <PlusCircle size={24} />}
                {isSaved ? 'Item Saved' : 'Add to Trip Planner'}
              </button>
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
