import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, User, FolderHeart, Plus, Compass } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
  tripCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenAuth,
  onNavigate,
  activePage,
  tripCount = 0,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Explore' },
    { id: 'where-to-go', label: 'Events' },
    { id: 'operators', label: 'Operators & Guides' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  // Prevent background scroll when the side drawer is active
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      {/* Navbar Container */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-[100] bg-[#FAFAF8]/90 backdrop-blur-[12px] border-b border-navy/5 px-4 sm:px-6 lg:px-8 h-16 flex items-center shadow-sm">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Left Zone: Logo only (No 'COLLECTIVE' text) */}
          <div 
            id="navbar-logo"
            className="flex items-center gap-2.5 cursor-pointer group py-2 shrink-0"
            onClick={() => handleNavigate('home')}
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-xl overflow-hidden bg-navy p-1.5 shadow-lux shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/regenerated_image_1777526382608.png" 
                alt="PlacesInKenya" 
                className="w-full h-full object-contain brightness-0 invert" 
              />
            </div>
            <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-navy leading-none">
              PlacesInKenya
            </span>
          </div>

          {/* Middle Zone: Desktop Navigation Links (inline) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1 hover:text-safari cursor-pointer ${
                  activePage === item.id 
                    ? 'text-safari font-black' 
                    : 'text-navy/60'
                }`}
              >
                <span>{item.label}</span>
                {activePage === item.id && (
                  <motion.span 
                    layoutId="activeNavLine" 
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-safari rounded-full" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Zone: Always Visible 'List Your Business' CTA + Hamburger Icon */}
          <div id="navbar-actions" className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* CTA Button — list business onboarding trigger */}
            <button 
              id="navbar-cta-list"
              onClick={() => handleNavigate('partner-registration')}
              className="flex items-center gap-1.5 bg-navy hover:bg-safari hover:text-white text-white text-[10px] font-black uppercase tracking-widest px-3 sm:px-5 h-10 rounded-full shadow-md hover:scale-[1.03] transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer"
            >
              <Plus size={13} className="text-safari" />
              <span className="hidden sm:inline">List Your Business</span>
              <span className="sm:hidden">List</span>
            </button>

            {/* Desktop-only Auth controls */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {user ? (
                <>
                  <button
                    id="navbar-btn-trips-desktop"
                    onClick={() => handleNavigate('trips')}
                    className={`h-10 px-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all cursor-pointer ${
                      activePage === 'trips'
                        ? 'bg-navy text-white shadow-md'
                        : 'bg-navy/5 text-navy/70 hover:bg-navy/10'
                    }`}
                  >
                    <Compass size={13} className="text-safari" />
                    <span>My Kenya {tripCount > 0 && `(${tripCount})`}</span>
                  </button>
                  
                  <button
                    id="navbar-btn-logout-desktop"
                    onClick={onLogout}
                    title="Sign Out"
                    className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/15 text-red-500 flex items-center justify-center transition-all cursor-pointer border border-red-500/5 active:scale-90"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <button
                  id="navbar-btn-signin-desktop"
                  onClick={onOpenAuth}
                  className="h-10 px-5 border border-navy/20 text-navy hover:bg-navy hover:text-white rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Menu Sandwich/Hamburger Trigger */}
            <button
              id="navbar-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full hover:bg-navy/5 active:scale-90 transition-all cursor-pointer border border-navy/5"
            >
              <span className={`block w-5 h-[2px] bg-navy rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-[2px] bg-navy rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-[2px] bg-navy rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>

          </div>
        </div>
      </nav>

      {/* Hamburger Drawer & Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              id="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-[6px] pointer-events-auto"
            />

            {/* Side Drawer Panel */}
            <motion.aside
              id="drawer-aside"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 z-[150] h-full w-[320px] max-w-[85vw] bg-[#FAFAF8] shadow-2xl flex flex-col border-l border-navy/5"
            >
              {/* Drawer Header */}
              <div id="drawer-header" className="flex items-center justify-between px-6 h-16 border-b border-navy/5">
                <span className="font-serif font-bold text-lg text-navy">
                  Navigation
                </span>
                <button
                  id="drawer-close"
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-navy/5 text-navy text-xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Drawer Content Area */}
              <div id="drawer-body" className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
                
                {/* Nav Links */}
                <div className="space-y-6">
                  <span className="text-safari font-black uppercase tracking-[0.3em] text-[9px] block pl-1">Registry Pages</span>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item, index) => (
                      <motion.button
                        id={`drawer-link-${item.id}`}
                        key={item.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center justify-between px-5 h-12 rounded-xl text-left font-black uppercase tracking-[0.2em] text-[10px] transition-all ${
                          activePage === item.id 
                            ? 'bg-navy text-white shadow-md translate-x-1' 
                            : 'bg-navy/5 text-navy/50 hover:bg-navy/10 hover:text-navy'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${activePage === item.id ? 'bg-safari' : 'bg-transparent'}`} />
                      </motion.button>
                    ))}
                  </nav>
                </div>

                {/* User Status / Core Actions Section at Bottom of Drawer */}
                <div id="drawer-footer-actions" className="pt-8 border-t border-navy/10 space-y-6">
                  
                  {/* Status Card */}
                  <div className="flex items-center gap-3.5 bg-navy/5 p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-navy/15 flex items-center justify-center text-safari">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-black uppercase tracking-widest text-navy/40">Explorer Account</span>
                      <span className="text-xs font-bold text-navy truncate">
                        {user ? user.email : 'Guest Resident'}
                      </span>
                    </div>
                  </div>

                  {/* Core Status Buttons */}
                  <div className="space-y-3">
                    {user && (
                      <button
                        id="drawer-btn-trips"
                        onClick={() => handleNavigate('trips')}
                        className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all active:scale-95 ${
                          activePage === 'trips'
                            ? 'bg-navy text-white'
                            : 'bg-navy/5 text-navy/70 hover:bg-navy/10'
                        }`}
                      >
                        <Compass size={14} className="text-safari" />
                        <span>My Kenya ({tripCount})</span>
                      </button>
                    )}

                    {user ? (
                      <button
                        id="drawer-btn-logout"
                        onClick={() => {
                          onLogout();
                          setMenuOpen(false);
                        }}
                        className="w-full h-12 bg-red-500/10 text-red-500 hover:bg-red-500/15 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button
                        id="drawer-btn-signin"
                        onClick={() => {
                          onOpenAuth();
                          setMenuOpen(false);
                        }}
                        className="w-full h-12 border border-navy/20 text-navy hover:bg-navy hover:text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 active:scale-95"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
