
import React from 'react';
import { Star, MapPin, ArrowRight, ShieldCheck, Heart, Share2 } from 'lucide-react';
import { Place, PlaceCategory } from '../types';

interface PlaceCardProps {
  place?: Place;
  onClick?: (place: Place) => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
  isLoading?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = React.memo(({ place, onClick, onSave, isSaved, isLoading }) => {
  const getCTAText = (category?: PlaceCategory) => {
    switch (category) {
      case PlaceCategory.RESTAURANT: return 'Reserve Table';
      case PlaceCategory.HOTEL: return 'Book Now';
      case PlaceCategory.SAFARI:
      case PlaceCategory.EXPERIENCE:
      case PlaceCategory.ADVENTURES: return 'Book Now';
      default: return 'Explore Details';
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!place) return;
    
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} in ${place.location} on PlacesInKenya!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback to WhatsApp
      const text = encodeURIComponent(`Check out ${place.name} in ${place.location} on PlacesInKenya! ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (isLoading || !place) {
    return (
      <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] animate-pulse border border-navy/5 flex flex-col h-full">
         <div className="relative aspect-[4/3] bg-navy/5">
           <div className="absolute top-4 left-4 w-20 h-6 bg-navy/10 rounded-full" />
           <div className="absolute top-4 right-4 w-8 h-8 bg-navy/10 rounded-full" />
         </div>
         <div className="p-4 sm:p-5 flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-6 bg-navy/10 rounded-lg w-3/4" />
              <div className="h-3 bg-navy/5 rounded-lg w-1/4" />
            </div>
            <div className="space-y-1.5">
               <div className="h-3 bg-navy/5 rounded-lg w-full" />
               <div className="h-3 bg-navy/5 rounded-lg w-2/3" />
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-navy/5">
               <div className="space-y-1">
                 <div className="h-2 bg-navy/5 rounded-full w-8" />
                 <div className="h-5 bg-navy/10 rounded-lg w-16" />
               </div>
               <div className="h-9 bg-navy/10 rounded-full w-24" />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] hover:-translate-y-[4px] transition-all duration-[400ms] cursor-pointer flex flex-col h-full relative border border-navy/5"
      id={`place-card-${place.id}`}
      onClick={() => onClick?.(place)}
    >
      {/* Image Section - Fixed 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5 shrink-0">
        <img 
          src={place.imageUrl} 
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[400ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent"></div>
        
        {/* Category Badge - Pill style secondary colored background */}
        <div className="absolute top-4 left-4">
           <span className="bg-safari hover:bg-safari/90 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 h-7 flex items-center rounded-full shadow-lg border border-white/10">
             {place.category?.replace('_', ' ')}
            </span>
        </div>

        {/* Verified Badge */}
        {place.isVerified && (
          <div className="absolute top-4 right-28 group/verified">
             <div className="bg-navy/90 text-white px-3 h-7 rounded-full shadow-xl flex items-center justify-center gap-1.5 border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={12} className="shrink-0 text-safari" />
                <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">Verified</span>
             </div>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white hover:text-safari flex items-center justify-center transition-all tap-target border border-white/20"
            title="Share"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all tap-target border ${isSaved ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20' : 'bg-white/20 text-white hover:bg-white hover:text-navy border-white/20'}`}
          >
            <Heart size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-safari animate-pulse" : ""} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="space-y-2.5 flex-1">
          <div className="space-y-1">
            <h3 className="text-[0.9375rem] sm:text-base lg:text-[1.0625rem] font-serif font-bold text-navy tracking-tight line-clamp-2 leading-tight group-hover:text-safari transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-1.5 text-navy/40">
              <MapPin size={10} className="text-safari" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">{place.location}</span>
            </div>
          </div>

          <p className="text-navy/60 text-[0.8125rem] sm:text-sm leading-relaxed line-clamp-2 font-sans">
            {place.description}
          </p>

          <div className="flex items-center gap-1 text-safari">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(place.rating) ? "currentColor" : "none"} className={i < Math.floor(place.rating) ? "" : "text-navy/10"} />
            ))}
            <span className="text-[10px] font-bold text-navy/30 ml-2 uppercase tracking-[0.1em]">({(place.rating * 12).toFixed(0)} Reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-navy/5">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] text-navy/20 uppercase font-black tracking-[0.2em] leading-none mb-1">From</span>
            <span className="text-navy text-lg sm:text-xl font-bold font-sans tracking-tight">Ksh {(place.price || 4500).toLocaleString()}</span>
          </div>
          <button className="h-9 px-4 sm:px-5 bg-navy text-white rounded-full flex items-center justify-center gap-2 transition-all hover:bg-safari shadow-lg hover:shadow-safari/20">
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{getCTAText(place.category)}</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
});
