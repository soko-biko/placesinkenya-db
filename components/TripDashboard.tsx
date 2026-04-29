
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
    <div className="pt-12 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-navy/5 pb-8">
        <div className="space-y-1">
          <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Private Planner</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy leading-tight">My Personal Hub</h1>
          <p className="text-navy/40 text-sm md:text-base font-medium">Your curated list of Kenyan wonders.</p>
        </div>
        <div className="bg-white border border-navy/5 p-4 rounded-2xl flex items-center gap-6 shadow-sm">
          <div className="text-center px-2">
            <p className="text-2xl font-bold text-navy">{savedPlaces.length}</p>
            <p className="text-[9px] uppercase font-bold tracking-widest text-navy/30">Gems</p>
          </div>
          <div className="w-px h-8 bg-navy/5"></div>
          <div className="text-center px-2">
            <p className="text-2xl font-bold text-navy">0</p>
            <p className="text-[9px] uppercase font-bold tracking-widest text-navy/30">Trips</p>
          </div>
        </div>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="text-center py-24 space-y-8 max-w-md mx-auto">
          <div className="w-20 h-20 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto text-navy/20">
            <MapPin size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-navy">Your planner is empty</h3>
            <p className="text-navy/40 text-sm font-medium leading-relaxed">Start browsing Kenya's beautiful destinations and save your favorites here.</p>
          </div>
          <button 
            onClick={onNavigateHome}
            className="w-full h-12 bg-navy hover:bg-safari text-white rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg active:scale-95"
          >
            Explore Places
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
          <div className="space-y-6">
            {savedPlaces.map(item => {
              const place = item.place!;
              return (
                <div key={item.id} className="group bg-white rounded-2xl border border-navy/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row overflow-hidden relative">
                  <div className="w-full md:w-48 aspect-video md:aspect-auto shrink-0 relative overflow-hidden">
                    <img src={place.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={place.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent"></div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-navy group-hover:text-safari transition-colors">{place.name}</h3>
                          <div className="flex items-center gap-2 text-navy/40 text-xs font-medium">
                            <MapPin size={14} className="text-safari" />
                            <span>{place.location}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="p-2 text-navy/20 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-navy/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-navy/5 p-2 rounded-lg text-navy/40">
                            <Calendar size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Schedule</span>
                            <span className="text-xs font-bold text-navy">
                              {item.plannedDate ? new Date(item.plannedDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Flexible'}
                            </span>
                          </div>
                        </div>

                        {!item.isEvent ? (
                          <div className="relative">
                            <input 
                              type="datetime-local" 
                              className="bg-navy/5 border border-transparent rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-safari transition-all cursor-pointer text-navy hover:bg-navy/10"
                              value={item.plannedDate || ''}
                              onChange={(e) => onUpdateDate(item.id, e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-safari italic flex items-center gap-1.5 bg-safari/5 px-2 py-1 rounded">
                             <div className="w-1 h-1 bg-safari rounded-full"></div>
                             Fixed Date
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-navy p-8 rounded-2xl sticky top-28 space-y-8 text-white shadow-xl">
            <h3 className="text-2xl font-serif font-bold border-b border-white/10 pb-4">Trip Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-white/60">
                <span className="text-[11px] uppercase tracking-widest font-bold">Items</span>
                <span className="text-xl font-bold font-serif text-safari">{savedPlaces.length}</span>
              </div>
              <div className="flex justify-between items-center text-white/60">
                <span className="text-[11px] uppercase tracking-widest font-bold">Days</span>
                <span className="text-xl font-bold font-serif text-white">10 Days</span>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-safari/80 font-medium italic leading-relaxed">Book tour operators directly for the best local rates.</p>
            </div>

            <button className="w-full h-12 bg-safari hover:bg-safari-light text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95">
              Export Itinerary <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
