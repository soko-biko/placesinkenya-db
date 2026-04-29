
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-navy/5 px-4 py-3 md:px-8 bg-beige/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          {LOGO}
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-navy group-hover:text-safari transition-colors">
            PlacesInKenya
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <button 
            onClick={() => onNavigate('home')}
            className={`transition-colors font-black uppercase tracking-widest text-[10px] ${activePage === 'home' ? 'text-safari' : 'text-navy hover:text-safari'}`}
          >
            Explore
          </button>
          <button 
            onClick={() => onNavigate('where-to-go')}
            className={`transition-colors font-black uppercase tracking-widest text-[10px] ${activePage === 'where-to-go' ? 'text-safari' : 'text-navy hover:text-safari'}`}
          >
            Where to Go
          </button>
          <button 
            onClick={() => onNavigate('operators')}
            className={`transition-colors font-black uppercase tracking-widest text-[10px] ${activePage === 'operators' ? 'text-safari' : 'text-navy hover:text-safari'}`}
          >
            Operators
          </button>
          <div className="relative">
            <button 
              onClick={() => onNavigate('trips')}
              className={`transition-colors font-black uppercase tracking-widest text-[10px] ${activePage === 'trips' ? 'text-safari' : 'text-navy hover:text-safari'}`}
            >
              Trip Planner
            </button>
            {tripCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-safari text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-safari/30">
                {tripCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10 cursor-pointer hover:bg-navy/10 transition-all"
                onClick={() => onNavigate('trips')}
              >
                <div className="w-6 h-6 rounded-full bg-safari flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:inline text-navy">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-navy/5 rounded-full transition-colors text-navy/70 hover:text-navy"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="px-6 py-2 bg-safari hover:bg-safari-light text-white rounded-full font-semibold transition-all shadow-lg shadow-safari/20"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
