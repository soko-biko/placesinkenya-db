import React from 'react';
import { motion } from 'motion/react';
import { LogOut, User, Plus, Compass, Home, Calendar, Users } from 'lucide-react';

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
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Explore' },
    { id: 'where-to-go', label: 'Events' },
    { id: 'operators', label: 'Operators & Guides' },
  ];

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'destinations', label: 'Explore', icon: <Compass size={18} /> },
    { id: 'where-to-go', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'operators', label: 'Partners', icon: <Users size={18} /> },
    { id: 'trips', label: 'My Kenya', icon: <User size={18} /> },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  return (
    <>
      {/* Top Navbar Container */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-[100] bg-[#FAFAF8]/90 backdrop-blur-[12px] border-b border-navy/5 px-4 sm:px-6 lg:px-8 h-16 flex items-center shadow-sm">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Left Zone: Logo and App Name */}
          <div 
            id="navbar-logo"
            className="flex items-center cursor-pointer group py-1 shrink-0 animate-fade-in"
            onClick={() => handleNavigate('home')}
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1G9iYeJQ4q67zu7dBwjXm9BTz_boLAzco" 
              alt="PlacesInKenya Logo" 
              className="h-14 w-14 object-contain -ml-3.5 -mr-4 shrink-0 transition-transform duration-300 group-hover:scale-105" 
            />
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

          {/* Right Zone: List Business + Profile Indicators */}
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

            {/* Auth controls for Desktop/Mobile (No Hamburger Drawer) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {user ? (
                <>
                  <button
                    id="navbar-btn-profile-shortcut"
                    onClick={() => handleNavigate('trips')}
                    className={`h-10 px-3 sm:px-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activePage === 'trips'
                        ? 'bg-navy text-white shadow-md'
                        : 'bg-navy/5 text-navy/75 hover:bg-navy/10'
                    }`}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} className="w-5 h-5 rounded-full object-cover shadow-sm bg-white" alt="" />
                    ) : (
                      <User size={13} className="text-safari" />
                    )}
                    <span className="hidden md:inline">My Kenya {tripCount > 0 && `(${tripCount})`}</span>
                  </button>
                  
                  <button
                    id="navbar-btn-logout-desktop"
                    onClick={onLogout}
                    title="Sign Out"
                    className="hidden lg:flex w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/15 text-red-500 items-center justify-center transition-all cursor-pointer border border-red-500/5 active:scale-90"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <button
                  id="navbar-btn-signin-header"
                  onClick={onOpenAuth}
                  className="h-10 px-4 sm:px-5 border border-navy/20 text-navy hover:bg-navy hover:text-white rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar Navigation */}
      <div 
        id="mobile-bottom-tabs" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[120] bg-[#FAFAF8]/95 backdrop-blur-[12px] border-t border-navy/5 h-16 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(13,27,42,0.06)]"
      >
        {bottomNavItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all relative cursor-pointer"
            >
              <div className={`transition-all duration-200 ${isActive ? 'text-safari scale-110 font-bold' : 'text-navy/40 hover:text-navy/70'}`}>
                {item.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.1em] mt-1 select-none transition-colors duration-200 ${isActive ? 'text-safari font-black' : 'text-navy/40 font-bold'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.span 
                  layoutId="activeTabDot" 
                  className="absolute bottom-1 w-1 h-1 bg-safari rounded-full" 
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
