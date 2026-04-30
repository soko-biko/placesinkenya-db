
import React, { useState } from 'react';
import { MapPin, User, LogOut, Heart, ChevronDown, Utensils, Music, Coffee, TreePine, Mountain, Compass, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'where-to-go', label: 'Events' },
    { id: 'trips', label: 'Trip Planner' },
    { id: 'operators', label: 'Operators' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-navy/98 border-b border-white/5 px-4 h-[72px] flex items-center shadow-lg">
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group py-2"
          onClick={() => handleNavigate('home')}
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

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-2 font-medium">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`transition-all font-bold uppercase tracking-widest text-[11px] px-4 h-11 rounded-lg ${activePage === item.id ? 'text-safari bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {item.label}
              {item.id === 'trips' && tripCount > 0 && (
                <span className="ml-2 bg-safari text-white text-[9px] font-black w-4 h-4 rounded-full inline-flex items-center justify-center">
                  {tripCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-2 pr-4 h-11 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all pl-2"
                onClick={() => handleNavigate('trips')}
              >
                <div className="w-7 h-7 rounded-lg bg-safari flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="text-[13px] font-bold hidden sm:inline text-white/80">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
              </div>
              <button 
                onClick={onLogout}
                className="hidden sm:flex w-11 h-11 items-center justify-center hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="hidden sm:block px-6 h-11 bg-safari hover:bg-safari-light text-white rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex items-center justify-center bg-white/5 rounded-xl text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-navy z-[90] p-6 animate-fade-in flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-4">
            <span className="text-safari font-bold uppercase tracking-widest text-[10px]">Site Navigation</span>
            <div className="grid grid-cols-1 gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-left font-bold uppercase tracking-widest text-sm transition-all ${activePage === item.id ? 'bg-safari text-white' : 'bg-white/5 text-white/60'}`}
                >
                  {item.label}
                  {item.id === 'trips' && tripCount > 0 && (
                    <span className="bg-white text-navy text-[10px] font-black px-2 py-1 rounded-full">
                      {tripCount} items
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-safari font-bold uppercase tracking-widest text-[10px]">Account</span>
            {user ? (
              <div className="flex flex-col gap-2">
                <button 
                   onClick={() => handleNavigate('trips')}
                   className="w-full flex items-center gap-4 bg-white/5 p-4 rounded-2xl text-white"
                >
                   <div className="w-10 h-10 rounded-xl bg-safari flex items-center justify-center font-bold">
                     {user?.name?.[0] || 'U'}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-bold text-sm">{user?.name || 'My Profile'}</span>
                     <span className="text-[10px] text-white/40 uppercase tracking-widest">Plan Itinerary</span>
                   </div>
                </button>
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 h-14 bg-red-500/10 text-red-500 rounded-2xl font-bold uppercase tracking-widest text-[11px] mt-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                className="w-full h-16 bg-safari text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl"
              >
                Sign In to PlacesInKenya
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
