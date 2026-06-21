import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Compass, 
  Utensils, 
  Hotel, 
  Ticket, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Globe,
  BarChart3,
  Calendar,
  Upload,
  Plus,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Registration } from '../types';

const STEPS = [
  { id: 1, title: 'Identity', icon: <Building2 className="w-5 h-5" /> },
  { id: 2, title: 'Curation', icon: <Compass className="w-5 h-5" /> },
  { id: 3, title: 'Finalize', icon: <ShieldCheck className="w-5 h-5" /> }
];

const REG_TYPES = [
  { id: 'OPERATOR', label: 'Tour Company', icon: <Building2 />, desc: 'Registered travel & safari operators' },
  { id: 'GUIDE', label: 'Private Guide', icon: <Compass />, desc: 'Licensed individual safari or city guides' },
  { id: 'RESTAURANT', label: 'Eatery / Café', icon: <Utensils />, desc: 'Local highlights & coastal masters' },
  { id: 'HOTEL', label: 'Stay / Lodge', icon: <Hotel />, desc: 'Boutique stays & wilderness lodges' },
  { id: 'EXPERIENCE', label: 'Experiences', icon: <Ticket />, desc: 'Workshops, events, & cultural hosts' },
  { id: 'CREATOR', label: 'Creator', icon: <Camera />, desc: 'Travel photographers & storytellers' }
];

export const PartnerRegistration: React.FC = () => {
  const [step, setStep] = useState(0); // 0 is Landing, 1-3 are Form steps, 4 is Success
  const [type, setType] = useState<Registration['type'] | ''>('');
  const [formData, setFormData] = useState<Partial<Registration>>({
    businessName: '',
    email: '',
    phone: '',
    description: '',
    details: {
      services: [],
      languages: [],
      specialties: [],
      latitude: undefined,
      longitude: undefined
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isEventRegistration, setIsEventRegistration] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    description: '',
    price: 1500,
    location: '',
    category: 'FESTIVALS',
    totalCapacity: 50,
    providerName: '',
    organizerBio: '',
    bookingLink: '',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    latitude: '',
    longitude: ''
  });
  const [eventCoords, setEventCoords] = useState('');
  const [partnerCoords, setPartnerCoords] = useState('');

  // Smooth scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleTypeSelect = (selectedType: Registration['type']) => {
    setIsEventRegistration(false);
    setType(selectedType);
    setStep(1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetailChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isEventRegistration) {
        const eventId = 'custom-' + Math.random().toString(36).substr(2, 9);
        const eventData = {
          id: eventId,
          title: eventFormData.title,
          providerId: 'custom-partner',
          providerName: eventFormData.providerName,
          date: eventFormData.date ? new Date(eventFormData.date).toISOString() : new Date().toISOString(),
          description: eventFormData.description,
          price: Number(eventFormData.price) || 0,
          location: eventFormData.location,
          imageUrl: eventFormData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
          registrations: 0,
          category: eventFormData.category,
          totalCapacity: Number(eventFormData.totalCapacity) || 100,
          bookedCapacity: 0,
          organizer: {
            logo: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ef4',
            bio: eventFormData.organizerBio || 'Verified Host of Curated events',
            rating: 5.0
          },
          gallery: [],
          latitude: parseFloat(eventFormData.latitude) || null,
          longitude: parseFloat(eventFormData.longitude) || null,
          bookingLink: eventFormData.bookingLink || 'https://wa.me/254700000000'
        };

        try {
          await addDoc(collection(db, 'events'), eventData);
        } catch (e) {
          console.warn('Direct firestore events write failed. Saving registrations log and local storage backup.', e);
        }

        await addDoc(collection(db, 'registrations'), {
          type: 'EXPERIENCE',
          status: 'PENDING',
          submittedAt: serverTimestamp(),
          businessName: eventFormData.providerName,
          email: 'event-partner@placesinkenya.com',
          phone: '+254700000000',
          description: `curated Event listed: ${eventFormData.title}. Desc: ${eventFormData.description}`,
          details: {
            latitude: parseFloat(eventFormData.latitude) || undefined,
            longitude: parseFloat(eventFormData.longitude) || undefined,
            bookingLink: eventFormData.bookingLink
          },
          documents: { photos: [] }
        });

        const existingLocal = localStorage.getItem('places_custom_events');
        const localArr = existingLocal ? JSON.parse(existingLocal) : [];
        localArr.unshift(eventData);
        localStorage.setItem('places_custom_events', JSON.stringify(localArr));
      } else {
        const registrationData = {
          ...formData,
          type,
          status: 'PENDING',
          submittedAt: serverTimestamp(),
          documents: {
            photos: [],
            logoUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=200',
            certificateUrl: '',
          }
        };

        await addDoc(collection(db, 'registrations'), registrationData);

        const customPlaceId = 'custom-place-' + Math.random().toString(36).substr(2, 9);
        const customPlace = {
          id: customPlaceId,
          title: formData.businessName,
          category: type === 'HOTEL' ? 'STAYS' : type === 'RESTAURANT' ? 'FOOD_DRINK' : 'ARTS_CULTURE',
          location: 'Kenya',
          description: formData.description || 'Verified Partner Venue',
          imageUrl: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d',
          rating: 4.9,
          reviewsCount: 1,
          isTrending: false,
          latitude: formData.details?.latitude || null,
          longitude: formData.details?.longitude || null,
          bookingLink: formData.details?.bookingLink || ''
        };

        const existingLocalPlaces = localStorage.getItem('places_custom_partners');
        const localPlacesArr = existingLocalPlaces ? JSON.parse(existingLocalPlaces) : [];
        localPlacesArr.unshift(customPlace);
        localStorage.setItem('places_custom_partners', JSON.stringify(localPlacesArr));
      }
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-off-white">
        {/* Hero */}
        <section className="relative h-[80vh] flex items-center overflow-hidden bg-navy">
           <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1547448415-e9f5b28e570d" 
                className="w-full h-full object-cover opacity-20 grayscale"
                alt="Partnership"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent"></div>
           </div>
           
           <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-10">
                 <motion.span 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="text-safari font-black uppercase tracking-[0.4em] text-[10px]"
                 >
                    Become a Registered Partner
                 </motion.span>
                 <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-serif font-bold text-white leading-[0.95] tracking-tighter"
                 >
                   Grow Your <br /><span className="italic font-light text-safari text-7xl md:text-9xl">Vocation.</span>
                 </motion.h1>
                 <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-white/40 text-xl font-light italic max-w-lg leading-relaxed"
                 >
                    Join 500+ verified businesses reaching thousands of travellers monthly through our curated aesthetic database.
                 </motion.p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                       onClick={() => {
                           setIsEventRegistration(false);
                           const el = document.getElementById('reg-selector');
                           el?.scrollIntoView({ behavior: 'smooth' });
                       }}
                       className="h-11 md:h-12 w-fit self-center sm:w-auto px-6 md:px-8 bg-white text-navy rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl hover:bg-safari hover:text-white transition-all flex items-center justify-center gap-3 group cursor-pointer"
                    >
                       Apply for Verification <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <button 
                       onClick={() => {
                           setIsEventRegistration(true);
                           setStep(1);
                       }}
                       className="h-11 md:h-12 w-fit self-center sm:w-auto px-6 md:px-8 bg-safari text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl hover:bg-white hover:text-navy transition-all flex items-center justify-center gap-3 group cursor-pointer"
                    >
                       Publish Specialized Event <Calendar size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </section>

        {/* Benefits */}
        <section className="py-32 max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { title: 'Global Reach', icon: <Globe />, text: 'Be discovered by international and local travellers seeking authenticity.' },
                { title: 'Verified Badge', icon: <ShieldCheck />, text: 'Build instant trust with our rigorous collective verification program.' },
                { title: 'Data Engine', icon: <BarChart3 />, text: 'Track views, bookings, and growth through our internal dashboard.' },
                { title: 'Event Access', icon: <Calendar />, text: 'Feature your exclusive events to our high-intent traveler audience.' }
              ].map((b, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={b.title} 
                  className="space-y-6"
                >
                    <div className="w-14 h-14 bg-navy text-safari flex items-center justify-center rounded-2xl shadow-xl">{b.icon}</div>
                    <h3 className="text-xl font-serif font-bold text-navy">{b.title}</h3>
                    <p className="text-navy/40 font-medium text-sm leading-relaxed">{b.text}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Registration Type Selector */}
        <section id="reg-selector" className="py-32 bg-navy rounded-t-[80px]">
           <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">Choose Your Path</h2>
                 <p className="text-white/40 italic">Select the category that best represents your professional offering.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {REG_TYPES.map((t, i) => (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      key={t.id}
                      onClick={() => handleTypeSelect(t.id as any)}
                      className="group bg-white/5 border border-white/10 p-10 rounded-[40px] text-left hover:bg-white transition-all space-y-6 active:scale-95 cursor-pointer"
                    >
                       <div className="w-16 h-16 bg-safari/20 text-safari flex items-center justify-center rounded-[20px] group-hover:bg-navy group-hover:text-white transition-colors">{t.icon}</div>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-serif font-bold text-white group-hover:text-navy transition-colors">{t.label}</h4>
                          <p className="text-white/40 group-hover:text-navy/60 transition-colors text-sm font-medium">{t.desc}</p>
                       </div>
                    </motion.button>
                 ))}
              </div>

               {/* Register Event Call-out */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="mt-16 bg-gradient-to-r from-safari/20 to-navy border border-safari/20 rounded-[40px] p-8 sm:p-12 text-left flex flex-col md:flex-row justify-between items-center gap-8 max-w-5xl mx-auto"
               >
                 <div className="space-y-3">
                   <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Are you hosting a Temporal Expedition?</h3>
                   <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                     Publish curated workshops, food gatherings, safaris, and artistic cultural events directly to the PlacesInKenya temporal feed.
                   </p>
                 </div>
                 <button 
                   onClick={() => {
                     setIsEventRegistration(true);
                     setStep(1);
                   }}
                   className="h-11 px-6 bg-safari hover:bg-safari/90 text-white font-black uppercase tracking-wider text-[9px] rounded-full flex items-center gap-2.5 shadow-lg hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer w-fit self-center sm:self-auto"
                 >
                   List Event Instead <Calendar size={14} />
                 </button>
               </motion.div>
           </div>
        </section>
      </motion.div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(10,17,40,0.95), rgba(10,17,40,0.95)), url("https://images.unsplash.com/photo-1547448415-e9f5b28e570d")' }}>
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }} 
           animate={{ scale: 1, opacity: 1 }}
           className="max-w-xl w-full text-center space-y-12 bg-white rounded-[60px] p-10 sm:p-20 shadow-lux"
         >
            <div className="w-24 h-24 bg-green-500 text-white flex items-center justify-center rounded-[32px] mx-auto shadow-2xl shadow-green-500/20">
               <CheckCircle2 size={48} />
            </div>
            <div className="space-y-6">
               <h2 className="text-4xl font-serif font-bold text-navy">
                 {isEventRegistration ? 'Event Published! 🎆' : 'Application Received! 🎉'}
               </h2>
               <p className="text-navy/40 text-lg italic leading-relaxed">
                  {isEventRegistration ? (
                    <> Your specialized event, <span className="text-navy font-bold leading-none">{eventFormData.title}</span>, has been successfully registered and placed on our Kenyan map. Traveler RSVP counters are active! </>
                  ) : (
                    <> Our curation team will review your application within <span className="text-navy font-bold">3-5 business days</span>. You'll receive an email at <span className="text-safari font-black">{formData.email}</span> with further instructions. </>
                  )}
               </p>
            </div>
            <div className="pt-8 grid grid-cols-2 gap-4">
               <button 
                onClick={() => window.location.href = '/'}
                className="h-11 px-4 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-navy/90 transition-all cursor-pointer"
               >
                 Back to Home
               </button>
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(isEventRegistration ? `I just published high-adventure event "${eventFormData.title}" on PlacesInKenya! 🇰🇪` : 'I just applied to register on PlacesInKenya! 🇰🇪');
                  alert('Status copied to clipboard!');
                }}
                className="h-11 px-4 bg-safari text-white rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-safari/90 transition-all cursor-pointer"
               >
                 Tell your network
               </button>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
       <header className="py-12 px-6 flex justify-between items-center bg-white border-b border-navy/5">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-navy flex items-center justify-center rounded-xl text-white">
                {isEventRegistration ? <Calendar className="w-5 h-5" /> : REG_TYPES.find(t => t.id === type)?.icon}
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">
                  {isEventRegistration ? 'Event Registry Engine' : 'Partner Application'}
                </p>
                <h3 className="font-serif font-bold text-xl text-navy">
                  {isEventRegistration ? 'Publish Curated Event' : REG_TYPES.find(t => t.id === type)?.label}
                </h3>
             </div>
          </div>
          
          <div className="flex gap-3">
             {STEPS.map(s => (
                <div 
                   key={s.id} 
                   className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step === s.id ? 'bg-navy text-white shadow-xl scale-110' : step > s.id ? 'bg-safari text-white' : 'bg-navy/5 text-navy/20'}`}
                >
                   {step > s.id ? <CheckCircle2 size={16} /> : s.icon}
                </div>
             ))}
          </div>
       </header>

       <main className="flex-1 flex items-center justify-center p-6 py-12 md:py-20 lg:py-32">
          <div className="max-w-4xl w-full">
             <AnimatePresence mode="wait">
                {/* ══ FLOW A: COMPASS SPECIALIZED EVENT REGISTRATION ══ */}
                {isEventRegistration && step === 1 && (
                  <motion.div key="eventStep1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                     <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy">Event Core Profile</h2>
                        <p className="text-navy/40 text-lg italic font-light">Describe the core adventure of your upcoming curated experience.</p>
                     </div>
                     <div className="grid grid-cols-1 gap-8 text-left">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Event Title</label>
                           <input required type="text" value={eventFormData.title} onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Maasai Mara Photographic Workshop" className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Planned Date</label>
                              <input required type="date" value={eventFormData.date} onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Category</label>
                              <select value={eventFormData.category} onChange={(e) => setEventFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target">
                                 <option value="FESTIVALS">Festivals & Celebrations</option>
                                 <option value="FOOD_DRINK">Food & Drink Pairings</option>
                                 <option value="ADVENTURES">Extreme Outdoor Adventures</option>
                                 <option value="CULTURE">Artistic Culture Workshops</option>
                                 <option value="WILDLIFE">Exclusive Wildlife Safaris</option>
                              </select>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Venue General Location (City or Park)</label>
                           <input required type="text" value={eventFormData.location} onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g. Hell's Gate National Park, Naivasha" className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                        </div>
                        
                        {/* Coordinates Input Section */}
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Coordinates (Latitude, Longitude)</label>
                           <input 
                              type="text" 
                              value={eventCoords} 
                              onChange={(e) => {
                                 const val = e.target.value;
                                 setEventCoords(val);
                                 const parts = val.split(',').map(s => s.trim());
                                 setEventFormData(prev => ({ 
                                    ...prev, 
                                    latitude: parts[0] || '', 
                                    longitude: parts[1] || '' 
                                 }));
                              }} 
                              placeholder="e.g. -0.9167, 36.3167" 
                              className="w-full h-14 bg-white border border-navy/5 rounded-full px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" 
                           />
                           <p className="text-[9px] text-navy/25 ml-4 italic">Separate latitude and longitude with a comma (e.g. copied from Google Maps).</p>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 font-bold">Broad Description</label>
                           <textarea value={eventFormData.description} onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the journey, itinerary, activities, and specific preparation requested." className="w-full h-40 bg-white border border-navy/5 rounded-[40px] p-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all resize-none" />
                        </div>
                     </div>
                     <div className="pt-10 flex justify-between items-center gap-4">
                        <button onClick={() => setStep(0)} className="h-11 px-6 border border-navy/10 rounded-full font-black uppercase tracking-widest text-[9px] text-navy/40 hover:text-navy transition-colors cursor-pointer whitespace-nowrap">Abort</button>
                        <button disabled={!eventFormData.title || !eventFormData.location} onClick={() => setStep(2)} className="h-11 px-6 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2.5 hover:bg-safari transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap">Continue Details <ArrowRight size={14} /></button>
                     </div>
                  </motion.div>
                )}

                {isEventRegistration && step === 2 && (
                  <motion.div key="eventStep2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                     <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy">Host Specs & Fees</h2>
                        <p className="text-navy/40 text-lg italic font-light">Set capacity, fees, and communication endpoints for high-intent explorers.</p>
                     </div>
                     <div className="grid grid-cols-1 gap-8 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Entry Fee (Ksh)</label>
                              <input required type="number" value={eventFormData.price} onChange={(e) => setEventFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))} placeholder="e.g. 3500" className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Max Capacity (Available spots)</label>
                              <input required type="number" value={eventFormData.totalCapacity} onChange={(e) => setEventFormData(prev => ({ ...prev, totalCapacity: parseInt(e.target.value) || 0 }))} placeholder="e.g. 50" className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Host / Partner Brand Name</label>
                           <input required type="text" value={eventFormData.providerName} onChange={(e) => setEventFormData(prev => ({ ...prev, providerName: e.target.value }))} placeholder="e.g. Outdoor Explorers Collective" className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Direct Booking Endpoint Link (WhatsApp, Tickets, etc.)</label>
                           <input required type="text" value={eventFormData.bookingLink} onChange={(e) => setEventFormData(prev => ({ ...prev, bookingLink: e.target.value }))} placeholder="e.g. https://wa.me/254712345678" className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Event Poster Image URL (Optional)</label>
                           <input type="text" value={eventFormData.imageUrl} onChange={(e) => setEventFormData(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://unsplash.com/..." className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 font-bold">Host Bio-Editorial</label>
                           <textarea value={eventFormData.organizerBio} onChange={(e) => setEventFormData(prev => ({ ...prev, organizerBio: e.target.value }))} placeholder="Tell us briefly about the host brand, history, and curation level." className="w-full h-40 bg-white border border-navy/5 rounded-[40px] p-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all resize-none" />
                        </div>
                     </div>
                     <div className="pt-10 flex justify-between items-center gap-4">
                        <button onClick={() => setStep(1)} className="h-11 px-6 border border-navy/10 rounded-full font-black uppercase tracking-widest text-[9px] text-navy/40 hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"><ArrowLeft size={14} /> Scope</button>
                        <button disabled={!eventFormData.providerName || !eventFormData.bookingLink} onClick={() => setStep(3)} className="h-11 px-6 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2.5 hover:bg-safari transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap">Review Event <ArrowRight size={14} /></button>
                     </div>
                  </motion.div>
                )}

                {isEventRegistration && step === 3 && (
                  <motion.div key="eventStep3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                     <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy">Temporal Review</h2>
                        <p className="text-navy/40 text-lg italic font-light">Approve the accuracy of your specialized event submission.</p>
                     </div>
                     <div className="bg-white rounded-[40px] border border-navy/5 p-8 sm:p-12 space-y-10 shadow-lux text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Event Title</p>
                              <p className="text-2xl font-serif font-bold text-navy leading-tight">{eventFormData.title}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Host Partner</p>
                              <p className="text-2xl font-serif font-bold text-safari leading-tight">{eventFormData.providerName}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Category</p>
                              <p className="font-bold text-navy text-sm uppercase tracking-wider">{eventFormData.category}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Ticket Cost</p>
                              <p className="text-xl font-bold text-navy font-serif">Ksh {Number(eventFormData.price).toLocaleString()}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">General Location</p>
                              <p className="text-sm font-bold text-navy/60">{eventFormData.location}</p>
                           </div>
                           {(eventFormData.latitude || eventFormData.longitude) && (
                             <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Coordinates</p>
                                <p className="text-sm font-bold text-navy/60">Lat: {eventFormData.latitude || 'N/A'}, Lon: {eventFormData.longitude || 'N/A'}</p>
                             </div>
                           )}
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Total Capacity</p>
                              <p className="text-sm font-bold text-navy/60">{eventFormData.totalCapacity} spots</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Booking Endpoint</p>
                              <p className="text-xs font-bold text-safari truncate max-w-xs">{eventFormData.bookingLink}</p>
                           </div>
                        </div>
                     </div>
                     <div className="pt-10 border-t border-navy/5 text-left">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-navy/5 text-safari flex items-center justify-center rounded-xl shrink-0"><AlertCircle size={20} /></div>
                           <p className="text-sm text-navy/40 font-medium italic leading-relaxed">I verify that all event details & specifications correspond to our actual planning. I agree that listed rates conform to our verified partner policy.</p>
                        </div>
                     </div>
                     {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-4 rounded-xl text-center italic">{error}</p>}
                     <div className="pt-10 flex justify-between items-center gap-4">
                        <button onClick={() => setStep(2)} className="h-11 px-6 border border-navy/10 rounded-full font-black uppercase tracking-widest text-[9px] text-navy/40 hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"><ArrowLeft size={14} /> Details</button>
                        <button disabled={loading} onClick={handleSubmit} className="h-11 px-6 bg-safari text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2.5 hover:bg-safari-light transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap">{loading ? 'Processing...' : 'Publish Curated Event'} <CheckCircle2 size={14} /></button>
                     </div>
                  </motion.div>
                )}


                {/* ══ FLOW B: STANDARD BUSINESS PARTNER APPLICATION ══ */}
                {!isEventRegistration && step === 1 && (
                  <motion.div 
                    key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-4 text-left">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy">Identity Profile</h2>
                        <p className="text-navy/40 text-lg italic font-light">Tell us the core narrative of your enterprise.</p>
                     </div>

                     <div className="grid grid-cols-1 gap-8 text-left">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Legal Enterprise Name</label>
                           <input 
                             required
                             type="text" 
                             value={formData.businessName}
                             onChange={(e) => handleInputChange('businessName', e.target.value)}
                             placeholder="e.g. Serengeti Dreams Ltd"
                             className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Communication Email</label>
                           <input 
                             required
                             type="email" 
                             value={formData.email}
                             onChange={(e) => handleInputChange('email', e.target.value)}
                             placeholder="partners@yourbrand.com"
                             className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Primary Contact Number</label>
                           <input 
                             required
                             type="tel" 
                             value={formData.phone}
                             onChange={(e) => handleInputChange('phone', e.target.value)}
                             placeholder="+254 --- --- ---"
                             className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Digital Realm (Optional)</label>
                           <input 
                             type="url" 
                             value={formData.details?.websiteUrl}
                             onChange={(e) => handleDetailChange('websiteUrl', e.target.value)}
                             placeholder="https://yourbrand.com"
                             className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target"
                           />
                        </div>

                        {/* Coordinates Input Section - PARTNER REGISTRATION */}
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Coordinates (Latitude, Longitude)</label>
                           <input 
                              type="text" 
                              value={partnerCoords}
                              onChange={(e) => {
                                 const val = e.target.value;
                                 setPartnerCoords(val);
                                 const parts = val.split(',').map(s => s.trim());
                                 const lat = parseFloat(parts[0]) || undefined;
                                 const lon = parseFloat(parts[1]) || undefined;
                                 setFormData(prev => ({
                                    ...prev,
                                    details: {
                                       ...prev.details,
                                       latitude: lat,
                                       longitude: lon
                                    }
                                 }));
                              }}
                              placeholder="e.g. -1.2921, 36.8219"
                              className="w-full h-14 bg-white border border-navy/5 rounded-full px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target"
                           />
                           <p className="text-[9px] text-navy/25 ml-4 italic">Separate latitude and longitude with a comma (e.g. copied from Google Maps).</p>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Booking / Reservation Link (Required for Uniformity)</label>
                           <input 
                              required
                              type="text" 
                              value={formData.details?.bookingLink}
                              onChange={(e) => handleDetailChange('bookingLink', e.target.value)}
                              placeholder="WhatsApp link, Booking.com, Email, etc."
                              className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all tap-target"
                           />
                           <p className="text-[9px] text-navy/20 ml-4 italic text-left">Providing a direct booking link ensures travelers can reserve your service instantly.</p>
                        </div>
                     </div>

                     <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center px-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy/40">Bio-Editorial</label>
                           <span className="text-[10px] font-bold text-navy/20">{formData.description?.length || 0} / 250</span>
                        </div>
                        <textarea 
                          maxLength={250}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="What is the story behind your service? How do you curate the Kenyan experience?"
                          className="w-full h-40 bg-white border border-navy/5 rounded-[40px] p-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all resize-none"
                        />
                     </div>

                     <div className="pt-10 flex justify-between items-center gap-4">
                        <button onClick={prevStep} className="h-11 px-6 border border-navy/10 rounded-full font-black uppercase tracking-widest text-[9px] text-navy/40 hover:text-navy transition-colors cursor-pointer whitespace-nowrap">Abort</button>
                        <button disabled={!formData.businessName || !formData.email || !formData.details?.bookingLink} onClick={nextStep} className="h-11 px-6 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2.5 hover:bg-safari transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap">Continue Narrative <ArrowRight size={14} /></button>
                     </div>
                  </motion.div>
                )}

                {!isEventRegistration && step === 2 && (
                  <motion.div 
                    key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-4 text-left">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy">Credentials & Assets</h2>
                        <p className="text-navy/40 text-lg italic font-light">Verify your professional status within the plateau.</p>
                     </div>

                     {type === 'GUIDE' ? (
                        <div className="space-y-8 text-left">
                           <div className="grid grid-cols-1 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Guide License Number</label>
                                 <input 
                                   type="text" 
                                   placeholder="e.g. TRA-G-2024-XXXX"
                                   defaultValue={formData.details?.licenseNumber}
                                   onChange={(e) => handleDetailChange('licenseNumber', e.target.value)}
                                   className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Years of Mastery</label>
                                 <input 
                                   type="number" 
                                   placeholder="Years in the field"
                                   defaultValue={formData.details?.yearsOfExperience}
                                   onChange={(e) => handleDetailChange('yearsOfExperience', parseInt(e.target.value))}
                                   className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all"
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Specialties</label>
                              <div className="flex flex-wrap gap-3">
                                 {['Safari', 'Cultural', 'Mountain', 'Coastal', 'Urban', 'Photography'].map(spec => (
                                   <button
                                     key={spec}
                                     onClick={() => {
                                       const current = formData.details?.specialties || [];
                                       const next = current.includes(spec) ? current.filter(s => s !== spec) : [...current, spec];
                                       handleDetailChange('specialties', next);
                                     }}
                                     className={`px-6 h-10 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${formData.details?.specialties?.includes(spec) ? 'bg-navy border-navy text-white shadow-lg' : 'bg-white border-navy/5 text-navy/30 hover:border-navy/10'}`}
                                   >
                                     {spec}
                                   </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-8 text-left">
                           <div className="grid grid-cols-1 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Reg. Number / KRA</label>
                                 <input 
                                   type="text" 
                                   placeholder="e.g. PVT-2023-XXXX"
                                   defaultValue={formData.details?.regNumber}
                                   onChange={(e) => handleDetailChange('regNumber', e.target.value)}
                                   className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Price Spectrum</label>
                                 <select 
                                   defaultValue={formData.details?.priceRange}
                                   onChange={(e) => handleDetailChange('priceRange', e.target.value)}
                                   className="w-full h-18 bg-white border border-navy/5 rounded-3xl px-8 font-medium text-navy focus:ring-4 focus:ring-safari/10 outline-none transition-all"
                                 >
                                    <option value="">Select Range</option>
                                    <option value="ECONOMY">Economy (Affordable)</option>
                                    <option value="BOUTIQUE">Boutique (Mid-range)</option>
                                    <option value="LUXURY">Luxury (Premium)</option>
                                    <option value="ULTRA">Ultra-Lux (Elite)</option>
                                 </select>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Core Services</label>
                              <div className="flex flex-wrap gap-3">
                                 {['Transportation', 'Accommodation', 'Guiding', 'Equipment', 'Dining', 'Planning'].map(serv => (
                                   <button
                                     key={serv}
                                     onClick={() => {
                                       const current = formData.details?.services || [];
                                       const next = current.includes(serv) ? current.filter(s => s !== serv) : [...current, serv];
                                       handleDetailChange('services', next);
                                     }}
                                     className={`px-6 h-10 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${formData.details?.services?.includes(serv) ? 'bg-navy border-navy text-white shadow-lg' : 'bg-white border-navy/5 text-navy/30 hover:border-navy/10'}`}
                                   >
                                     {serv}
                                   </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="space-y-6 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Asset Uploads (Certification & Gallery)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="h-48 rounded-[40px] border-2 border-dashed border-navy/5 bg-white flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-safari/40 transition-all group">
                              <div className="w-12 h-12 bg-navy/5 text-navy/20 rounded-full flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-colors"><Upload size={20} /></div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-navy/30">Logo / Profile Photo</p>
                           </div>
                           <div className="h-48 rounded-[40px] border-2 border-dashed border-navy/5 bg-white flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-safari/40 transition-all group">
                              <div className="w-12 h-12 bg-navy/5 text-navy/20 rounded-full flex items-center justify-center group-hover:bg-safari group-hover:text-white transition-colors"><ShieldCheck size={20} /></div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-navy/30">License / Certificate PDF</p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 flex justify-between items-center gap-4">
                        <button onClick={prevStep} className="h-11 px-6 border border-navy/10 rounded-full font-black uppercase tracking-widest text-[9px] text-navy/40 hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"><ArrowLeft size={14} /> Identity</button>
                        <button onClick={nextStep} className="h-11 px-6 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2.5 hover:bg-safari transition-all cursor-pointer whitespace-nowrap">Review Application <ArrowRight size={14} /></button>
                     </div>
                  </motion.div>
                )}

                {!isEventRegistration && step === 3 && (
                  <motion.div 
                    key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-4 text-left">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy">Final Curation</h2>
                        <p className="text-navy/40 text-lg italic font-light">Confirm the integrity of your submission.</p>
                     </div>
                     <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-navy/5 p-6 sm:p-12 space-y-10 shadow-lux text-left">
                        <div className="grid grid-cols-1 gap-10">
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Enterprise</p>
                              <p className="text-xl sm:text-2xl font-serif font-bold text-navy">{formData.businessName}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Registry Class</p>
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-safari/10 text-safari rounded-lg flex items-center justify-center">
                                    {REG_TYPES.find(t => t.id === type)?.icon && React.cloneElement(REG_TYPES.find(t => t.id === type)?.icon as React.ReactElement, { size: 14 })}
                                 </div>
                                 <p className="font-bold text-navy text-sm uppercase tracking-wider">{type}</p>
                               </div>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Direct Endpoint</p>
                              <p className="text-sm sm:text-base font-bold text-navy/60">{formData.email}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Mobile Secure</p>
                              <p className="text-sm sm:text-base font-bold text-navy/60">{formData.phone}</p>
                           </div>
                           {formData.details?.bookingLink && (
                             <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-navy/20">Booking Endpoint</p>
                                <p className="text-sm sm:text-base font-bold text-safari truncate">{formData.details.bookingLink}</p>
                             </div>
                           )}
                           {formData.details?.latitude && (
                             <div className="space-y-2 col-span-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-navy/20 font-bold">Coordinates</p>
                                <p className="text-sm text-navy/60">Lat: {formData.details.latitude}, Lon: {formData.details.longitude}</p>
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="pt-10 border-t border-navy/5 text-left">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-navy/5 text-safari flex items-center justify-center rounded-xl shrink-0"><AlertCircle size={20} /></div>
                           <p className="text-sm text-navy/40 font-medium italic leading-relaxed">
                              I verify that all information provided is accurate and representational of our actual operations. 
                              I agree to the <span className="text-safari font-bold underline cursor-pointer">Partner Code of Conduct</span>.
                           </p>
                        </div>
                     </div>

                     {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-4 rounded-xl text-center italic">{error}</p>}

                     <div className="pt-10 flex justify-between items-center gap-4">
                        <button onClick={prevStep} className="h-11 px-6 border border-navy/10 rounded-full font-black uppercase tracking-widest text-[9px] text-navy/40 hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"><ArrowLeft size={14} /> Details</button>
                        <button 
                          disabled={loading}
                          onClick={handleSubmit} 
                          className="h-11 px-6 bg-safari text-white rounded-full font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2.5 hover:bg-safari-light transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                        >
                           {loading ? 'Processing...' : 'Submit Application'} <CheckCircle2 size={14} />
                        </button>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
       </main>

       <footer className="py-12 border-t border-navy/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-navy/10">Synchronized via Secure Cloud Registry</p>
       </footer>
    </div>
  );
};
