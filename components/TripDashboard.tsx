
import React from 'react';
import { Place, SavedItem } from '../types';
import { Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';

interface TripDashboardProps {
  savedItems: SavedItem[];
  places: Place[];
  onRemove: (id: string) => void;
  onUpdateDate: (id: string, date: string) => void;
  onNavigateHome: () => void;
}

export const TripDashboard: React.FC<TripDashboardProps> = ({ savedItems, places, onRemove, onUpdateDate, onNavigateHome }) => {
  const savedPlaces = savedItems
    .map(item => ({
      ...item,
      place: places.find(p => p.id === item.placeId)
    }))
    .filter(item => item.place);

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-navy/10 pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-navy">My Personal Hub</h1>
          <p className="text-navy/60 text-xl font-light">Your curated list of Kenyan wonders waiting to be explored.</p>
        </div>
        <div className="bg-navy p-6 rounded-[2rem] flex items-center gap-8 shadow-2xl shadow-navy/20">
          <div className="text-center">
            <p className="text-4xl font-bold text-safari">{savedPlaces.length}</p>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Destinations</p>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <p className="text-4xl font-bold text-safari">0</p>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Shared Trips</p>
          </div>
        </div>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="text-center py-32 space-y-8">
          <div className="w-32 h-32 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy/10">
            <MapPin size={64} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-serif font-bold text-navy">Your planner is empty</h3>
            <p className="text-navy/50 max-w-md mx-auto text-lg font-light">Start browsing Kenya's beautiful destinations and save your favorites here for a curated trip experience.</p>
          </div>
          <button 
            onClick={onNavigateHome}
            className="px-12 py-4 bg-safari hover:bg-safari-light text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-safari/20 active:scale-95"
          >
            Explore Places
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            {savedPlaces.map(item => {
              const place = item.place!;
              return (
                <div key={item.id} className="group bg-navy/60 backdrop-blur-xl rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border border-white/5 hover:border-safari/30 transition-all flex flex-col sm:flex-row shadow-2xl shadow-navy/40 overflow-hidden min-h-[300px]">
                  <div className="w-full sm:w-1/3 relative shrink-0 overflow-hidden">
                    <img src={place.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-black text-safari uppercase tracking-[0.2em] bg-navy/90 backdrop-blur-md px-4 py-2 rounded-lg border border-safari/20">
                        {place.category === 'EATS_ENT' ? 'Eats & Entertainment' : (place.category?.replace('_', ' ') || 'Destination')}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-navy/10 to-transparent z-0 pointer-events-none"></div>
                  </div>
                  
                  <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-r from-navy/40 to-transparent">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-3xl font-serif font-bold group-hover:text-safari transition-colors">{place.name}</h3>
                          <div className="flex items-center gap-2 text-white/40 text-sm">
                            <MapPin size={16} className="text-safari" />
                            <span>{place.location}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="p-4 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                          title="Remove from Planner"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>

                      <p className="text-white/40 text-sm font-light line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-safari/10 p-3 rounded-2xl text-safari shadow-inner">
                            <Calendar size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Planned Experience</span>
                            <span className="text-sm font-bold">
                              {item.plannedDate ? new Date(item.plannedDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not yet scheduled'}
                            </span>
                          </div>
                        </div>

                        {!item.isEvent ? (
                          <div className="flex flex-col gap-2 shrink-0">
                            <label className="text-[9px] font-black uppercase tracking-widest text-safari">Adjust Schedule</label>
                            <input 
                              type="datetime-local" 
                              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-safari transition-all cursor-pointer text-white hover:bg-white/10"
                              value={item.plannedDate || ''}
                              onChange={(e) => onUpdateDate(item.id, e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="px-6 py-3 bg-safari/5 border border-safari/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-safari/60 italic flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-safari rounded-full animate-pulse"></div>
                             Fixed Schedule Event
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-navy p-10 rounded-[3rem] border border-white/5 sticky top-28 space-y-10 text-white shadow-2xl shadow-navy/40">
            <h3 className="text-3xl font-serif font-bold border-b border-white/10 pb-6">Trip Summary</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-white/60">
                <span className="text-sm uppercase tracking-widest font-black">Total Spots</span>
                <span className="text-2xl font-bold font-serif text-safari">{savedPlaces.length}</span>
              </div>
              <div className="flex justify-between items-center text-white/60">
                <span className="text-sm uppercase tracking-widest font-black">Est. Duration</span>
                <span className="text-2xl font-bold font-serif text-white">7-10 Days</span>
              </div>
              <div className="flex justify-between items-center text-white/60">
                <span className="text-sm uppercase tracking-widest font-black">Difficulty</span>
                <span className="text-2xl font-bold font-serif text-white">Moderate</span>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-sm text-safari-light font-medium italic leading-relaxed">"Pro tip: Book tour operators directly for the best local rates and tailored experiences."</p>
            </div>

            <button className="w-full py-5 bg-safari hover:bg-safari-light text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-2xl shadow-safari/20 active:scale-95">
              Export Itinerary <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
