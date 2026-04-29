
import React, { useState } from 'react';
import { MapPin, User, LogOut, Heart, Search, ChevronDown, Utensils, Music, Coffee, TreePine, Mountain, Compass } from 'lucide-react';
import { LOGO } from '../constants';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
  tripCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenAuth, onNavigate, activePage, tripCount = 0 }) => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const exploreItems = [
    { id: 'restaurants', label: 'Restaurants & Food', icon: Utensils },
    { id: 'entertainment', label: 'Entertainment & Nightlife', icon: Music },
    { id: 'hangout-spots', label: 'Hangout Spots', icon: Coffee },
    { id: 'outdoors', label: 'Outdoor Activities', icon: TreePine },
    { id: 'adventures', label: 'Adventures', icon: Mountain },
    { id: 'safaris', label: 'Safaris & Nature', icon: Compass },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-navy/98 border-b border-white/5 px-4 h-[72px] flex items-center shadow-lg">
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group py-2"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden bg-white p-1.5 shadow-inner shrink-0">
            <img 
              src="/logo.png" 
              alt="PlacesInKenya" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48?text=PK&bg=ffffff';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-safari transition-colors leading-tight">
              PlacesInKenya
            </span>
            <span className="text-[10px] text-white/50 hidden md:block font-medium">Kenya's #1 Travel Guide</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 font-medium">
          <div className="relative" onMouseEnter={() => setIsExploreOpen(true)} onMouseLeave={() => setIsExploreOpen(false)}>
            <button 
              onClick={() => onNavigate('home')}
              className={`transition-all font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 px-4 h-11 rounded-lg ${activePage === 'home' || exploreItems.some(i => activePage === i.id) ? 'text-safari bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              Explore <ChevronDown size={14} className={`transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isExploreOpen && (
              <div className="absolute top-full left-0 w-[260px] bg-navy border border-white/10 rounded-2xl p-2 shadow-2xl mt-1 animate-fade-in">
                {exploreItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsExploreOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group/item ${activePage === item.id ? 'bg-safari/10 text-safari' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    <item.icon size={16} className={activePage === item.id ? 'text-safari' : 'text-white/40 group-hover/item:text-safari transition-colors'} />
                    <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <button
                    onClick={() => {
                      onNavigate('home');
                      setIsExploreOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all text-left"
                  >
                    <Search size={16} className="text-white/40" />
                    <span className="text-xs font-bold uppercase tracking-wider">All Places</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => onNavigate('where-to-go')}
            className={`transition-all font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 px-4 h-11 rounded-lg ${activePage === 'where-to-go' ? 'text-safari bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Events
          </button>
          
          <div className="relative">
            <button 
              onClick={() => onNavigate('trips')}
              className={`transition-all font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 px-4 h-11 rounded-lg ${activePage === 'trips' ? 'text-safari bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              Trip Planner
            </button>
            {tripCount > 0 && (
              <span className="absolute top-1 right-1 bg-safari text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {tripCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-2 pr-4 h-11 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all pl-2"
                onClick={() => onNavigate('trips')}
              >
                <div className="w-7 h-7 rounded-lg bg-safari flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="text-[13px] font-bold hidden sm:inline text-white/80">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
              </div>
              <button 
                onClick={onLogout}
                className="w-11 h-11 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="px-6 h-11 bg-safari hover:bg-safari-light text-white rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
