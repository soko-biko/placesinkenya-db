
import React from 'react';
import { MapPin, User, LogOut, Heart, Search } from 'lucide-react';
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
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-xl border-b border-white/5 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-white p-1.5 shadow-inner">
            <img 
              src="/logo.png" 
              alt="PlacesInKenya" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48?text=PK&bg=ffffff';
              }}
            />
          </div>
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-safari transition-colors">
            PlacesInKenya
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-10 font-medium">
          <button 
            onClick={() => onNavigate('home')}
            className={`transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-2 pb-1 border-b-2 ${activePage === 'home' ? 'text-safari border-safari' : 'text-white/60 border-transparent hover:text-white'}`}
          >
            <Search size={14} /> Explore
          </button>
          <button 
            onClick={() => onNavigate('where-to-go')}
            className={`transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-2 pb-1 border-b-2 ${activePage === 'where-to-go' ? 'text-safari border-safari' : 'text-white/60 border-transparent hover:text-white'}`}
          >
            <MapPin size={14} /> Where to Go
          </button>
          <button 
            onClick={() => onNavigate('operators')}
            className={`transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-2 pb-1 border-b-2 ${activePage === 'operators' ? 'text-safari border-safari' : 'text-white/60 border-transparent hover:text-white'}`}
          >
            <User size={14} /> Operators
          </button>
          <div className="relative">
            <button 
              onClick={() => onNavigate('trips')}
              className={`transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-2 pb-1 border-b-2 ${activePage === 'trips' ? 'text-safari border-safari' : 'text-white/60 border-transparent hover:text-white'}`}
            >
              <Heart size={14} /> Trips
            </button>
            {tripCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-safari text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-safari/30">
                {tripCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => onNavigate('trips')}
              >
                <div className="w-7 h-7 rounded-lg bg-safari flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-safari/20">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="text-sm font-bold hidden sm:inline text-white/80">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="px-8 py-2.5 bg-safari hover:bg-safari-light text-white rounded-xl font-bold transition-all shadow-xl shadow-safari/20 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
