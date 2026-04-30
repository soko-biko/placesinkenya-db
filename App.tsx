
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
import { X, Mail, Lock, ShieldCheck, Plus, AlertCircle, CheckCircle2, MapPin, Star, Calendar, ArrowRight, ChevronRight, Search } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { usePlaces, useTrendingPlaces, useOperators } from './hooks/useFirestore';
import { placesService, providersService } from './firebase/services';
import { motion, AnimatePresence } from 'motion/react';
import { PartnerOnboarding } from './components/PartnerOnboarding';
import { WhereToGo } from './components/WhereToGo';
import { CategoryQuickGrid } from './components/CategoryQuickGrid';
import { ExploreByCity } from './components/ExploreByCity';
import { CategoryPage } from './components/CategoryPage';

const App: React.FC = () => {
  const { userProfile, login, signup, logout, isAuthenticated, isAdmin } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [destinationFilter, setDestinationFilter] = useState({ query: '', category: 'ALL' as PlaceCategory | 'ALL', city: '' });
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

  const allDisplayPlaces = places.length > 0 ? places : MOCK_PLACES;

  const filteredPlaces = allDisplayPlaces.filter(p => {
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

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCityClick = (city: string) => {
    setDestinationFilter(prev => ({ ...prev, city, query: '' }));
    setActivePage('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-0">
            <Hero onSearch={(q) => { setDestinationFilter(prev => ({ ...prev, query: q })); setActivePage('destinations'); }} trendingPlaces={trendingPlaces.length > 0 ? trendingPlaces : MOCK_PLACES.filter(p => p.isTrending)} />
            
            <TrendingTicker 
              places={trendingPlaces.length > 0 ? trendingPlaces : MOCK_PLACES.filter(p => p.isTrending)} 
              onPlaceClick={(place) => setSelectedPlace(place)} 
            />
            
            <ExploreByCity onCityClick={handleCityClick} />
          </motion.main>
        );
      case 'destinations':
        return (
          <motion.main key="destinations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-20 px-4 max-w-7xl mx-auto space-y-12">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy">Catalogue of Wonders</h1>
              <p className="text-navy/50 text-xl font-light">Explore every verified gem in our collection.</p>
            </div>
            
            <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row items-center shadow-xl w-full max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-6 w-full md:flex-1 border-b md:border-b-0 md:border-r border-navy/5">
                <Search className="text-safari" size={24} />
                <input 
                  type="text" 
                  value={destinationFilter.query}
                  onChange={(e) => setDestinationFilter(prev => ({ ...prev, query: e.target.value }))}
                  placeholder="Search destinations, cities, or vibes..." 
                  className="w-full h-14 bg-transparent outline-none text-navy font-medium placeholder:text-navy/20"
                />
              </div>
              <div className="flex items-center gap-2 px-4 w-full md:w-auto">
                 <select 
                   value={destinationFilter.category}
                   onChange={(e) => setDestinationFilter(prev => ({ ...prev, category: e.target.value as any }))}
                   className="bg-transparent text-navy font-bold uppercase tracking-widest text-[11px] px-4 h-14 outline-none cursor-pointer"
                 >
                   <option value="ALL">All Categories</option>
                   {Object.values(PlaceCategory).map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                 </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {['Nairobi', 'Mombasa', 'Diani', 'Watamu', 'Lamu', 'Nanyuki', 'Naivasha', 'Kisumu'].map(city => (
                <button
                  key={city}
                  onClick={() => setDestinationFilter(prev => ({ ...prev, city: prev.city === city ? '' : city }))}
                  className={`px-6 h-10 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${destinationFilter.city === city ? 'bg-safari text-white' : 'bg-navy/5 text-navy/40 hover:bg-navy/10'}`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allDisplayPlaces.filter(p => {
                const matchesQuery = p.name.toLowerCase().includes(destinationFilter.query.toLowerCase()) || 
                  p.location.toLowerCase().includes(destinationFilter.query.toLowerCase());
                const matchesCategory = destinationFilter.category === 'ALL' || p.category === destinationFilter.category;
                const matchesCity = !destinationFilter.city || p.location.toLowerCase().includes(destinationFilter.city.toLowerCase());
                return matchesQuery && matchesCategory && matchesCity;
              }).map(place => (
                <PlaceCard key={place.id} place={place} onClick={setSelectedPlace} />
              ))}
            </div>
          </motion.main>
        );
      case 'where-to-go':
        return <WhereToGo events={MOCK_EVENTS} onAddToTrip={handleSaveEvent} savedItemIds={savedItemIds} />;
      case 'operators':
        return (
          <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-7xl mx-auto px-4 pt-32 pb-20">
            <div className="space-y-6 mb-16">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy">Guides, Operators & Experiences</h1>
              <p className="text-xl text-navy/50 max-w-2xl font-light">Find verified safari guides, tour companies, and local experience hosts across Kenya.</p>
            </div>
            <OperatorsList operators={filteredOperators} />
          </motion.main>
        );
      case 'trips':
        return isAuthenticated ? (
          <TripDashboard 
            savedItems={savedItems} 
            places={[...allDisplayPlaces, ...MOCK_EVENTS.map(e => ({ id: e.id, name: e.title, location: e.location, imageUrl: e.imageUrl, rating: 5, category: e.category, description: e.description, isTrending: false } as Place))]} 
            onRemove={handleRemoveItem}
            onUpdateDate={handleUpdateItemDate}
            onNavigateHome={() => setActivePage('home')}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center py-40">
            <div className="max-w-[450px] mx-auto px-6 text-center space-y-10">
              <div className="w-20 h-20 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto text-navy/20"><Calendar size={40} /></div>
              <div className="space-y-3">
                <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Private Access</span>
                <h2 className="text-3xl font-serif font-bold text-navy">Private Explorer Hub</h2>
                <p className="text-navy/60 text-base font-medium">Sign in to access your custom itinerary, saved gems, and exclusive travel guides.</p>
              </div>
              <button onClick={() => setIsAuthOpen(true)} className="w-full h-12 bg-navy text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-safari transition-all flex items-center justify-center gap-4">
                Sign In to Start Planning <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      case 'onboarding':
        return <PartnerOnboarding onBack={() => setActivePage('home')} />;
      default:
        return null;
    }
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

      <div className="pt-0">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-navy py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-safari/30 to-transparent"></div>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-1 space-y-8">
              <div 
                className="flex items-center gap-4 cursor-pointer group" 
                onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden bg-white p-2 shadow-inner">
                  <img src="/logo.png" alt="PlacesInKenya" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold text-white group-hover:text-safari transition-colors">PlacesInKenya</span>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Kenya's most comprehensive destination guide. Discover the magic of the wild and the pulse of the city.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari mb-8">Establishments</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Restaurants', id: PlaceCategory.RESTAURANTS },
                  { label: 'Entertainment', id: PlaceCategory.ENTERTAINMENT },
                  { label: 'Hangout Spots', id: PlaceCategory.HANGOUT_SPOTS },
                  { label: 'Outdoors', id: PlaceCategory.OUTDOORS },
                  { label: 'Adventures', id: PlaceCategory.ADVENTURES },
                  { label: 'Safaris', id: PlaceCategory.SAFARI }
                ].map(item => (
                  <li key={item.label}>
                    <button 
                      onClick={() => { setDestinationFilter(prev => ({ ...prev, category: item.id })); setActivePage('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari mb-8">Planning</h4>
              <ul className="space-y-4">
                <li><button onClick={() => handleNavigate('home')} className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">All Destinations</button></li>
                <li><button onClick={() => handleNavigate('where-to-go')} className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Upcoming Events</button></li>
                <li><button onClick={() => handleNavigate('trips')} className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Trip Planner</button></li>
                <li><button onClick={() => handleNavigate('operators')} className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Search Operators</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari mb-8">Community</h4>
              <ul className="space-y-4">
                <li><button onClick={() => handleNavigate('onboarding')} className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Partner With Us</button></li>
                <li><button className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Add a Place</button></li>
                <li><button className="text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Global Collective</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">&copy; 2026 PlacesInKenya Collective. All Rights Reserved.</p>
            <div className="flex gap-10">
               <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Privacy</a>
               <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Terms</a>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60" onClick={() => setIsAuthOpen(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-navy w-full max-w-lg p-12 rounded-3xl border border-white/10 space-y-10 text-white shadow-2xl">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-white/5 text-safari flex items-center justify-center rounded-2xl mx-auto border border-white/10"><ShieldCheck size={32} /></div>
               <h2 className="text-3xl font-serif font-bold">{authMode === 'login' ? 'Authenticating' : 'Join the Collective'}</h2>
               <p className="text-white/40 text-sm">{authMode === 'login' ? 'Secure bypass to your cloud-synchronized trip planner.' : 'Register to synchronize your curated destinations.'}</p>
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 text-xs font-medium">{authError}</div>
            )}

            <div className="space-y-4">
              <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 h-12 outline-none focus:border-safari/50 transition-all text-white" />
              <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 h-12 outline-none focus:border-safari/50 transition-all text-white" />
              <button onClick={handleAuth} className="w-full h-12 bg-safari hover:bg-safari-light text-white rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all">
                {authMode === 'login' ? 'Validate Access' : 'Initialize Account'}
              </button>
            </div>
            
            <p className="text-center text-xs text-white/30 font-medium">
              {authMode === 'login' ? "New to PlacesInKenya? " : "Already verified? "}
              <span className="text-safari font-bold cursor-pointer hover:text-white transition-colors" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
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
