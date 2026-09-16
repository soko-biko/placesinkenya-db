import React from 'react';
import { Star, MapPin, ArrowRight, ShieldCheck, Heart, Share2 } from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { Card } from './Card';

interface PlaceCardProps {
  place?: Place;
  onClick?: (place: Place) => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
  isLoading?: boolean;
  layout?: 'grid' | 'list';
}

export const PlaceCard: React.FC<PlaceCardProps> = React.memo(({ place, onClick, onSave, isSaved, isLoading, layout = 'grid' }) => {
  const getCTAText = (category?: PlaceCategory) => {
    switch (category) {
      case PlaceCategory.RESTAURANT: return 'Reserve Table';
      case PlaceCategory.HOTEL: return 'Book Now';
      case PlaceCategory.SHOPPING: return 'Visit Store';
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop';
  };

  const safePlace = place || ({} as Place);
  const categoryLabel = (safePlace.category || 'EXPLORE').toString().replace(/_/g, ' ');
  const ratingVal = Number(safePlace.rating || 4.5);

  if (layout === 'list') {
    return (
      <div 
        id={`place-card-${safePlace.id || 'item'}`}
        onClick={() => onClick?.(safePlace)}
        className="group flex flex-row items-stretch gap-3.5 sm:gap-6 py-3.5 sm:py-5 border-b border-navy/10 hover:bg-navy/[0.01] transition-colors cursor-pointer w-full text-left"
      >
        {/* Compact Image Section */}
        <div className="relative w-28 sm:w-36 md:w-44 aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden shrink-0 z-0">
          <img 
            src={safePlace.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'} 
            alt={safePlace.name || 'Place'}
            loading="lazy"
            onError={handleImageError}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
             <span className="bg-safari text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center rounded-full shadow-sm border border-white/10 select-none">
               {categoryLabel}
             </span>
          </div>
        </div>

        {/* Info & CTA details row */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-navy truncate group-hover:text-safari transition-colors">
                {safePlace.name || 'Untitled Destination'}
              </h3>
              {safePlace.isVerified && (
                 <div className="bg-navy/5 text-navy px-1.5 h-4.5 rounded-full flex items-center gap-0.5 select-none shrink-0" title="Verified">
                    <ShieldCheck size={9} className="text-safari" />
                    <span className="text-[7px] font-bold uppercase tracking-wider">Verified</span>
                 </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-navy/40 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-safari" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{safePlace.location || 'Kenya'}</span>
              </div>
              <div className="flex items-center gap-0.5 text-safari">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} fill={i < Math.floor(ratingVal) ? "currentColor" : "none"} className={i < Math.floor(ratingVal) ? "" : "text-navy/10"} />
                ))}
                <span className="text-[9px] font-bold text-navy/30 ml-1">({(ratingVal * 12).toFixed(0)})</span>
              </div>
            </div>

            <p className="text-navy/60 text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2 font-sans">
              {safePlace.description || ''}
            </p>
          </div>

          {/* Price & Action Block */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 pt-2 sm:pt-0 border-t sm:border-0 border-navy/5">
            <div className="flex flex-col sm:items-end sm:mr-3">
              <span className="text-[7.5px] text-navy/30 uppercase font-black tracking-wider leading-none mb-0.5">From</span>
              <span className="text-navy text-xs sm:text-sm font-bold tracking-tight">
                {safePlace.price && safePlace.price > 0 ? `Ksh ${safePlace.price.toLocaleString()}` : 'Free Access'}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center border cursor-pointer transition-all ${isSaved ? 'bg-navy border-navy text-white' : 'border-navy/10 hover:border-navy text-navy hover:bg-navy/5'}`}
              >
                <Heart size={11} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-safari" : ""} />
              </button>
              
              <button className="h-7.5 px-3 bg-navy hover:bg-safari text-white rounded-full flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer whitespace-nowrap">
                <span className="text-[8px] font-black uppercase tracking-wider">{getCTAText(safePlace.category)}</span>
                <ArrowRight size={9} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`place-card-${safePlace.id || 'item'}`}
      onClick={() => onClick?.(safePlace)}
      className="bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex flex-col h-full group cursor-pointer"
    >
      {/* Event-like 16:9 Image Zone */}
      <div className="relative w-full aspect-[16/9] overflow-hidden shrink-0">
        <img 
          src={safePlace.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'} 
          alt={safePlace.name || 'Place'}
          loading="lazy"
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 w-max">
           <span className="bg-navy/80 backdrop-blur-md text-white font-semibold text-xs uppercase tracking-wider px-2.5 py-0.5 flex items-center border border-white/5 select-none rounded-full">
             {categoryLabel}
           </span>
        </div>

        {/* Right Badges */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {safePlace.isVerified && (
             <div className="bg-navy/90 text-white px-2 py-0.5 rounded-full shadow flex items-center justify-center gap-1 border border-white/10 backdrop-blur-sm select-none">
                <ShieldCheck size={10} className="shrink-0 text-safari" />
                <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Verified</span>
             </div>
          )}
          <button 
            type="button"
            onClick={handleShare}
            className="w-7 h-7 rounded-full backdrop-blur-md bg-white/30 text-white hover:bg-white hover:text-safari flex items-center justify-center transition-all border border-white/25 cursor-pointer shadow-sm"
            title="Share"
          >
            <Share2 size={12} />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
            className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all border cursor-pointer shadow-sm ${isSaved ? 'bg-navy text-white border-navy' : 'bg-white/30 text-white hover:bg-white hover:text-navy border-white/25'}`}
          >
            <Heart size={12} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-safari" : ""} />
          </button>
        </div>
      </div>

      {/* Content & Actions Zone - matching Event card sizes */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between gap-2 text-xs text-navy/50 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-safari shrink-0" />
              <span className="truncate">{safePlace.location || 'Kenya'}</span>
            </div>
            <div className="flex items-center gap-0.5 text-safari shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < Math.floor(ratingVal) ? "currentColor" : "none"} className={i < Math.floor(ratingVal) ? "" : "text-navy/10"} />
              ))}
              <span className="text-navy/40 ml-1">({(ratingVal * 12).toFixed(0)})</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-base text-navy leading-snug group-hover:text-safari transition-colors line-clamp-1">
            {safePlace.name || 'Untitled Destination'}
          </h3>

          <p className="text-navy/70 text-sm leading-relaxed line-clamp-2">
            {safePlace.description || ''}
          </p>
        </div>

        {/* Bottom Action Row */}
        <div className="mt-3 pt-3 border-t border-navy/5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[7.5px] text-navy/20 uppercase font-black tracking-[0.15em] leading-none mb-0.5">From</span>
            <span className="text-navy text-xs font-bold font-sans tracking-tight">
              {safePlace.price && safePlace.price > 0 ? `Ksh ${safePlace.price.toLocaleString()}` : 'Free Access'}
            </span>
          </div>
          <button className="h-7 px-3 bg-navy hover:bg-safari text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-all select-none cursor-pointer">
            <span>{getCTAText(safePlace.category)}</span>
            <ArrowRight size={8} />
          </button>
        </div>
      </div>
    </div>
  );
});

PlaceCard.displayName = 'PlaceCard';
