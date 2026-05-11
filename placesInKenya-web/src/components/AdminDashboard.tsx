
import React, { useState, useEffect } from 'react';
import { pendingProvidersService, providersService, placesService } from '../firebase/services';
import { PendingProvider, TourOperator, Place } from '../types';
import { ShieldCheck, MapPin, Plus, CheckCircle2, XCircle, Clock, Search, ChevronRight, BarChart3, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const [pendingApps, setPendingApps] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'registry'>('overview');

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const apps = await pendingProvidersService.getAll();
      setPendingApps(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await pendingProvidersService.approve(id);
      setPendingApps(prev => prev.filter(a => a.id !== id));
      alert('Partner approved and registered in collective.');
    } catch (err) {
      console.error(err);
      alert('Approval sequence failed.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await pendingProvidersService.reject(id);
      setPendingApps(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 fixed inset-y-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2">
            <img src="/regenerated_image_1777526383628.png" className="w-full h-full object-contain" alt="Logo" />
          </div>
          <span className="font-serif font-bold text-lg">Architect</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Command Hub', icon: <BarChart3 size={18} /> },
            { id: 'approvals', label: 'Partner Requests', icon: <Users size={18} />, badge: pendingApps.length },
            { id: 'registry', label: 'Global Registry', icon: <MapPin size={18} /> },
            { id: 'settings', label: 'System Settings', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-4 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-safari text-white shadow-xl' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-white/10 text-safari px-2 py-0.5 rounded-md text-[10px] font-black">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-4">Instance Status</p>
          <div className="flex items-center gap-3 text-xs text-green-400 font-bold">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Cloud Primary Active
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-white/40 text-sm">Synchronized with the PlacesInKenya Global Collective.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              <Plus size={16} /> New Entry
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Destinations', val: '1,240', trend: '+12%' },
                  { label: 'Verified Partners', val: '86', trend: '+4%' },
                  { label: 'Cloud Transactions', val: '2.5k', trend: '+18%' },
                  { label: 'Network Uptime', val: '99.9%', trend: 'Stable' }
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                    <div className="flex items-baseline gap-3">
                      <h4 className="text-3xl font-serif font-bold">{stat.val}</h4>
                      <span className="text-[10px] text-green-400 font-bold">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-lg font-serif font-bold">Recent System Logs</h3>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-safari hover:text-white transition-colors">Clear Stream</button>
                </div>
                <div className="p-8 space-y-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center"><CheckCircle2 size={14}/></div>
                          <p className="text-sm">New <span className="font-bold text-safari">Safari Provider</span> application registered for review.</p>
                        </div>
                        <span className="text-[10px] text-white/20 font-bold">2m ago</span>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'approvals' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {loading ? (
                 <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-safari border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Syncing Applications...</p>
                 </div>
              ) : pendingApps.length === 0 ? (
                <div className="py-32 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed space-y-4">
                   <ShieldCheck className="mx-auto text-white/10" size={48} />
                   <div className="space-y-2">
                      <p className="text-lg font-serif font-bold">Queue Resolved</p>
                      <p className="text-white/40 text-sm">No pending partner applications require verification.</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {pendingApps.map(app => (
                    <div key={app.id} className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between gap-8 group hover:bg-white/10 transition-all">
                       <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                             <div className="px-3 h-6 bg-safari/10 border border-safari/20 text-safari text-[10px] font-black uppercase tracking-widest rounded-md flex items-center justify-center">
                               {app.type}
                             </div>
                             <span className="text-[10px] font-bold text-white/20">{app.submittedAt?.seconds ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
                          </div>
                          <div>
                             <h3 className="text-2xl font-serif font-bold mb-2">{app.businessName || app.name}</h3>
                             <p className="text-white/50 text-sm leading-relaxed max-w-xl">{app.description || app.bio}</p>
                          </div>
                          <div className="flex gap-12 pt-2">
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Base Price</p>
                                <p className="text-white font-bold">Ksh {app.basePrice.toLocaleString()}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Contact Details</p>
                                <p className="text-white font-bold">{app.email} • {app.phone}</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleReject(app.id)}
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                            title="Decline"
                          >
                            <XCircle size={24} />
                          </button>
                          <button 
                            onClick={() => handleApprove(app.id)}
                            className="h-14 px-8 rounded-2xl bg-safari text-white font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-safari-light transition-all flex items-center gap-3"
                          >
                            Verify & Register <CheckCircle2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
