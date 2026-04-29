
import React from 'react';
import { Place, SavedItem } from '../types';
import { Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';

interface TripDashboardProps {
  savedItems: SavedItem[];
  places: Place[];
  onRemove: (id: string) => void;
  onNavigateHome: () => void;
}

export const TripDashboard: React.FC<TripDashboardProps> = ({ savedItems, places, onRemove, onNavigateHome }) => {
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
            {savedPlaces.map(item => (
              <div key={item.id} className="group bg-navy text-white p-6 rounded-[2.5rem] border border-white/5 hover:border-safari/30 transition-all flex flex-col sm:flex-row gap-8 items-center shadow-xl shadow-navy/10">
                <div className="w-full sm:w-48 h-48 flex-shrink-0 rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src={item.place!.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-safari uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full">{item.place!.category?.replace('_', ' ')}</span>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                      title="Remove from Planner"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-serif font-bold group-hover:text-safari transition-colors">{item.place!.name}</h3>
                    <div className="flex items-center gap-2 text-white/50 text-base">
                      <MapPin size={16} className="text-safari" />
                      <span>{item.place!.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-black tracking-widest pt-4 border-t border-white/5">
                    <Calendar size={14} className="text-safari" />
                    <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
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
