
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrendingTicker } from './components/TrendingTicker';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { OperatorsList } from './components/OperatorsList';
import { TripDashboard } from './components/TripDashboard';
import { LOGO, MOCK_PLACES, MOCK_OPERATORS, MOCK_EVENTS } from './constants';
import { Place, TourOperator, SavedItem, PlaceCategory, Event } from './types';
import { X, Mail, Lock, ShieldCheck, Plus, AlertCircle, CheckCircle2, MapPin, Star, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { usePlaces, useTrendingPlaces, useOperators } from './hooks/useFirestore';
import { placesService, providersService } from './firebase/services';
import { motion, AnimatePresence } from 'motion/react';
import { PartnerOnboarding } from './components/PartnerOnboarding';
import { WhereToGo } from './components/WhereToGo';

const App: React.FC = () => {
  const { userProfile, login, signup, logout, isAuthenticated, isAdmin } = useAuth();
  const [activePage, setActivePage] = useState<'home' | 'operators' | 'trips' | 'where-to-go' | 'onboarding'>('home');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'ALL'>('ALL');
  const [operatorFilter, setOperatorFilter] = useState<string[]>([]);
  const [pendingSaveId, setPendingSaveId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Firestore Data
  const { places, loading: placesLoading } = usePlaces();
  const { places: trendingPlaces, loading: trendingLoading } = useTrendingPlaces();
  const { operators, loading: operatorsLoading } = useOperators();

  useEffect(() => {
    const storedItems = localStorage.getItem('places_saved_items');
    if (storedItems) setSavedItems(JSON.parse(storedItems));
  }, []);

  useEffect(() => {
    localStorage.setItem('places_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleAuth = async () => {
    setAuthError('');
    try {
      if (authMode === 'login') {
        await login(authEmail, authPassword);
      } else {
        await signup(authEmail, authPassword);
      }
      setIsAuthOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      
      if (pendingSaveId) {
        handleSaveItem(pendingSaveId);
        setPendingSaveId(null);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleSaveItem = (id: string, isEvent: boolean = false, initialDate?: string) => {
    if (!isAuthenticated) {
      setPendingSaveId(id);
      setIsAuthOpen(true);
      return;
    }
    
    if (!savedItems.some(i => i.placeId === id)) {
      const newItem: SavedItem = {
        id: Math.random().toString(36).substr(2, 9),
        placeId: id,
        addedAt: new Date().toISOString(),
        isEvent,
        plannedDate: initialDate
      };
      setSavedItems(prev => [...prev, newItem]);
    }
  };

  const handleSaveEvent = (event: Event) => {
    handleSaveItem(event.id, true, event.date);
  };

  const handleUpdateItemDate = (id: string, date: string) => {
    setSavedItems(prev => prev.map(item => 
      item.id === id ? { ...item, plannedDate: date } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const openOperatorView = (tags: string[]) => {
    setOperatorFilter(tags || []);
    setActivePage('operators');
    setSelectedPlace(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seedDatabase = async () => {
    if (!isAdmin) return;
    try {
      for (const place of MOCK_PLACES) {
        await placesService.create(place);
      }
      for (const op of MOCK_OPERATORS) {
        await providersService.create(op);
      }
      alert('Database seeded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error seeding database');
    }
  };

  const filteredPlaces = (places.length > 0 ? places : MOCK_PLACES).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const displayOperators = (operators.length > 0 ? operators : MOCK_OPERATORS);
  const filteredOperators = operatorFilter.length > 0 
    ? displayOperators.filter(o => o.specialties?.some(s => operatorFilter.includes(s)))
    : displayOperators;

  const savedItemIds = savedItems.map(i => i.placeId);

  const handleNavigate = (page: any) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-beige transition-all duration-500 overflow-x-hidden scrollbar-hide text-navy font-sans">
      <Navbar 
        user={userProfile} 
        onLogout={logout} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={handleNavigate}
        activePage={activePage}
        tripCount={savedItems.length}
      />

      <AnimatePresence mode="wait">
        {activePage === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-20"
          >
            <Hero onSearch={setSearchQuery} trendingPlaces={trendingPlaces.length > 0 ? trendingPlaces : MOCK_PLACES.filter(p => p.isTrending)} />
            
            <TrendingTicker 
              places={trendingPlaces.length > 0 ? trendingPlaces : MOCK_PLACES.filter(p => p.isTrending)} 
              onPlaceClick={(place) => {
                setSelectedPlace(place);
              }} 
            />
            
            <section className="max-w-[1200px] mx-auto px-4 py-20">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                <div className="space-y-2">
                  <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Get Inspired</span>
                  <h2 className="text-navy font-bold leading-tight font-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>Top Destinations in Kenya</h2>
                </div>
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 w-screen md:w-auto relative whitespace-nowrap">
                  <button 
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-5 h-9 rounded-full border transition-all text-[11px] font-bold uppercase tracking-wider ${selectedCategory === 'ALL' ? 'bg-navy border-navy text-white shadow-lg' : 'border-navy/10 text-navy hover:border-navy'}`}
                  >
                    All
                  </button>
                  {Object.values(PlaceCategory).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 h-9 rounded-full border transition-all text-[11px] font-bold uppercase tracking-wider ${selectedCategory === cat ? 'bg-navy border-navy text-white shadow-lg' : 'border-navy/10 text-navy hover:border-navy'}`}
                    >
                      {cat === 'EATS_ENT' ? 'Eats & Entertainment' : cat?.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

               {isAdmin && (
                <div className="mb-12 p-8 bg-navy border border-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold font-serif text-white">Cloud Infrastructure Console</h3>
                    <p className="text-white/50 text-sm font-light">Deploy initial cloud collections to your active database instance.</p>
                  </div>
                  <button 
                    onClick={seedDatabase}
                    className="flex items-center gap-3 bg-safari px-8 h-12 rounded-lg font-bold uppercase tracking-widest text-[11px] text-white hover:bg-safari-light transition-all shadow-xl active:scale-95"
                  >
                    <Plus size={16} /> Initialize Database
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredPlaces.length > 0 ? (
                  filteredPlaces.map(place => (
                    <PlaceCard 
                      key={place.id} 
                      place={place} 
                      onClick={setSelectedPlace} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-40 text-center space-y-8 animate-pulse">
                     <AlertCircle className="mx-auto text-navy/5" size={120} />
                     <div className="space-y-2">
                       <p className="text-3xl font-serif font-bold text-navy/40">No Destinations Found</p>
                       <p className="text-navy/30 text-sm uppercase tracking-widest font-black">Try broadening your exploration filters</p>
                     </div>
                     <button 
                       onClick={() => {setSearchQuery(''); setSelectedCategory('ALL');}}
                       className="px-8 py-3 border border-navy/10 text-navy/40 rounded-full text-xs font-black uppercase tracking-widest hover:border-safari hover:text-safari transition-all"
                     >
                       Reset All Filters
                     </button>
                  </div>
                )}
              </div>
            </section>
          </motion.main>
        )}

        {activePage === 'where-to-go' && (
          <motion.main
            key="where-to-go"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 pt-32 pb-20"
          >
            <WhereToGo 
              events={MOCK_EVENTS} 
              onAddToTrip={handleSaveEvent} 
              savedItemIds={savedItemIds}
            />
          </motion.main>
        )}

        {activePage === 'operators' && (
          <motion.main 
            key="operators"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 pt-32 pb-20"
          >
            <div className="space-y-6 mb-16">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy">Safari & Tour Partners</h1>
              <p className="text-xl text-navy/50 max-w-2xl font-light">Professional guides and companies verified to make your trip unforgettable.</p>
              {operatorFilter.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 pt-8">
                  <span className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">Active Filters:</span>
                  {operatorFilter.map(f => (
                    <span key={f} className="bg-navy text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-white/5 shadow-xl">
                      {f}
                      <X size={14} className="cursor-pointer hover:text-safari transition-colors" onClick={() => setOperatorFilter(prev => prev.filter(x => x !== f))} />
                    </span>
                  ))}
                  <button 
                    onClick={() => setOperatorFilter([])}
                    className="text-[10px] font-black text-safari hover:text-safari-light uppercase tracking-widest ml-4"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            <OperatorsList operators={filteredOperators} />
          </motion.main>
        )}

        {activePage === 'trips' && isAuthenticated && (
          <motion.main
            key="trips"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TripDashboard 
              savedItems={savedItems} 
              places={[...places, ...MOCK_PLACES, ...MOCK_EVENTS.map(e => ({ id: e.id, name: e.title, location: e.location, imageUrl: e.imageUrl, rating: 5, category: e.category, description: e.description, isTrending: false } as Place))]} 
              onRemove={handleRemoveItem}
              onUpdateDate={handleUpdateItemDate}
              onNavigateHome={() => setActivePage('home')}
            />
          </motion.main>
        )}

        {activePage === 'trips' && !isAuthenticated && (
          <motion.main
            key="trips-auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center pt-24 pb-20"
          >
             <div className="max-w-[450px] mx-auto px-6 text-center space-y-10 animate-fade-in">
               <div className="w-20 h-20 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto text-navy/20">
                 <Calendar size={40} />
               </div>
               <div className="space-y-3">
                  <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Private Access</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight">Private Explorer Hub</h2>
                  <p className="text-navy/60 text-base font-medium leading-relaxed">
                    Sign in to access your custom itinerary, saved gems, and exclusive travel guides.
                  </p>
               </div>
               <button 
                onClick={() => setIsAuthOpen(true)}
                className="w-full h-12 bg-navy text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-safari transition-all active:scale-95 flex items-center justify-center gap-4"
              >
                Sign In to Start Planning <ChevronRight size={16} />
              </button>
              <p className="text-[9px] text-navy/30 uppercase font-bold tracking-widest leading-none">Secured by PlacesInKenya Collective</p>
             </div>
          </motion.main>
        )}
        {activePage === 'onboarding' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PartnerOnboarding onBack={() => setActivePage('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-navy py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-safari/50 to-transparent"></div>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-white p-1.5 shadow-inner">
                  <img 
                    src="/logo.png" 
                    alt="PlacesInKenya" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/56?text=PK&bg=ffffff';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold text-white group-hover:text-safari transition-colors">PlacesInKenya</span>
                  <span className="text-xs text-white/40 font-medium">Kenya's #1 Travel Guide</span>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                The world's largest Kenyan travel guidance platform. We help hundreds of travelers each month make every trip their best trip.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari">Explore</h4>
              <ul className="space-y-3">
                <li><button onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white/60 hover:text-white transition-colors text-sm py-1">Destinations</button></li>
                <li><button onClick={() => { setActivePage('operators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white/60 hover:text-white transition-colors text-sm py-1">Safari Operators</button></li>
                <li><button onClick={() => { setActivePage('where-to-go'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white/60 hover:text-white transition-colors text-sm py-1">Upcoming Events</button></li>
                <li><button onClick={() => { setActivePage('trips'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white/60 hover:text-white transition-colors text-sm py-1">Trip Planner</button></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari">Business</h4>
              <ul className="space-y-3">
                <li><button onClick={() => { setActivePage('onboarding'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white/60 hover:text-white transition-colors text-sm py-1">Partner With Us</button></li>
                <li><button className="text-white/60 hover:text-white transition-colors text-sm py-1">Write a Review</button></li>
                <li><button className="text-white/60 hover:text-white transition-colors text-sm py-1">Add a Place</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-bold uppercase tracking-[0.15em]">
            <p>&copy; 2026 PlacesInKenya. A travel community project.</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal 
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onAddToTrip={(p) => { handleSaveItem(p.id); setSelectedPlace(null); }}
          onExploreOperators={openOperatorView}
          isSaved={savedItems.some(i => i.placeId === selectedPlace.id)}
          operators={displayOperators}
        />
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setIsAuthOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-navy w-full max-w-lg p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(15,23,42,0.6)] border border-white/10 space-y-10 text-white"
          >
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-white/5 text-safari flex items-center justify-center rounded-[1.5rem] mx-auto border border-white/10 shadow-2xl">
                 <ShieldCheck size={40} />
               </div>
               <h2 className="text-4xl font-serif font-bold tracking-tight">
                 {authMode === 'login' ? 'Authenticating' : 'Join the Collective'}
               </h2>
               <p className="text-white/40 text-base leading-relaxed font-light">
                 {authMode === 'login' ? 'Secure bypass to your cloud-synchronized trip planner.' : 'Register to synchronize your curated destinations across our cloud network.'}
               </p>
            </div>
            
            {authError && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-start gap-4 text-red-300 text-sm"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{authError}</p>
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Secure Identification</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    type="email" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="email@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-14 py-5 outline-none focus:border-safari/50 transition-all text-white placeholder:text-white/10" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Access Credentials</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-14 py-5 outline-none focus:border-safari/50 transition-all text-white placeholder:text-white/10" 
                  />
                </div>
              </div>
              <button 
                onClick={handleAuth}
                className="w-full py-5 bg-safari hover:bg-safari-light text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-[0_10px_40px_rgba(234,88,12,0.3)] transition-all active:scale-[0.98] mt-4"
              >
                {authMode === 'login' ? 'Validate Access' : 'Initialize Account'}
              </button>
            </div>
            
            <p className="text-center text-sm text-white/30 font-medium">
              {authMode === 'login' ? "New to PlacesInKenya? " : "Already verified? "}
              <span 
                className="text-safari font-black cursor-pointer hover:text-white transition-colors"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              >
                {authMode === 'login' ? 'Request Invite' : 'Authorize Now'}
              </span>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default App;
