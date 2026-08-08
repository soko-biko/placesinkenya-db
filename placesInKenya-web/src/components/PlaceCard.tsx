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

  if (layout === 'list') {
    return (
      <div 
        id={`place-card-${place.id}`}
        onClick={() => onClick?.(place)}
        className="group flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 py-5 border-b border-navy/10 hover:bg-navy/[0.01] transition-colors cursor-pointer w-full text-left"
      >
        {/* Compact Image Section */}
        <div className="relative w-full sm:w-32 md:w-40 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-navy/5 shrink-0 z-0">
          <img 
            src={place.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'} 
            alt={place.name}
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
          <div className="absolute top-2 left-2 z-10">
             <span className="bg-safari text-white text-[7px] font-black uppercase tracking-[0.15em] px-2 h-5 flex items-center rounded-full border border-white/10 select-none">
               {place.category?.replace('_', ' ')}
             </span>
          </div>
        </div>

        {/* Info & CTA details row */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-navy truncate group-hover:text-safari transition-colors">
                {place.name}
              </h3>
              {place.isVerified && (
                 <div className="bg-navy/5 text-navy px-1.5 h-4.5 rounded-full flex items-center gap-0.5 select-none shrink-0" title="Verified">
                    <ShieldCheck size={8} className="text-safari" />
                    <span className="text-[6.5px] font-bold uppercase tracking-wider">Verified</span>
                 </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-navy/40 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-safari" />
                <span className="text-[8.5px] font-black uppercase tracking-wider">{place.location}</span>
              </div>
              <div className="flex items-center gap-0.5 text-safari">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} fill={i < Math.floor(place.rating) ? "currentColor" : "none"} className={i < Math.floor(place.rating) ? "" : "text-navy/10"} />
                ))}
                <span className="text-[8.5px] font-bold text-navy/30 ml-1">({(place.rating * 12).toFixed(0)})</span>
              </div>
            </div>

            <p className="text-navy/60 text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2 font-sans">
              {place.description}
            </p>
          </div>

          {/* Price & Action Block */}
          <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-navy/5">
            <div className="flex flex-col sm:items-end sm:mr-4">
              <span className="text-[7px] text-navy/20 uppercase font-black tracking-widest leading-none mb-0.5">From</span>
              <span className="text-navy text-xs sm:text-sm font-bold tracking-tight">Ksh {(place.price || 4500).toLocaleString()}</span>
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
                <span className="text-[7.5px] font-black uppercase tracking-wider">{getCTAText(place.category)}</span>
                <ArrowRight size={9} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      id={`place-card-${place.id}`}
      onClick={() => onClick?.(place)}
      className="flex flex-col h-full"
    >
      {/* Image Section - Fixed 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5 shrink-0 z-0">
        <img 
          src={place.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'} 
          alt={place.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
           <span className="bg-safari text-white text-[8px] font-black uppercase tracking-[0.15em] px-2.5 h-6 flex items-center rounded-full shadow border border-white/10 select-none">
             {place.category?.replace('_', ' ')}
            </span>
        </div>

        {/* Badges Overlay Grouped - Guideline 6 */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {place.isVerified && (
             <div className="bg-navy/90 text-white px-2 h-6 rounded-full shadow flex items-center justify-center gap-1 border border-white/10 backdrop-blur-sm select-none">
                <ShieldCheck size={10} className="shrink-0 text-safari" />
                <span className="text-[7px] font-black uppercase tracking-widest hidden sm:block">Verified</span>
             </div>
          )}
          <button 
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full backdrop-blur-md bg-white/25 text-white hover:bg-white hover:text-safari flex items-center justify-center transition-all border border-white/25 cursor-pointer shadow-sm"
            title="Share"
          >
            <Share2 size={13} />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all border cursor-pointer shadow-sm ${isSaved ? 'bg-navy text-white border-navy' : 'bg-white/25 text-white hover:bg-white hover:text-navy border-white/25'}`}
          >
            <Heart size={13} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-safari" : ""} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 space-y-2">
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
    </Card>
  );
});

PlaceCard.displayName = 'PlaceCard';
