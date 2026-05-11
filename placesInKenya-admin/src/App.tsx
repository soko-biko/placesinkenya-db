
import React, { useState, useEffect } from 'react';
import { 
  registrationsService, 
  placesService, 
  operatorsService, 
  usersService 
} from './firebase/services';
import { Registration, Place, AppUser } from './types';
import { 
  Building2, 
  Compass, 
  MapPin, 
  BarChart3, 
  Users, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Menu, 
  X, 
  LogOut,
  ExternalLink,
  ChevronRight,
  Eye,
  Mail,
  MoreVertical,
  Calendar,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { user, loading: authLoading, isAdmin, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registrations' | 'operators' | 'guides' | 'places' | 'events' | 'users' | 'reports' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // States for lists
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regStatusFilter, setRegStatusFilter] = useState<Registration['status']>('PENDING');
  const [loading, setLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
    }
  }, [isAdmin, regStatusFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await registrationsService.getAllByStatus(regStatusFilter);
      setRegistrations(data);
      if (regStatusFilter === 'PENDING') {
        setPendingCount(data.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!user) return;
    try {
      await registrationsService.approveAndPublish(id, user.uid);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      setSelectedReg(null);
      alert('Application Approved & Listing Published.');
    } catch (err) {
      console.error(err);
      alert('Approval failed.');
    }
  };

  const handleUpdateStatus = async (id: string, status: Registration['status'], notes: string) => {
    try {
      await registrationsService.updateStatus(id, status, notes);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      setSelectedReg(null);
      alert(`Status updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-safari border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not admin, show a generic 404 page as requested
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-9xl font-serif font-black text-navy/10 leading-none">404</h1>
        <div className="space-y-6 max-w-sm">
          <h2 className="text-2xl font-serif font-bold text-navy">Reality Not Found</h2>
          <p className="text-navy/40 font-medium leading-relaxed italic">
            The coordinates you provided do not correspond to any known destination in our collective.
          </p>
          <div className="pt-8">
            <button 
              onClick={login}
              className="px-10 h-14 border border-navy/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy/20 hover:text-navy hover:border-navy transition-all"
            >
              Verify Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Command Hub', icon: <BarChart3 size={18} /> },
    { id: 'registrations', label: 'Approval Center', icon: <FileText size={18} />, badge: pendingCount },
    { id: 'operators', label: 'Tour Operators', icon: <Building2 size={18} /> },
    { id: 'guides', label: 'Private Guides', icon: <Compass size={18} /> },
    { id: 'places', label: 'Catalogue', icon: <MapPin size={18} /> },
    { id: 'events', label: 'Event Feed', icon: <Calendar size={18} /> },
    { id: 'users', label: 'Member List', icon: <Users size={18} /> },
    { id: 'reports', label: 'Analytics', icon: <ExternalLink size={18} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-off-white text-navy font-sans flex">
      {/* Sidebar */}
      <aside className={`bg-navy transition-all duration-500 overflow-hidden flex flex-col ${sidebarOpen ? 'w-80' : 'w-0'}`}>
         <div className="p-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-safari flex items-center justify-center rounded-xl text-white shadow-xl shadow-safari/20 font-serif font-bold text-xl">K</div>
               <span className="text-white font-serif font-bold text-xl tracking-tight">Architect</span>
            </div>
         </div>

         <nav className="flex-1 px-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-safari text-white shadow-2xl' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  {item.label}
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shadow-lg">{item.badge}</span>
                )}
              </button>
            ))}
         </nav>

         <div className="p-8 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10">
                  <img src={`https://ui-avatars.com/api/?name=${user.email}&background=000814&color=E5B97B`} alt="Avatar" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white/40 uppercase truncate">Master Admin</p>
                  <p className="text-xs font-bold text-safari truncate">{user.email}</p>
               </div>
            </div>
            <button onClick={logout} className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white/30 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all">
               <LogOut size={16} /> Termination
            </button>
         </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
         <header className="h-24 bg-white border-b border-navy/5 flex items-center justify-between px-10">
            <div className="flex items-center gap-8">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 hover:bg-navy hover:text-white transition-all">
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
               </button>
               <div className="flex items-center gap-3 bg-navy/5 h-12 px-6 rounded-2xl border border-navy/5 w-96 max-w-full">
                  <Search size={18} className="text-navy/20" />
                  <input type="text" placeholder="Scan the collective database..." className="bg-transparent border-none outline-none flex-1 text-sm font-medium text-navy placeholder:text-navy/20" />
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 h-12 px-6 bg-green-500/5 text-green-600 rounded-2xl border border-green-500/10 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Nexus Synchronized
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-12 bg-cream/30">
            <AnimatePresence mode="wait">
               {activeTab === 'dashboard' && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                       {[
                         { label: 'Pending Approvals', val: pendingCount, icon: <AlertCircle />, trend: 'High Priority', color: 'text-red-500' },
                         { label: 'Verified Partners', val: '124', icon: <CheckCircle2 />, trend: '+12 new', color: 'text-safari' },
                         { label: 'Catalogue Items', val: '840', icon: <MapPin />, trend: '+4 today', color: 'text-navy' },
                         { label: 'Monthly Clicks', val: '45.2k', icon: <BarChart3 />, trend: '+18.4%', color: 'text-green-500' }
                       ].map(stat => (
                         <div key={stat.label} className="bg-white border border-navy/5 p-8 rounded-[40px] shadow-sm space-y-6">
                            <div className="flex justify-between items-start">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-navy/5 ${stat.color}`}>{stat.icon}</div>
                               <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.trend}</span>
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-4xl font-serif font-bold text-navy">{stat.val}</h4>
                               <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">{stat.label}</p>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                       <div className="bg-navy rounded-[50px] p-12 space-y-8">
                          <div className="flex justify-between items-center">
                             <h3 className="text-2xl font-serif font-bold text-white">Critical Notifications</h3>
                             <button className="text-[10px] font-bold text-safari uppercase tracking-widest">History</button>
                          </div>
                          <div className="space-y-4">
                             {[1,2,3].map(i => (
                               <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-safari/20 text-safari rounded-xl flex items-center justify-center font-bold text-xs">{i}</div>
                                     <div>
                                        <p className="text-white text-sm font-bold">Protocol Delta Detected</p>
                                        <p className="text-white/40 text-xs italic">User #{$234} requested manual verification override.</p>
                                     </div>
                                  </div>
                                  <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-white border border-navy/5 rounded-[50px] p-12 space-y-8">
                          <div className="flex justify-between items-center">
                             <h3 className="text-2xl font-serif font-bold text-navy">Cloud Integrity Feed</h3>
                             <div className="h-8 px-4 bg-navy text-white rounded-lg flex items-center text-[9px] font-black uppercase tracking-widest">Live</div>
                          </div>
                          <div className="space-y-6">
                            <div className="h-64 flex items-end gap-2 px-4 py-8 bg-navy/5 rounded-3xl">
                               {[40, 70, 45, 90, 65, 80, 50, 85, 30, 75, 55, 95].map((h, i) => (
                                 <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-safari/20 rounded-t-lg hover:bg-safari transition-all cursor-crosshair group relative">
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-navy text-white text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h * 123).toLocaleString()}</div>
                                 </div>
                               ))}
                            </div>
                            <p className="text-center text-[10px] text-navy/20 font-black uppercase tracking-widest italic">Temporal Activity: Last 12 Cycles</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'registrations' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                       <div className="space-y-2">
                          <h2 className="text-4xl font-serif font-bold text-navy">Approval Center</h2>
                          <p className="text-navy/40 text-sm italic">Curation queue for incoming collective applications.</p>
                       </div>
                       <div className="flex gap-2 p-2 bg-white rounded-2xl border border-navy/5 shadow-sm">
                          {['PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_NEEDED'].map(status => (
                            <button 
                              key={status}
                              onClick={() => setRegStatusFilter(status as any)}
                              className={`px-6 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${regStatusFilter === status ? 'bg-navy text-white shadow-xl' : 'text-navy/20 hover:text-navy/40'}`}
                            >
                              {status.replace('_', ' ')}
                            </button>
                          ))}
                       </div>
                    </header>

                    {loading ? (
                      <div className="py-20 flex flex-col items-center gap-6">
                         <div className="w-12 h-12 border-4 border-safari border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-[10px] font-black text-navy/20 uppercase tracking-widest">Synchronizing Registry...</p>
                      </div>
                    ) : registrations.length === 0 ? (
                      <div className="py-32 bg-white rounded-[50px] border-2 border-dashed border-navy/5 flex flex-col items-center justify-center space-y-6">
                         <FileText size={64} className="text-navy/5" />
                         <div className="text-center space-y-2">
                           <p className="text-xl font-serif font-bold text-navy/40">Queue Resolved</p>
                           <p className="text-navy/20 text-sm italic">No entries found for the selected status.</p>
                         </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                         {registrations.map(reg => (
                           <div key={reg.id} className="bg-white border border-navy/5 p-8 rounded-[40px] flex flex-col lg:flex-row justify-between gap-10 group hover:shadow-lux transition-all">
                              <div className="flex-1 flex gap-8">
                                 <div className="w-20 h-20 bg-navy/5 rounded-3xl flex items-center justify-center shrink-0 border border-navy/5">
                                    {reg.type === 'GUIDE' ? <Compass size={32} className="text-safari" /> : <Building2 size={32} className="text-safari" />}
                                 </div>
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                       <span className="px-3 h-6 bg-navy text-white rounded-md flex items-center text-[9px] font-black uppercase tracking-[0.2em]">{reg.type}</span>
                                       <span className="text-[10px] font-bold text-navy/20">{reg.submittedAt?.seconds ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div>
                                       <h4 className="text-2xl font-serif font-bold text-navy group-hover:text-safari transition-colors">{reg.businessName}</h4>
                                       <p className="text-navy/40 text-sm italic max-w-lg mb-4 line-clamp-2">{reg.description}</p>
                                       <div className="flex flex-wrap gap-6 pt-2">
                                          <div className="flex items-center gap-2 text-[10px] font-bold text-navy/60"><Mail size={14} className="text-safari" /> {reg.email}</div>
                                          <div className="flex items-center gap-2 text-[10px] font-bold text-navy/60"><Compass size={14} className="text-safari" /> {reg.details?.regNumber || 'N/A'}</div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <button 
                                   onClick={() => setSelectedReg(reg)}
                                   className="h-14 px-10 bg-navy/5 text-navy/40 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all"
                                 >
                                    <Eye size={16} /> Inspection
                                 </button>
                                 <button 
                                   onClick={() => handleApprove(reg.id!)}
                                   className="h-14 px-10 bg-safari text-white rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-safari/20 hover:scale-105 transition-all"
                                 >
                                    <CheckCircle2 size={16} /> Grant
                                 </button>
                              </div>
                           </div>
                         ))}
                      </div>
                    )}
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* Detail View Modal */}
      <AnimatePresence>
         {selectedReg && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-xl flex items-center justify-center p-6 md:p-20"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="max-w-6xl w-full bg-white rounded-[60px] overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] shadow-lux"
              >
                 <div className="w-full md:w-2/5 h-full bg-navy p-16 flex flex-col justify-between text-white overflow-y-auto">
                    <div className="space-y-12">
                       <div className="space-y-4">
                          <span className="px-5 h-8 bg-safari/20 text-safari rounded-full flex items-center text-[10px] font-black uppercase tracking-widest w-fit">{selectedReg.type}</span>
                          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{selectedReg.businessName}</h2>
                       </div>
                       
                       <div className="space-y-10">
                          <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Application Narrative</p>
                             <p className="text-white/60 text-sm italic font-light leading-relaxed">{selectedReg.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-8">
                             {[
                               { label: 'Direct Vector', val: selectedReg.email },
                               { label: 'Mobile Secure', val: selectedReg.phone },
                               { label: 'Booking Link', val: selectedReg.details?.bookingLink || 'N/A' },
                               { label: 'Registry Key', val: selectedReg.details?.regNumber || 'N/A' },
                               { label: 'Temporal Entry', val: selectedReg.submittedAt?.seconds ? new Date(selectedReg.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A' }
                             ].map(item => (
                               <div key={item.label} className="space-y-1">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{item.label}</p>
                                  <p className="text-sm font-bold text-safari">{item.val}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setSelectedReg(null)}
                      className="mt-20 w-fit flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all group"
                    >
                       <X className="group-hover:rotate-90 transition-transform" /> Retract Inspection
                    </button>
                 </div>

                 <div className="flex-1 p-20 overflow-y-auto space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <h3 className="text-2xl font-serif font-bold text-navy flex items-center gap-4">
                             <ShieldCheck className="text-safari" /> Verified Assets
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                             {selectedReg.documents?.photos?.length > 0 ? selectedReg.documents.photos.map((p, i) => (
                               <div key={i} className="aspect-square bg-navy/5 rounded-3xl overflow-hidden border border-navy/5">
                                  <img src={p} className="w-full h-full object-cover" alt="Asset" />
                               </div>
                             )) : (
                               [1,2,3,4].map(i => (
                                 <div key={i} className="aspect-square bg-navy/5 rounded-3xl flex flex-col items-center justify-center text-navy/10 space-y-2 border border-navy/5 border-dashed">
                                    <MapPin size={24} />
                                    <span className="text-[9px] font-bold uppercase">Placeholder</span>
                                 </div>
                               ))
                             )}
                          </div>
                       </div>

                       <div className="space-y-10">
                          <div className="space-y-6">
                             <h3 className="text-2xl font-serif font-bold text-navy">Curation Controls</h3>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Internal Admin Memo</label>
                                <textarea className="w-full h-40 bg-navy/5 rounded-3xl p-8 font-medium text-navy text-sm focus:ring-4 focus:ring-safari/10 outline-none border-none transition-all resize-none" placeholder="Enter observational data for the collective..." />
                             </div>
                          </div>

                          <div className="space-y-4 pt-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                  onClick={() => handleUpdateStatus(selectedReg.id!, 'REJECTED', 'Failed verification protocols.')}
                                  className="h-16 bg-navy/5 text-navy/40 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all border border-navy/5"
                                >
                                   <XCircle size={18} /> Rescind
                                </button>
                                <button className="h-16 bg-navy/5 text-navy/40 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-safari/10 hover:text-safari transition-all border border-navy/5">
                                   <Mail size={18} /> Request Data
                                </button>
                             </div>
                             <button 
                               onClick={() => handleApprove(selectedReg.id!)}
                               className="w-full h-20 bg-safari text-white rounded-[30px] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl shadow-safari/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                             >
                                <CheckCircle2 size={24} /> Approve & Publish to Network
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default App;
