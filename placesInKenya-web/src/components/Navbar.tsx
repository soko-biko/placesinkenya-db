
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, LogOut, Heart, ChevronDown, Utensils, Music, Coffee, TreePine, Mountain, Compass, Menu, X, Plus } from 'lucide-react';
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
    { id: 'destinations', label: 'Explore' },
    { id: 'where-to-go', label: 'Events' },
    { id: 'operators', label: 'Operators & Guides' },
    { id: 'about', label: 'About' },
  ];

  const handleNavigate = (page: string) => {
    if (page === 'about') return; // Placeholder
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-navy/5 px-4 h-16 sm:h-24 flex items-center shadow-sm">
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        {/* Logo Left */}
        <div 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group py-2 shrink-0"
          onClick={() => handleNavigate('home')}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-navy p-1.5 sm:p-2 shadow-lux shrink-0 lux-transition group-hover:scale-105">
            <img src="/regenerated_image_1777526382608.png" alt="PlacesInKenya" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-navy leading-tight">
              PlacesInKenya
            </span>
            <span className="text-[8px] sm:text-[9px] text-safari font-black uppercase tracking-[0.3em] ml-0.5 opacity-80">Collective</span>
          </div>
        </div>

        {/* Desktop Links Center */}
        <div className="hidden lg:flex items-center gap-1 font-medium mx-8">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`transition-all font-bold uppercase tracking-[0.2em] text-[10px] px-6 h-12 rounded-xl tap-target ${activePage === item.id ? 'text-navy bg-navy/5' : 'text-navy/40 hover:text-navy hover:bg-navy/5'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions Right */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavigate('trips')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-safari transition-colors tap-target"
              >
                My Kenya {tripCount > 0 && <span className="w-5 h-5 bg-safari text-white rounded-full flex items-center justify-center text-[9px]">{tripCount}</span>}
              </button>
              <div className="w-[1px] h-6 bg-navy/10 mx-2"></div>
              <button onClick={onLogout} className="text-navy/40 hover:text-red-500 transition-colors tap-target px-2"><LogOut size={18} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <button 
                  onClick={onOpenAuth}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/50 hover:text-navy transition-colors px-4 tap-target"
               >
                  Sign In
               </button>
               <button 
                  onClick={() => handleNavigate('onboarding')}
                  className="relative group px-8 h-12 bg-navy text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all shadow-lux active:scale-95 flex items-center gap-3"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Plus size={14} className="text-safari group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
                  <span className="relative z-10">List Your Business</span>
               </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-11 h-11 flex items-center justify-center bg-navy/5 rounded-xl text-navy transition-all active:scale-90"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Full Screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-2xl z-[200] overflow-y-auto"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-navy/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy p-1.5 flex items-center justify-center">
                     <img src="/regenerated_image_1777526382608.png" className="w-full h-full object-contain brightness-0 invert" alt="logo" />
                  </div>
                  <span className="font-serif font-bold text-navy">Collective</span>
               </div>
               <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-11 h-11 flex items-center justify-center bg-navy/5 rounded-xl text-navy"
               >
                  <X size={20} />
               </button>
            </div>

            <div className="px-6 py-12 flex flex-col gap-12 min-h-[calc(100vh-64px)]">
              <div className="space-y-6">
                <span className="text-safari font-black uppercase tracking-[0.4em] text-[10px] block border-l-2 border-safari pl-4">Registry Navigation</span>
                <div className="grid grid-cols-1 gap-2">
                  {navItems.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-8 h-16 rounded-2xl text-left font-black uppercase tracking-[0.2em] text-[10px] transition-all ${activePage === item.id ? 'bg-navy text-white shadow-xl translate-x-2' : 'bg-navy/5 text-navy/40 active:bg-navy/10'}`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="-rotate-90 opacity-40" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-10 border-t border-navy/10 space-y-8 pb-12">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center text-safari">
                      <User size={24} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Explorer Status</span>
                      <span className="text-sm font-bold text-navy">{user ? user.email : 'Guest Resident'}</span>
                   </div>
                </div>
                
                {user ? (
                   <button 
                      onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} 
                      className="w-full h-16 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95"
                   >
                      <LogOut size={16} /> Terminate Session
                   </button>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                      className="w-full h-16 border border-navy/10 text-navy/60 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] active:bg-navy/5 transition-all"
                    >
                      Initiate Handshake (Sign In)
                    </button>
                    <button 
                      onClick={() => { handleNavigate('onboarding'); setIsMobileMenuOpen(false); }}
                      className="w-full h-24 bg-gradient-to-br from-navy to-navy-light text-white rounded-[28px] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-navy/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden border border-white/5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-safari/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-center gap-3 relative z-10">
                        <Compass size={18} className="text-safari group-hover:rotate-180 transition-transform duration-1000" />
                        <span>Partner Portal</span>
                      </div>
                      <span className="text-[8px] opacity-40 font-medium tracking-[0.6em] relative z-10">List Your Business</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
