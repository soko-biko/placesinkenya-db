import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bookmark, 
  Map as MapIcon, 
  Star, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Mail, 
  Camera, 
  ShieldCheck,
  Compass,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Trash2,
  Clock,
  MapPin,
  MessageCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Place, Event, SavedItem, Rating } from '../types';

interface MyKenyaProps {
  savedPlaces: Place[];
  savedEvents: Event[];
  savedItems: SavedItem[];
  onUpdateDate: (id: string, date: string) => void;
  onToggleCompleted: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onReviewItem: (place: Place) => void;
  onAddReview?: (rating: number, comment: string, placeId: string) => void;
  reviews: Rating[];
}

export const ItineraryItemRow: React.FC<{
  item: SavedItem;
  place?: Place;
  event?: Event;
  onUpdateDate: (id: string, date: string) => void;
  onToggleCompleted: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onReviewItem: (place: Place) => void;
  onAddReview?: (rating: number, comment: string, placeId: string) => void;
}> = ({ item, place, event, onUpdateDate, onToggleCompleted, onRemoveItem, onReviewItem, onAddReview }) => {
  const [flowState, setFlowState] = useState<'default' | 'completed' | 'reviewing' | 'posted'>('default');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);

  const data = place || event;
  if (!data) return null;

  const handleMarkAttended = () => {
    onToggleCompleted(item.id);
    setFlowState('completed');
  };

  const handlePostReview = async () => {
    if (!reviewText.trim()) return;
    setPosting(true);
    try {
      if (onAddReview) {
        onAddReview(rating, reviewText.trim(), item.placeId);
      }
      setFlowState('posted');
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleClose = () => {
    setFlowState('default');
  };

  const imgUrl = place?.imageUrl || event?.imageUrl || '/placeholder.jpg';

  return (
    <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 sm:p-5 bg-white rounded-3xl border transition-all ${item.completed ? 'border-green-100 bg-green-50/5 opacity-80' : 'border-navy/5 shadow-lux'} w-full overflow-hidden`}>
      {/* Thumbnail */}
      <div className="w-full md:w-24 h-48 md:h-24 rounded-2xl overflow-hidden shrink-0 relative">
        <img src={imgUrl} className="w-full h-full object-cover" alt="" />
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-safari mb-1">
          {item.isEvent ? 'Scheduled Event' : (place?.category || 'DESTINATION').replace('_', ' ')}
        </p>
        <h4 className="text-lg md:text-xl font-serif font-bold text-navy truncate">{place?.name || event?.title}</h4>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          <div className="relative group/reschedule">
            <input 
              type="date"
              value={item.plannedDate || ''}
              onChange={(e) => onUpdateDate(item.id, e.target.value)}
              onClick={(e) => (e.target as any).showPicker?.()}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy/40 uppercase group-hover/reschedule:text-safari transition-colors">
              <Calendar size={13} className="text-safari" />
              {item.plannedDate ? new Date(item.plannedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Unscheduled'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy/40 uppercase">
            <MapPin size={13} className="text-safari" />
            {place?.location || event?.location}
          </div>
        </div>
      </div>

      {/* Button Row & State Machine (Adaptive Grid) */}
      <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto min-w-[200px] justify-center">
        {flowState === 'default' && (
          <div className="flex items-center gap-2 w-full">
            {item.completed ? (
              <>
                {place && (
                  <button 
                    onClick={() => {
                      setFlowState('reviewing');
                    }}
                    className="flex-1 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-safari/10 text-safari border border-safari/20 hover:bg-safari hover:text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <MessageCircle size={14} /> Review
                  </button>
                )}
                <button 
                  onClick={() => onToggleCompleted(item.id)}
                  className="flex-1 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Attended
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleMarkAttended}
                  className="flex-1 h-10 px-4 bg-navy text-white hover:bg-safari rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  Mark Attended
                </button>
              </>
            )}
            <button onClick={() => onRemoveItem(item.id)} className="p-2.5 text-navy/20 hover:text-red-500 transition-colors shrink-0 cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {flowState === 'completed' && (
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => setFlowState('reviewing')}
              className="flex-1 h-10 bg-safari text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              Leave a Review
            </button>
            <button 
              onClick={handleClose}
              className="flex-1 h-10 border border-navy/15 text-navy/60 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/5 transition-colors whitespace-nowrap cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {flowState === 'reviewing' && (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-1 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-0.5 text-safari hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star size={16} fill={star <= rating ? 'currentColor' : 'none'} className={star <= rating ? 'text-safari font-bold' : 'text-navy/10'} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How was your visit?"
              rows={2}
              className="w-full px-3 py-1.5 rounded-xl border border-navy/10 text-xs text-navy bg-off-white focus:ring-1 focus:ring-safari outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handlePostReview}
                disabled={posting || !reviewText.trim()}
                className="flex-1 h-9 bg-safari text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
              <button 
                onClick={() => setFlowState('default')}
                className="h-9 px-3 border border-navy/15 text-[10px] font-black uppercase tracking-widest text-navy/60 rounded-xl hover:bg-navy/5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {flowState === 'posted' && (
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 p-2 rounded-xl text-[10px] font-medium border border-green-100">
              <CheckCircle2 size={12} />
              <span>Review Posted!</span>
            </div>
            <button 
              onClick={handleClose}
              className="w-full h-8 border border-navy/15 text-navy/60 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/5 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const MyKenya: React.FC<MyKenyaProps> = ({ 
  savedPlaces, 
  savedEvents, 
  savedItems,
  onUpdateDate,
  onToggleCompleted,
  onRemoveItem,
  onReviewItem,
  onAddReview,
  reviews
}) => {
  const { userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved' | 'trips' | 'reviews' | 'settings'>('saved');

  if (!userProfile) return null;

  const tabs = [
    { id: 'saved', label: 'Saved Places', icon: <Bookmark size={18} /> },
    { id: 'trips', label: 'My Itinerary', icon: <MapIcon size={18} /> },
    { id: 'reviews', label: 'My Reviews', icon: <Star size={18} /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings size={18} /> }
  ];

  const getPlaceById = (id: string) => savedPlaces.find(p => p.id === id);
  const getEventById = (id: string) => savedEvents.find(e => e.id === id);

  const activeItineraries = savedItems.filter(i => i.plannedDate && !i.completed);
  const completedItineraries = savedItems.filter(i => i.plannedDate && i.completed);

  return (
    <div className="min-h-screen bg-off-white pb-32">
       {/* Hero / Greeting */}
       <header className="bg-navy pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-safari via-transparent to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                   <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl relative z-10 bg-white/5 flex items-center justify-center">
                      {userProfile.photoURL ? (
                        <img src={userProfile.photoURL} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <span className="text-3xl font-serif font-bold text-white/20">{userProfile.name?.charAt(0)}</span>
                      )}
                   </div>
                   <button className="absolute -bottom-1 -right-1 z-20 w-8 h-8 bg-safari text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
                      <Camera size={14} />
                   </button>
                   <div className="absolute -inset-4 bg-safari/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-center md:text-left space-y-3">
                   <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-safari font-black uppercase tracking-[0.4em] text-[10px]"
                   >
                     {userProfile.persona?.replace('_', ' ')}
                   </motion.span>
                   <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">Your Kenya, <span className="italic text-safari font-light">{userProfile.name?.split(' ')[0]}</span></h1>
                   <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
                       <div className="px-3.5 h-8 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/60">
                          <ShieldCheck size={13} className="text-safari" /> Verified User
                       </div>
                       <div className="px-3.5 h-8 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/60">
                          <Compass size={13} className="text-safari" /> Saved Places & Itinerary
                       </div>
                   </div>
                </div>

                <div className="md:ml-auto flex gap-4">
                   <button 
                    onClick={logout}
                    className="h-14 px-8 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer"
                   >
                     <LogOut size={18} className="text-white/20 group-hover:text-red-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-red-500">End Session</span>
                   </button>
                </div>
             </div>
          </div>
       </header>

       {/* Navigation Tabs */}
       <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-navy/5 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
             <div className="flex gap-12">
                {tabs.map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`h-20 flex items-center gap-3 relative transition-colors cursor-pointer ${activeTab === tab.id ? 'text-navy' : 'text-navy/30 hover:text-navy/60'}`}
                   >
                     {React.cloneElement(tab.icon as React.ReactElement, { className: activeTab === tab.id ? 'text-safari' : '' })}
                     <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                     {activeTab === tab.id && (
                       <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-safari rounded-t-full" />
                     )}
                   </button>
                ))}
             </div>
          </div>
       </div>

        {/* Tab Content */}
        <main className="w-full max-w-7xl mx-auto px-0 sm:px-6 py-12 md:py-20 flex-1">
          <AnimatePresence mode="wait">
             {activeTab === 'saved' && (
               <motion.div 
                 key="saved" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                 className="space-y-16"
               >
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <h2 className="text-3xl font-serif font-bold text-navy">Curated Backlog</h2>
                       <span className="bg-navy/5 px-3 py-1 rounded-lg text-[10px] font-black text-navy/30 tracking-widest uppercase">{savedItems.length} items</span>
                    </div>
                    
                    {savedItems.length === 0 ? (
                       <div className="py-32 bg-white rounded-[60px] border border-dashed border-navy/10 flex flex-col items-center justify-center text-center space-y-8">
                          <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center text-navy/10"><Bookmark size={32} /></div>
                          <div className="space-y-4">
                             <h3 className="text-2xl font-serif font-bold text-navy">Empty Repository</h3>
                             <p className="text-navy/40 max-w-sm mx-auto text-lg leading-relaxed italic">Begin your aesthetic discovery by exploring the catalogue and bookmarking your interests.</p>
                          </div>
                       </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {savedItems.map(item => {
                            const place = getPlaceById(item.placeId);
                            const event = getEventById(item.placeId);
                            const data = place || event;
                            if (!data) return null;

                            const imgUrl = place?.imageUrl || event?.imageUrl || '/placeholder.jpg';

                             return (
                              <div key={item.id} className="bg-white rounded-[32px] p-2 border border-navy/5 shadow-lux overflow-hidden group">
                                 <div className="aspect-[4/3] rounded-[26px] overflow-hidden relative">
                                    <img src={imgUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent flex items-end p-6">
                                       <div className="w-full">
                                          <div className="relative w-full group/picker">
                                             <input 
                                                type="date"
                                                value={item.plannedDate || ''}
                                                onChange={(e) => onUpdateDate(item.id, e.target.value)}
                                                onClick={(e) => (e.target as any).showPicker?.()}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                title="Select Visit Date"
                                             />
                                             <button className="w-full h-12 bg-safari text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover/picker:bg-safari-light transition-all shadow-lg shadow-safari/40 relative z-0 cursor-pointer">
                                                <Calendar size={14} /> {item.plannedDate ? `Planned: ${new Date(item.plannedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'Schedule Visit'}
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="p-6 flex justify-between items-start">
                                    <div className="space-y-1">
                                      <h4 className="font-serif font-bold text-navy group-hover:text-safari transition-colors">{place?.name || event?.title}</h4>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-navy/30 leading-none">{place?.location || event?.location}</p>
                                    </div>
                                    <button onClick={() => onRemoveItem(item.id)} className="p-2 text-navy/10 hover:text-red-500 transition-colors cursor-pointer">
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </div>
                            );
                         })}
                      </div>
                    )}
                 </div>
               </motion.div>
             )}

             {activeTab === 'trips' && (
               <motion.div 
                 key="trips" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="space-y-12"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-2">
                        <h2 className="text-4xl font-serif font-bold text-navy">Planned Routes</h2>
                        <p className="text-navy/40 italic font-medium">Synchronize your timeline across the plateau.</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    {activeItineraries.length === 0 ? (
                      <div className="py-24 bg-white rounded-[40px] border border-dashed border-navy/10 text-center space-y-6">
                         <MapIcon size={40} className="mx-auto text-navy/10" />
                         <p className="text-navy/40 italic">No active items scheduled. Add saved places to your itinerary.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeItineraries.sort((a,b) => new Date(a.plannedDate!).getTime() - new Date(b.plannedDate!).getTime()).map(item => {
                          const place = getPlaceById(item.placeId);
                          const event = getEventById(item.placeId);
                          return (
                            <ItineraryItemRow
                              key={item.id}
                              item={item}
                              place={place}
                              event={event}
                              onUpdateDate={onUpdateDate}
                              onToggleCompleted={onToggleCompleted}
                              onRemoveItem={onRemoveItem}
                              onReviewItem={onReviewItem}
                              onAddReview={onAddReview}
                            />
                          );
                        })}
                      </div>
                    )}

                    {completedItineraries.length > 0 && (
                      <div className="mt-16 pt-16 border-t border-navy/10 space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-serif font-bold text-navy">Past Experiences</h3>
                          <p className="text-navy/40 text-sm italic">Memories from your beautiful journeys across Kenya.</p>
                        </div>
                        <div className="space-y-4">
                          {completedItineraries.map(item => {
                            const place = getPlaceById(item.placeId);
                            const event = getEventById(item.placeId);
                            return (
                              <ItineraryItemRow
                                key={item.id}
                                item={item}
                                place={place}
                                event={event}
                                onUpdateDate={onUpdateDate}
                                onToggleCompleted={onToggleCompleted}
                                onRemoveItem={onRemoveItem}
                                onReviewItem={onReviewItem}
                                onAddReview={onAddReview}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
               </motion.div>
             )}

             {activeTab === 'reviews' && (
                <motion.div 
                  key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-navy">Registry Contributions</h2>
                    <p className="text-navy/40 italic font-medium">Your shared experiences within the database.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {reviews.length === 0 ? (
                       <div className="md:col-span-2 py-24 bg-white rounded-[40px] border border-dashed border-navy/10 text-center space-y-6">
                          <MessageCircle size={40} className="mx-auto text-navy/10" />
                          <p className="text-navy/40 italic">You haven't shared any experiences yet.</p>
                       </div>
                     ) : (
                       reviews.map(review => {
                         const place = savedPlaces.find(p => p.id === review.placeId);
                         return (
                           <div key={review.id} className="p-8 bg-white rounded-[2.5rem] border border-navy/5 shadow-lux space-y-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy/5">
                                    {place && <img src={place.imageUrl} className="w-full h-full object-cover" alt="" />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-serif font-bold text-navy truncate">{place?.name || 'Unknown Location'}</h4>
                                    <div className="flex text-safari mt-1">
                                       {[1,2,3,4,5].map(i => (
                                         <Star key={i} size={12} fill={i <= review.rating ? "currentColor" : "none"} className={i <= review.rating ? "" : "text-navy/10"} />
                                       ))}
                                    </div>
                                 </div>
                              </div>
                              <p className="text-navy/60 italic leading-relaxed text-sm">"{review.comment}"</p>
                              <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-navy/30">
                                    Published {new Date(review.createdAt).toLocaleDateString()}
                                 </span>
                              </div>
                           </div>
                         );
                       })
                     )}
                  </div>
                </motion.div>
             )}

             {activeTab === 'settings' && (
                <motion.div 
                  key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto bg-white rounded-[40px] p-12 shadow-lux border border-navy/5 space-y-12"
                >
                  <div className="space-y-8">
                     <h3 className="text-2xl font-serif font-bold text-navy">Profile Nuance</h3>
                     
                     <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 ml-4">Full Identifier</label>
                           <input 
                             type="text" 
                             defaultValue={userProfile.name}
                             className="w-full h-16 bg-navy/5 rounded-2xl px-6 font-medium text-navy outline-none border border-transparent focus:border-safari/20 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 ml-4">Communication Endpoint</label>
                           <input 
                             type="email" 
                             disabled
                             defaultValue={userProfile.email}
                             className="w-full h-16 bg-navy/5 rounded-2xl px-6 font-medium text-navy/30 outline-none cursor-not-allowed"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h3 className="text-2xl font-serif font-bold text-navy">Signal Preferences</h3>
                     <div className="space-y-4">
                        {[
                          { id: 'notifications', title: 'System Alerts', desc: 'Real-time updates on saved itinerary changes and booking status.' },
                          { id: 'newsletter', title: 'The Kenya Dispatch', desc: 'A monthly editorial on hidden places and travel routes.' }
                        ].map((pref) => (
                          <div key={pref.id} className="flex items-center justify-between p-6 bg-[#FAFAF8] rounded-3xl border border-navy/5">
                             <div className="space-y-1">
                                <p className="text-xs font-bold text-navy">{pref.title}</p>
                                <p className="text-[10px] text-navy/40 font-medium italic">{pref.desc}</p>
                             </div>
                             <div className="w-12 h-6 bg-navy rounded-full relative cursor-pointer flex items-center px-1">
                                <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <button className="w-full h-16 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-safari transition-all shadow-xl active:scale-95 cursor-pointer">Synchronize Changes</button>
                </motion.div>
             )}
          </AnimatePresence>
       </main>
    </div>
  );
};
