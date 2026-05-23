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
      const text = encodeURIComponent(`Check out ${place.name} in ${place.location} on PlacesInKenya! ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (isLoading || !place) {
    return (
      <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-navy/5 flex flex-col h-full">
         <div className="relative aspect-[4/3] bg-navy/5">
            <div className="absolute top-3 left-3 w-16 h-5 bg-navy/10 rounded-full" />
            <div className="absolute top-3 right-3 w-6 h-6 bg-navy/10 rounded-full" />
         </div>
         <div className="p-3 sm:p-4 flex-1 space-y-3">
            <div className="space-y-1.5">
              <div className="h-4 bg-navy/10 rounded w-3/4" />
              <div className="h-3 bg-navy/5 rounded w-1/4" />
            </div>
            <div className="space-y-1">
               <div className="h-3 bg-navy/5 rounded w-full" />
               <div className="h-3 bg-navy/5 rounded w-2/3" />
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-navy/5">
               <div className="space-y-1">
                 <div className="h-2 bg-navy/5 rounded-full w-6" />
                 <div className="h-4 bg-navy/10 rounded w-12" />
               </div>
               <div className="h-8 bg-navy/10 rounded-full w-20" />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col h-full relative border border-navy/5"
      id={`place-card-${place.id}`}
      onClick={() => onClick?.(place)}
    >
      {/* Image Section - Fixed 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5 shrink-0">
        <img 
          src={place.imageUrl} 
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5">
           <span className="bg-safari text-white text-[8px] font-black uppercase tracking-[0.15em] px-2.5 h-6 flex items-center rounded-full shadow border border-white/10 select-none">
             {place.category?.replace('_', ' ')}
            </span>
        </div>

        {/* Verified Badge */}
        {place.isVerified && (
          <div className="absolute top-2.5 right-20 group/verified">
             <div className="bg-navy/90 text-white px-2 h-6 rounded-full shadow flex items-center justify-center gap-1 border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={10} className="shrink-0 text-safari" />
                <span className="text-[7px] font-black uppercase tracking-widest hidden sm:block">Verified</span>
             </div>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button 
            onClick={handleShare}
            className="w-8 h-8 rounded-full backdrop-blur-md bg-white/25 text-white hover:bg-white hover:text-safari flex items-center justify-center transition-all border border-white/25 cursor-pointer"
            title="Share"
          >
            <Share2 size={13} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all border cursor-pointer ${isSaved ? 'bg-navy text-white border-navy shadow' : 'bg-white/25 text-white hover:bg-white hover:text-navy border-white/25'}`}
          >
            <Heart size={13} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-safari" : ""} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        <div className="space-y-1.5 flex-1">
          <div className="space-y-0.5">
            <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-navy tracking-tight line-clamp-1 leading-tight group-hover:text-safari transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 text-navy/40">
              <MapPin size={9} className="text-safari" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] truncate">{place.location}</span>
            </div>
          </div>

          <p className="text-navy/60 text-[11.5px] sm:text-xs leading-normal line-clamp-2 font-sans">
            {place.description}
          </p>

          <div className="flex items-center gap-0.5 text-safari pt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < Math.floor(place.rating) ? "currentColor" : "none"} className={i < Math.floor(place.rating) ? "" : "text-navy/10"} />
            ))}
            <span className="text-[8.5px] font-bold text-navy/30 ml-1.5 uppercase tracking-[0.05em] leading-none">({(place.rating * 12).toFixed(0)})</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-navy/5">
          <div className="flex flex-col">
            <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">From</span>
            <span className="text-navy text-sm sm:text-base font-bold font-sans tracking-tight">Ksh {(place.price || 4500).toLocaleString()}</span>
          </div>
          <button className="h-7.5 px-3 sm:px-3.5 bg-navy text-white rounded-full flex items-center justify-center gap-1.5 transition-all hover:bg-safari shadow cursor-pointer">
            <span className="text-[7.5px] font-black uppercase tracking-wider">{getCTAText(place.category)}</span>
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
});

PlaceCard.displayName = 'PlaceCard';
