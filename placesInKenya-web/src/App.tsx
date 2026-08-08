
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlaceCard } from './components/PlaceCard';
import { LOGO, MOCK_PLACES, MOCK_OPERATORS, MOCK_EVENTS } from './constants';
import { Place, TourOperator, SavedItem, PlaceCategory, Event, Rating } from './types';
import { X, Mail, Lock, ShieldCheck, Plus, AlertCircle, CheckCircle2, MapPin, Star, Calendar, ArrowRight, ChevronRight, Search, ChevronDown } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { usePlaces, useTrendingPlaces, useOperators, useEvents } from './hooks/useFirestore';
import { motion, AnimatePresence } from 'motion/react';

// Lazy Components
const PartnerRegistration = lazy(() => import('./components/PartnerRegistration').then(m => ({ default: m.PartnerRegistration })));
const CataloguePage = lazy(() => import('./components/CataloguePage').then(m => ({ default: m.CataloguePage })));
const WhereToGo = lazy(() => import('./components/WhereToGo').then(m => ({ default: m.WhereToGo })));
const OperatorsList = lazy(() => import('./components/OperatorsList').then(m => ({ default: m.OperatorsList })));
const MyKenya = lazy(() => import('./components/MyKenya').then(m => ({ default: m.MyKenya })));
const PlaceDetailModal = lazy(() => import('./components/PlaceDetailModal').then(m => ({ default: m.PlaceDetailModal })));
const AuthFlow = lazy(() => import('./components/AuthFlow').then(m => ({ default: m.AuthFlow })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

import { TrendingNow } from './components/TrendingNow';
import { UpcomingExperiences } from './components/UpcomingExperiences';
// Import commented out per design update
// import { CityExplorer } from './components/CityExplorer';
import { OperatorSpotlight } from './components/OperatorSpotlight';
import { StatsBar } from './components/StatsBar';
import { PartnerInviteStrip } from './components/PartnerInviteStrip';
import { Container } from './components/Container';

const SkeletonLoader = () => (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center space-y-8">
        <div className="w-20 h-20 bg-navy/5 rounded-[2rem] animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-safari border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-navy/20 animate-pulse">Synchronizing Registry Data...</p>
    </div>
);

const FooterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 md:border-none pb-6 md:pb-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between md:hidden py-4"
      >
        <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari">{title}</h4>
        <ChevronDown size={14} className={`text-safari transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <h4 className="hidden md:block font-bold uppercase tracking-widest text-[11px] text-safari mb-8">{title}</h4>
      <div className={`${isOpen ? 'block' : 'hidden'} md:block animate-fade-in`}>
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { userProfile, login, signup, logout, isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [destinationFilter, setDestinationFilter] = useState({ query: '', category: 'ALL' as PlaceCategory | 'ALL', city: '' });
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [userReviews, setUserReviews] = useState<Rating[]>([]);
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
  const { events: firestoreEvents } = useEvents();

  const [customEvents, setCustomEvents] = useState<Event[]>([]);
  const [customPlaces, setCustomPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const loadedEvents = localStorage.getItem('places_custom_events');
    if (loadedEvents) {
      try {
        setCustomEvents(JSON.parse(loadedEvents));
      } catch (e) {
        console.error(e);
      }
    }
    const loadedPlaces = localStorage.getItem('places_custom_partners');
    if (loadedPlaces) {
      try {
        setCustomPlaces(JSON.parse(loadedPlaces));
      } catch (e) {
        console.error(e);
      }
    }
  }, [activePage]);

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

  const handleToggleCompleted = (id: string) => {
    setSavedItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };
  
  const handleAddReview = (rating: number, comment: string, placeId: string) => {
    if (!userProfile) return;
    const newReview: Rating = {
      id: Math.random().toString(36).substr(2, 9),
      userId: userProfile.uid,
      placeId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    setUserReviews(prev => [newReview, ...prev]);
  };

  const openOperatorView = (tags: string[]) => {
    setOperatorFilter(tags || []);
    setActivePage('operators');
    setSelectedPlace(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawEvents = [...firestoreEvents, ...customEvents, ...MOCK_EVENTS];
  const mergedEvents = rawEvents.filter((ev, idx, self) => self.findIndex(e => e.id === ev.id) === idx);

  const rawPlaces = [...customPlaces, ...places];
  MOCK_PLACES.forEach(mp => {
    if (!rawPlaces.some(p => p.id === mp.id)) rawPlaces.push(mp);
  });
  const allDisplayPlaces = rawPlaces;

  const rawOperators = [...operators];
  MOCK_OPERATORS.forEach(mo => {
    if (!rawOperators.some(o => o.id === mo.id)) rawOperators.push(mo);
  });
  const displayOperators = rawOperators;
  const filteredOperators = operatorFilter.length > 0 
    ? displayOperators.filter(o => o.specialties?.some(s => operatorFilter.includes(s)))
    : displayOperators;

  const savedItemIds = savedItems.map(i => i.placeId);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 120);
  };

  const handleCityClick = (city: string) => {
    setDestinationFilter(prev => ({ ...prev, city, query: '' }));
    setActivePage('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (q: string, category?: string) => {
    setDestinationFilter(prev => ({ 
      ...prev, 
      query: q, 
      category: (category as any) || 'ALL' 
    }));
    setActivePage('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-0 overflow-x-hidden">
            <Hero onSearch={handleHeroSearch} trendingPlaces={trendingPlaces.length > 0 ? trendingPlaces : MOCK_PLACES.filter(p => p.isTrending)} />
            
            <TrendingNow 
              places={trendingPlaces.length > 0 ? trendingPlaces : MOCK_PLACES.filter(p => p.isTrending)} 
              onPlaceClick={(place) => setSelectedPlace(place)}
              onViewAll={() => setActivePage('destinations')}
            />

            <UpcomingExperiences 
              events={mergedEvents} 
              onViewAll={() => setActivePage('where-to-go')}
            />
            
            {/* REMOVED: Hubs section removed per design update */}

            <OperatorSpotlight operators={displayOperators} />

            <StatsBar />

            <PartnerInviteStrip onPartnerClick={() => setActivePage('partner-registration')} />
          </motion.main>
        );
      case 'destinations':
        return (
          <CataloguePage 
            initialPlaces={allDisplayPlaces}
            initialSearch={destinationFilter.query}
            initialCategory={destinationFilter.category}
            onPlaceClick={setSelectedPlace}
            onSave={(id) => handleSaveItem(id)}
            savedItemIds={savedItemIds}
          />
        );
      case 'where-to-go':
        return <WhereToGo events={mergedEvents} onAddToTrip={handleSaveEvent} savedItemIds={savedItemIds} />;
      case 'operators':
        return (
          <motion.main 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="min-h-screen bg-off-white pb-32"
          >
            <section className="relative pt-48 pb-24 bg-navy overflow-hidden">
               <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
                    className="w-full h-full object-cover opacity-10 grayscale mix-blend-overlay"
                    alt="Wild"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy to-navy"></div>
               </div>

               <Container className="relative z-10 text-center space-y-12">
                  <div className="space-y-4">
                     <motion.span 
                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                       className="text-safari font-black uppercase tracking-[0.4em] text-[10px]"
                     >
                       The Human Connection
                     </motion.span>
                     <motion.h1 
                       initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                       className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tight"
                     >
                       Guides & <span className="italic text-safari font-light">Trusted</span> Partners
                     </motion.h1>
                     <motion.p 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                       className="text-white/40 max-w-2xl mx-auto text-lg font-light italic"
                     >
                       Connect with Kenya's most respected safari specialists, coastal masters, and local cultural hosts.
                     </motion.p>
                  </div>
               </Container>
            </section>

            <Container className="-mt-10 relative z-20">
               <OperatorsList operators={displayOperators} />
            </Container>
          </motion.main>
        );
      case 'trips':
        return isAuthenticated ? (
          <MyKenya 
            savedPlaces={allDisplayPlaces.filter(p => savedItems.filter(i => !i.isEvent).map(i => i.placeId).includes(p.id))}
            savedEvents={mergedEvents.filter(e => savedItems.filter(i => i.isEvent).map(i => i.placeId).includes(e.id))}
            savedItems={savedItems}
            onUpdateDate={handleUpdateItemDate}
            onToggleCompleted={handleToggleCompleted}
            onRemoveItem={handleRemoveItem}
            onReviewItem={setSelectedPlace}
            onAddReview={handleAddReview}
            reviews={userReviews}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center py-40 bg-navy">
            <div className="max-w-[450px] mx-auto px-6 text-center space-y-10">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-safari border border-white/10 shadow-2xl animate-bounce-slow"><Lock size={40} /></div>
              <div className="space-y-3">
                <span className="text-safari font-bold uppercase tracking-[0.4em] text-[10px]">Private Explorer Hub</span>
                <h2 className="text-4xl font-serif font-bold text-white">Your Kenya, Personalized</h2>
                <p className="text-white/40 text-base font-light italic leading-relaxed">Sign in to access your custom itinerary repository, saved aesthetic gems, and exclusive collective reviews.</p>
              </div>
              <button 
                onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} 
                className="w-full h-16 bg-safari text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-safari/20 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                Sign In to Start Planning <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        );
      case 'partner-registration':
        return <PartnerRegistration />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-500 overflow-x-hidden scrollbar-hide text-navy font-sans">
      <Navbar 
        user={userProfile} 
        onLogout={logout} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={handleNavigate}
        activePage={activePage}
        tripCount={savedItems.length}
      />

      <div className="pt-0 pb-16 lg:pb-0">
        <Suspense fallback={<SkeletonLoader />}>
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </Suspense>
      </div>

      {/* Footer styled with Niko Free style sheets */}
      <footer className="bg-navy pt-20 pb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-safari/30 to-transparent"></div>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-20">
            {/* Brand Column */}
            <div className="space-y-6">
              <div 
                className="flex items-center cursor-pointer group" 
                onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <img 
                  src="https://lh3.googleusercontent.com/d/1G9iYeJQ4q67zu7dBwjXm9BTz_boLAzco" 
                  alt="PlacesInKenya Logo" 
                  className="h-16 w-16 object-contain -ml-4 -mr-4.5 shrink-0 transition-transform duration-300 group-hover:scale-105" 
                />
                <span className="font-serif text-2xl font-bold text-white group-hover:text-safari transition-colors">PlacesInKenya</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Kenya's most comprehensive destination guide. Discover the magic of the wild and the pulse of the city through our curated aesthetic database.
              </p>
              {/* Social icons with hover lift */}
              <div className="flex gap-4 pt-2">
                {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                  <a 
                    key={social} 
                    href={`https://${social}.com`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:-translate-y-[2px] hover:border-white/30 transition-all duration-300 bg-white/5 active:scale-95"
                    title={social}
                  >
                    <span className="text-xs uppercase font-extrabold tracking-widest text-[8px]">{social.charAt(0)}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Categories Column */}
            <FooterSection title="Establishments">
              <ul className="space-y-4">
                {[
                  { label: 'Restaurants', id: PlaceCategory.RESTAURANT },
                  { label: 'Entertainment', id: PlaceCategory.ENTERTAINMENT },
                  { label: 'Hangout Spots', id: PlaceCategory.HANGOUT_SPOTS },
                  { label: 'Outdoors', id: PlaceCategory.OUTDOORS },
                  { label: 'Adventures', id: PlaceCategory.ADVENTURES },
                  { label: 'Safaris', id: PlaceCategory.SAFARI }
                ].map(item => (
                  <li key={item.label}>
                    <button 
                      onClick={() => { setDestinationFilter(prev => ({ ...prev, category: item.id })); setActivePage('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-white/50 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider tap-target"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Quick Links Column */}
            <FooterSection title="Support">
              <ul className="space-y-4">
                <li><button onClick={() => handleNavigate('home')} className="text-white/50 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider tap-target">All Destinations</button></li>
                <li><button onClick={() => handleNavigate('where-to-go')} className="text-white/50 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider tap-target">Upcoming Events</button></li>
                <li><button onClick={() => handleNavigate('trips')} className="text-white/50 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider tap-target">Trip Planner</button></li>
                <li><button onClick={() => handleNavigate('operators')} className="text-white/50 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider tap-target">Search Operators</button></li>
              </ul>
            </FooterSection>

            {/* Newsletter Column */}
            <div className="space-y-6">
              <h4 className="font-bold uppercase tracking-widest text-[11px] text-safari">Newsletter</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                Receive the weekly curated digest of hidden spaces and premium experiences in Kenya.
              </p>
              {/* Inline pill input + primary colored button */}
              <form 
                onSubmit={(e) => { e.preventDefault(); alert("Successfully joined the PlacesInKenya digest!"); }}
                className="relative flex items-center w-full max-w-sm h-12 bg-white/5 border border-white/10 rounded-full focus-within:border-white/30 p-1 group transition-all"
              >
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-transparent pl-4 pr-24 text-white text-xs outline-none font-sans placeholder:text-white/30"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 px-4 bg-safari hover:bg-safari/90 text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-md shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">&copy; 2026 PlacesInKenya. All Rights Reserved.</p>
            <div className="flex gap-10">
               <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Privacy</a>
               <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Terms</a>
            </div>
          </div>
        </Container>
      </footer>

      {/* Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal 
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onAddToTrip={(p, date) => { handleSaveItem(p.id, false, date); setSelectedPlace(null); }}
          onExploreOperators={openOperatorView}
          onAddReview={handleAddReview}
          savedItem={savedItems.find(i => i.placeId === selectedPlace.id)}
          operators={displayOperators}
        />
      )}

      {/* Auth Flow */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthFlow 
            initialMode={authMode}
            onClose={() => setIsAuthOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
