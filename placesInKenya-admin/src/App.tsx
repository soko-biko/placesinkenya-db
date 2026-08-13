import React, { useState, useEffect } from 'react';
import { 
  registrationsService, 
  placesService, 
  operatorsService, 
  guidesService,
  eventsService,
  categoriesService,
  mediaService,
  usersService,
  siteSettingsService,
  auditLogService
} from './firebase/services';
import { 
  Registration, 
  Place, 
  TourOperator, 
  Guide, 
  Event, 
  Category, 
  MediaAsset, 
  AppUser, 
  SiteSettings, 
  AuditLog,
  DEFAULT_SITE_SETTINGS 
} from './types';
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
  Calendar,
  FileText,
  Image as ImageIcon,
  Layers,
  Trash2,
  Edit3,
  Upload,
  Copy,
  ShieldCheck,
  Activity,
  Save,
  Loader2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';

// Editors
import { PlaceEditor } from './components/PlaceEditor';
import { OperatorEditor } from './components/OperatorEditor';
import { GuideEditor } from './components/GuideEditor';
import { EventEditor } from './components/EventEditor';
import { CategoryEditor } from './components/CategoryEditor';
import { MediaPicker } from './components/MediaPicker';

type TabType = 
  | 'dashboard' 
  | 'registrations' 
  | 'places' 
  | 'operators' 
  | 'guides' 
  | 'events' 
  | 'categories' 
  | 'media' 
  | 'users' 
  | 'settings' 
  | 'audit';

const App: React.FC = () => {
  const { user, loading: authLoading, isAdmin, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // General loading & search state
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Counts & Stats
  const [pendingCount, setPendingCount] = useState(0);
  const [stats, setStats] = useState({
    places: 0,
    operators: 0,
    guides: 0,
    events: 0,
    categories: 0,
    users: 0,
    registrations: 0
  });

  // Data collections
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regStatusFilter, setRegStatusFilter] = useState<Registration['status']>('PENDING');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const [places, setPlaces] = useState<Place[]>([]);
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<string>('ALL');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeEditorOpen, setPlaceEditorOpen] = useState(false);

  const [operators, setOperators] = useState<TourOperator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<TourOperator | null>(null);
  const [operatorEditorOpen, setOperatorEditorOpen] = useState(false);

  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [guideEditorOpen, setGuideEditorOpen] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventEditorOpen, setEventEditorOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    if (isAdmin) {
      loadInitialData();
    }
  }, [isAdmin]);

  // Load active tab data
  useEffect(() => {
    if (isAdmin) {
      loadTabData(activeTab);
    }
  }, [isAdmin, activeTab, regStatusFilter]);

  const loadInitialData = async () => {
    try {
      const [pendingRegs, pList, oList, gList, eList, cList, uList, settings] = await Promise.all([
        registrationsService.getPending(),
        placesService.getAll(),
        operatorsService.getAll(),
        guidesService.getAll(),
        eventsService.getAll(),
        categoriesService.getAll(),
        usersService.getAll(),
        siteSettingsService.getSettings()
      ]);

      setPendingCount(pendingRegs.length);
      setStats({
        places: pList.length,
        operators: oList.length,
        guides: gList.length,
        events: eList.length,
        categories: cList.length,
        users: uList.length,
        registrations: pendingRegs.length
      });
      setSiteSettings(settings);
    } catch (err) {
      console.error("Error loading initial CMS data:", err);
    }
  };

  const loadTabData = async (tab: TabType) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'dashboard':
          const logs = await auditLogService.getRecentLogs();
          setAuditLogs(logs);
          await loadInitialData();
          break;
        case 'registrations':
          const regData = await registrationsService.getAllByStatus(regStatusFilter);
          setRegistrations(regData);
          if (regStatusFilter === 'PENDING') setPendingCount(regData.length);
          break;
        case 'places':
          const pData = await placesService.getAll();
          setPlaces(pData);
          break;
        case 'operators':
          const oData = await operatorsService.getAll();
          setOperators(oData);
          break;
        case 'guides':
          const gData = await guidesService.getAll();
          setGuides(gData);
          break;
        case 'events':
          const eData = await eventsService.getAll();
          setEvents(eData);
          break;
        case 'categories':
          const cData = await categoriesService.getAll();
          setCategories(cData);
          break;
        case 'media':
          const mData = await mediaService.getAll();
          setMediaAssets(mData);
          break;
        case 'users':
          const uData = await usersService.getAll();
          setAppUsers(uData);
          break;
        case 'settings':
          const sData = await siteSettingsService.getSettings();
          setSiteSettings(sData);
          break;
        case 'audit':
          const aLogs = await auditLogService.getRecentLogs();
          setAuditLogs(aLogs);
          break;
      }
    } catch (err) {
      console.error(`Error loading tab ${tab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Registrations
  const handleApproveRegistration = async (id: string) => {
    if (!user) return;
    try {
      await registrationsService.approveAndPublish(id, user.uid);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      setSelectedReg(null);
      setPendingCount(prev => Math.max(0, prev - 1));
      alert('Application Approved & Listing Published successfully.');
    } catch (err) {
      console.error(err);
      alert('Approval failed.');
    }
  };

  const handleUpdateRegStatus = async (id: string, status: Registration['status'], notes: string) => {
    try {
      await registrationsService.updateStatus(id, status, notes);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      setSelectedReg(null);
      alert(`Registration status updated to ${status}.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Places CRUD
  const handleSavePlace = async (data: Partial<Place>) => {
    if (selectedPlace?.id) {
      await placesService.update(selectedPlace.id, data);
    } else {
      await placesService.create(data);
    }
    await loadTabData('places');
    setSelectedPlace(null);
  };

  const handleDeletePlace = async (id: string) => {
    if (!confirm('Are you sure you want to delete this place from the catalogue?')) return;
    try {
      await placesService.delete(id);
      setPlaces(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  // Handlers for Operators CRUD
  const handleSaveOperator = async (data: Partial<TourOperator>) => {
    if (selectedOperator?.id) {
      await operatorsService.update(selectedOperator.id, data);
    } else {
      await operatorsService.create(data);
    }
    await loadTabData('operators');
    setSelectedOperator(null);
  };

  const handleDeleteOperator = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour operator?')) return;
    try {
      await operatorsService.delete(id);
      setOperators(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  // Handlers for Guides CRUD
  const handleSaveGuide = async (data: Partial<Guide>) => {
    if (selectedGuide?.id) {
      await guidesService.update(selectedGuide.id, data);
    } else {
      await guidesService.create(data);
    }
    await loadTabData('guides');
    setSelectedGuide(null);
  };

  const handleDeleteGuide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this private guide?')) return;
    try {
      await guidesService.delete(id);
      setGuides(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  // Handlers for Events CRUD
  const handleSaveEvent = async (data: Partial<Event>) => {
    if (selectedEvent?.id) {
      await eventsService.update(selectedEvent.id, data);
    } else {
      await eventsService.create(data);
    }
    await loadTabData('events');
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsService.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  // Handlers for Categories CRUD
  const handleSaveCategory = async (data: Partial<Category>) => {
    if (selectedCategory?.id) {
      await categoriesService.update(selectedCategory.id, data);
    } else {
      await categoriesService.create(data);
    }
    await loadTabData('categories');
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(`Are you sure you want to delete category "${id}"?`)) return;
    try {
      await categoriesService.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  // Media Library Upload & Delete
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const asset = await mediaService.upload(file, { altText: file.name });
      setMediaAssets(prev => [asset, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (asset: MediaAsset) => {
    if (!confirm(`Delete media asset "${asset.filename}"?`)) return;
    try {
      await mediaService.delete(asset.id, asset.storagePath);
      setMediaAssets(prev => prev.filter(m => m.id !== asset.id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await siteSettingsService.updateSettings(siteSettings);
      alert('Website configuration updated successfully! Changes will reflect live on the public site.');
    } catch (err) {
      console.error(err);
      alert('Failed to update site settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // User Role Toggle
  const handleToggleUserRole = async (uid: string, currentRole?: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Are you sure you want to set role for user ${uid} to ${newRole}?`)) return;
    try {
      await usersService.updateRole(uid, newRole);
      setAppUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update user role.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-safari border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60 text-xs font-mono uppercase tracking-widest">Authenticating Admin...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-9xl font-serif font-black text-navy/10 leading-none">404</h1>
        <div className="space-y-6 max-w-sm">
          <h2 className="text-2xl font-serif font-bold text-navy">Reality Not Found</h2>
          <p className="text-navy/40 font-medium leading-relaxed italic text-sm">
            The coordinates you provided do not correspond to an authorized administrator account.
          </p>
          <div className="pt-8">
            <button 
              onClick={login}
              className="px-10 h-14 border border-navy/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy hover:bg-navy hover:text-white transition-all shadow-sm"
            >
              Verify Master Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Command Hub', icon: <BarChart3 size={18} /> },
    { id: 'registrations', label: 'Approval Center', icon: <FileText size={18} />, badge: pendingCount },
    { id: 'places', label: 'Places Catalogue', icon: <MapPin size={18} /> },
    { id: 'operators', label: 'Tour Operators', icon: <Building2 size={18} /> },
    { id: 'guides', label: 'Private Guides', icon: <Compass size={18} /> },
    { id: 'events', label: 'Event Feed', icon: <Calendar size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Layers size={18} /> },
    { id: 'media', label: 'Media Library', icon: <ImageIcon size={18} /> },
    { id: 'users', label: 'Member List', icon: <Users size={18} /> },
    { id: 'settings', label: 'Website CMS Config', icon: <Settings size={18} /> },
    { id: 'audit', label: 'Audit Logs', icon: <Activity size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-off-white text-navy font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-navy transition-all duration-300 flex flex-col shrink-0 ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-safari flex items-center justify-center rounded-xl text-white shadow-xl shadow-safari/20 font-serif font-bold text-xl">K</div>
            <div>
              <span className="text-white font-serif font-bold text-lg tracking-tight block">PlacesInKenya</span>
              <span className="text-safari text-[9px] font-mono uppercase tracking-widest block">Admin CMS v2.0</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-5 h-12 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-safari text-white shadow-lg shadow-safari/20' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4 bg-navy-dark/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-safari/20 border border-safari/30 flex items-center justify-center text-safari font-serif font-bold text-sm">
              {user.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider truncate">Master Administrator</p>
              <p className="text-xs font-semibold text-safari truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full h-10 rounded-xl bg-white/5 border border-white/10 text-white/60 flex items-center justify-center gap-2 text-xs font-bold hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Navigation */}
        <header className="h-20 bg-white border-b border-navy/10 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/60 hover:bg-navy hover:text-white transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="flex items-center gap-3 bg-navy/5 h-11 px-4 rounded-xl border border-navy/5 w-80 max-w-full">
              <Search size={16} className="text-navy/30" />
              <input 
                type="text" 
                placeholder="Search across CMS..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-xs font-medium text-navy placeholder:text-navy/30" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => loadTabData(activeTab)} 
              className="h-10 px-4 bg-navy/5 hover:bg-navy/10 text-navy/70 rounded-xl flex items-center gap-2 text-xs font-bold transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="h-10 px-4 bg-safari/10 text-safari hover:bg-safari hover:text-white rounded-xl flex items-center gap-2 text-xs font-bold transition-colors"
            >
              <Globe size={14} /> View Public Site
            </a>
          </div>
        </header>

        {/* Tab Workspace */}
        <div className="flex-1 overflow-y-auto p-8 bg-cream/20">
          <AnimatePresence mode="wait">
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-navy">Command Hub</h1>
                  <p className="text-xs text-navy/50">Real-time CMS statistics, database records, and system health.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Pending Approvals', val: stats.registrations, icon: <AlertCircle className="text-red-500" />, tab: 'registrations' },
                    { label: 'Catalogue Places', val: stats.places, icon: <MapPin className="text-safari" />, tab: 'places' },
                    { label: 'Tour Operators', val: stats.operators, icon: <Building2 className="text-navy" />, tab: 'operators' },
                    { label: 'Private Guides', val: stats.guides, icon: <Compass className="text-green-600" />, tab: 'guides' },
                    { label: 'Events & Experiences', val: stats.events, icon: <Calendar className="text-purple-600" />, tab: 'events' },
                    { label: 'Categories', val: stats.categories, icon: <Layers className="text-blue-600" />, tab: 'categories' },
                    { label: 'Registered Users', val: stats.users, icon: <Users className="text-amber-600" />, tab: 'users' },
                    { label: 'CMS Status', val: 'Active', icon: <CheckCircle2 className="text-green-500" />, tab: 'settings' }
                  ].map(stat => (
                    <div 
                      key={stat.label} 
                      onClick={() => setActiveTab(stat.tab as any)}
                      className="bg-white border border-navy/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-navy/40">{stat.label}</p>
                        <p className="text-3xl font-serif font-bold text-navy group-hover:text-safari transition-colors">{stat.val}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-xl">
                        {stat.icon}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Audit Logs Preview */}
                <div className="bg-white border border-navy/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-navy">Recent CMS Audit Activity</h3>
                    <button onClick={() => setActiveTab('audit')} className="text-xs font-bold text-safari hover:underline">View All Logs →</button>
                  </div>
                  <div className="divide-y divide-navy/5">
                    {auditLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-navy">{log.action}</span> on <span className="text-safari font-mono">{log.targetType}</span> ({log.targetId || 'global'})
                          <p className="text-[10px] text-navy/40">{log.adminEmail}</p>
                        </div>
                        <span className="text-[10px] text-navy/40 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <p className="py-6 text-center text-navy/40 text-xs italic">No activity logged yet.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. REGISTRATIONS / APPROVAL CENTER TAB */}
            {activeTab === 'registrations' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Approval Center</h1>
                    <p className="text-xs text-navy/50">Review incoming business and guide applications before publishing.</p>
                  </div>
                  <div className="flex gap-1 p-1 bg-white rounded-xl border border-navy/10 shadow-sm">
                    {(['PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_NEEDED'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setRegStatusFilter(st)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          regStatusFilter === st ? 'bg-navy text-white shadow' : 'text-navy/40 hover:text-navy'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="py-20 flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-safari" />
                    <p className="text-xs font-bold uppercase text-navy/40">Fetching registrations...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-navy/10 rounded-2xl p-12 text-center space-y-2">
                    <FileText size={48} className="mx-auto text-navy/20" />
                    <p className="font-serif font-bold text-navy">No {regStatusFilter.toLowerCase()} registrations found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {registrations.map(reg => (
                      <div key={reg.id} className="bg-white border border-navy/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 bg-safari/10 text-safari rounded-md text-[10px] font-bold uppercase tracking-wider">
                              {reg.type}
                            </span>
                            <span className="text-xs text-navy/40 font-mono">
                              {reg.submittedAt?.seconds ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-navy">{reg.businessName}</h3>
                          <p className="text-xs text-navy/60 line-clamp-2 max-w-2xl">{reg.description}</p>
                          <div className="flex items-center gap-4 text-xs font-medium text-navy/50 pt-1">
                            <span>📧 {reg.email}</span>
                            <span>📞 {reg.phone}</span>
                            {reg.details?.address && <span>📍 {reg.details.address}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="px-4 py-2 bg-navy/5 hover:bg-navy/10 text-navy text-xs font-bold rounded-xl flex items-center gap-2"
                          >
                            <Eye size={14} /> Inspect
                          </button>
                          {reg.status === 'PENDING' && (
                            <button
                              onClick={() => handleApproveRegistration(reg.id!)}
                              className="px-5 py-2 bg-safari text-white hover:bg-safari-hover text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-safari/20"
                            >
                              <CheckCircle2 size={14} /> Approve & Publish
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. PLACES CATALOGUE TAB */}
            {activeTab === 'places' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Places Catalogue</h1>
                    <p className="text-xs text-navy/50">Manage authentic Kenyan destinations, experiences, and businesses.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlace(null); setPlaceEditorOpen(true); }}
                    className="px-6 h-11 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20 hover:bg-safari-hover transition-colors"
                  >
                    <Plus size={16} /> Add New Place
                  </button>
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-navy/10">
                  <span className="text-xs font-bold uppercase text-navy/40">Category Filter:</span>
                  {['ALL', 'RESTAURANT', 'OUTDOORS', 'SAFARI', 'EXPERIENCE', 'HOTEL', 'SHOPPING'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPlaceCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        placeCategoryFilter === cat ? 'bg-navy text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Places Grid */}
                {loading ? (
                  <div className="py-20 text-center"><Loader2 size={32} className="animate-spin text-safari mx-auto" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {places
                      .filter(p => placeCategoryFilter === 'ALL' || p.category === placeCategoryFilter)
                      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(place => (
                        <div key={place.id} className="bg-white border border-navy/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                          <div className="aspect-video relative bg-navy/10">
                            <img src={place.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'} alt={place.name} className="w-full h-full object-cover" />
                            <span className="absolute top-3 left-3 bg-navy/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm">
                              {place.category}
                            </span>
                            {place.isTrending && (
                              <span className="absolute top-3 right-3 bg-safari text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                                Trending
                              </span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h3 className="font-serif font-bold text-lg text-navy line-clamp-1">{place.name}</h3>
                              <p className="text-xs text-navy/50 flex items-center gap-1 mt-1"><MapPin size={12} /> {place.location}</p>
                              <p className="text-xs text-navy/70 line-clamp-2 mt-2">{place.description}</p>
                            </div>
                            <div className="pt-3 border-t border-navy/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-safari">KES {(place.price || 0).toLocaleString()}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { setSelectedPlace(place); setPlaceEditorOpen(true); }}
                                  className="p-2 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeletePlace(place.id!)}
                                  className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. TOUR OPERATORS TAB */}
            {activeTab === 'operators' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Tour Operators</h1>
                    <p className="text-xs text-navy/50">Manage registered Kenyan safari companies and tour agencies.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedOperator(null); setOperatorEditorOpen(true); }}
                    className="px-6 h-11 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20"
                  >
                    <Plus size={16} /> Add Tour Operator
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {operators
                    .filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(op => (
                      <div key={op.id} className="bg-white border border-navy/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="flex items-center gap-4">
                          <img src={op.imageUrl || 'https://images.unsplash.com/photo-1516426122078-c23e76319801'} alt={op.name} className="w-14 h-14 rounded-xl object-cover border border-navy/10" />
                          <div>
                            <h3 className="font-serif font-bold text-base text-navy">{op.name}</h3>
                            <span className="text-[10px] font-bold text-safari uppercase">{op.type}</span>
                          </div>
                        </div>
                        <p className="text-xs text-navy/60 line-clamp-2">{op.bio}</p>
                        <div className="pt-3 border-t border-navy/5 flex items-center justify-between text-xs">
                          <span className="font-bold text-navy">From KES {(op.basePrice || 0).toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedOperator(op); setOperatorEditorOpen(true); }} className="p-2 text-navy/60 hover:text-navy">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleDeleteOperator(op.id!)} className="p-2 text-red-500/70 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* 5. PRIVATE GUIDES TAB */}
            {activeTab === 'guides' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Private Guides</h1>
                    <p className="text-xs text-navy/50">Manage verified independent wildlife naturalists and local guides.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedGuide(null); setGuideEditorOpen(true); }}
                    className="px-6 h-11 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20"
                  >
                    <Plus size={16} /> Add Private Guide
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides
                    .filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(guide => (
                      <div key={guide.id} className="bg-white border border-navy/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="flex items-center gap-4">
                          <img src={guide.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt={guide.name} className="w-14 h-14 rounded-full object-cover border border-navy/10" />
                          <div>
                            <h3 className="font-serif font-bold text-base text-navy">{guide.name}</h3>
                            <p className="text-xs text-safari font-medium">{guide.title}</p>
                          </div>
                        </div>
                        <p className="text-xs text-navy/60 line-clamp-2">{guide.bio}</p>
                        <div className="pt-3 border-t border-navy/5 flex items-center justify-between text-xs">
                          <span className="font-bold text-navy">KES {(guide.basePrice || 0).toLocaleString()} / day</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedGuide(guide); setGuideEditorOpen(true); }} className="p-2 text-navy/60 hover:text-navy">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleDeleteGuide(guide.id!)} className="p-2 text-red-500/70 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* 6. EVENTS TAB */}
            {activeTab === 'events' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Event Feed</h1>
                    <p className="text-xs text-navy/50">Manage cultural festivals, marathons, and curated Kenyan events.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedEvent(null); setEventEditorOpen(true); }}
                    className="px-6 h-11 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20"
                  >
                    <Plus size={16} /> Add New Event
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map(ev => (
                    <div key={ev.id} className="bg-white border border-navy/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                      <div className="aspect-video relative bg-navy/10">
                        <img src={ev.imageUrl || 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d'} alt={ev.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-navy/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                          {ev.date}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-navy line-clamp-1">{ev.title}</h3>
                          <p className="text-xs text-navy/50 flex items-center gap-1 mt-1"><MapPin size={12} /> {ev.location}</p>
                          <p className="text-xs text-navy/70 line-clamp-2 mt-2">{ev.description}</p>
                        </div>
                        <div className="pt-3 border-t border-navy/5 flex items-center justify-between text-xs">
                          <span className="font-bold text-safari">KES {(ev.price || 0).toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedEvent(ev); setEventEditorOpen(true); }} className="p-2 text-navy/60 hover:text-navy"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteEvent(ev.id!)} className="p-2 text-red-500/70 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 7. CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Categories & Collections</h1>
                    <p className="text-xs text-navy/50">Manage high-level groupings (Outdoors, Safari, Shopping, Dining, etc.)</p>
                  </div>
                  <button
                    onClick={() => { setSelectedCategory(null); setCategoryEditorOpen(true); }}
                    className="px-6 h-11 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20"
                  >
                    <Plus size={16} /> Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-white border border-navy/10 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-safari uppercase font-mono">{cat.slug}</span>
                        <h3 className="font-serif font-bold text-lg text-navy">{cat.name}</h3>
                        <p className="text-xs text-navy/50">{cat.description || 'No description provided'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedCategory(cat); setCategoryEditorOpen(true); }} className="p-2 text-navy/60 hover:text-navy"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteCategory(cat.id!)} className="p-2 text-red-500/70 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 8. MEDIA LIBRARY TAB */}
            {activeTab === 'media' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-navy">Media Library</h1>
                    <p className="text-xs text-navy/50">Upload and manage image assets stored securely in Firebase Storage.</p>
                  </div>
                  <label className="px-6 h-11 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-safari/20">
                    {uploadingMedia ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>{uploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleMediaUpload} className="hidden" disabled={uploadingMedia} />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {mediaAssets.map(asset => (
                    <div key={asset.id} className="bg-white border border-navy/10 rounded-2xl overflow-hidden shadow-sm group relative">
                      <div className="aspect-square bg-navy/10 relative">
                        <img src={asset.downloadURL} alt={asset.filename} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
                          <p className="text-xs font-bold truncate">{asset.filename}</p>
                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(asset.downloadURL);
                                alert('Download URL copied to clipboard!');
                              }}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs"
                              title="Copy URL"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(asset)}
                              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-xs"
                              title="Delete Asset"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 9. MEMBER LIST TAB */}
            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-navy">Member Directory</h1>
                  <p className="text-xs text-navy/50">User accounts and permissions stored in Firebase Auth & Firestore.</p>
                </div>

                <div className="bg-white border border-navy/10 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-navy/10 bg-navy/5 text-navy/60 text-[10px] font-bold uppercase tracking-wider">
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5 text-xs">
                      {appUsers.map(u => (
                        <tr key={u.uid} className="hover:bg-navy/5">
                          <td className="p-4 font-bold text-navy">{u.displayName || u.email?.split('@')[0] || 'Member'}</td>
                          <td className="p-4 text-navy/70">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                              u.role === 'ADMIN' ? 'bg-safari text-white' : 'bg-navy/10 text-navy/70'
                            }`}>
                              {u.role || 'USER'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleUserRole(u.uid, u.role)}
                              className="text-xs font-bold text-safari hover:underline"
                            >
                              Toggle Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 10. WEBSITE CMS CONFIG TAB */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-navy">Website CMS Configuration</h1>
                  <p className="text-xs text-navy/50">Edit public site copy, hero banners, partner messaging, and contact details live.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="bg-white border border-navy/10 rounded-2xl p-8 space-y-8 max-w-4xl shadow-sm">
                  {/* Hero Section */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-xl text-navy pb-2 border-b border-navy/10">Hero Header Banner</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase text-navy/70">Main Title Lead</label>
                        <input
                          type="text"
                          value={siteSettings.heroTitle || ''}
                          onChange={e => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                          className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-navy/70">Title Highlight Text</label>
                        <input
                          type="text"
                          value={siteSettings.heroTitleHighlight || ''}
                          onChange={e => setSiteSettings({ ...siteSettings, heroTitleHighlight: e.target.value })}
                          className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium text-safari font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-navy/70">Hero Subtitle</label>
                      <textarea
                        rows={2}
                        value={siteSettings.heroSubtitle || ''}
                        onChange={e => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-navy/70">Hero Background Image URL</label>
                      <input
                        type="url"
                        value={siteSettings.heroBgImage || ''}
                        onChange={e => setSiteSettings({ ...siteSettings, heroBgImage: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Partner Section */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-xl text-navy pb-2 border-b border-navy/10">Partner & Registration Banner</h3>
                    <div>
                      <label className="text-xs font-bold uppercase text-navy/70">Partner Title</label>
                      <input
                        type="text"
                        value={siteSettings.partnerTitle || ''}
                        onChange={e => setSiteSettings({ ...siteSettings, partnerTitle: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-navy/70">Partner Subtitle</label>
                      <textarea
                        rows={2}
                        value={siteSettings.partnerSubtitle || ''}
                        onChange={e => setSiteSettings({ ...siteSettings, partnerSubtitle: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* General Info */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-xl text-navy pb-2 border-b border-navy/10">Site Identity & Contact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase text-navy/70">Concierge Email</label>
                        <input
                          type="email"
                          value={siteSettings.contactEmail || ''}
                          onChange={e => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                          className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-navy/70">Contact Phone</label>
                        <input
                          type="tel"
                          value={siteSettings.contactPhone || ''}
                          onChange={e => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                          className="w-full mt-1 px-4 py-2.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-8 h-12 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20 hover:bg-safari-hover transition-colors disabled:opacity-50"
                  >
                    {savingSettings ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{savingSettings ? 'Saving...' : 'Save & Publish Config'}</span>
                  </button>
                </form>
              </motion.div>
            )}

            {/* 11. AUDIT LOGS TAB */}
            {activeTab === 'audit' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-navy">Audit Trail</h1>
                  <p className="text-xs text-navy/50">Immutable history of administrative operations for compliance and security.</p>
                </div>

                <div className="bg-white border border-navy/10 rounded-2xl p-6 shadow-sm">
                  <div className="space-y-3 divide-y divide-navy/5">
                    {auditLogs.map(log => (
                      <div key={log.id} className="pt-3 flex items-start justify-between text-xs">
                        <div>
                          <p className="font-bold text-navy">{log.action}</p>
                          <p className="text-navy/60">Target: <span className="font-mono text-safari">{log.targetType}</span> (ID: {log.targetId || 'N/A'})</p>
                          <p className="text-[10px] text-navy/40">Executed by: {log.adminEmail}</p>
                        </div>
                        <span className="font-mono text-[10px] text-navy/40">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MODAL EDITORS */}
      <PlaceEditor 
        isOpen={placeEditorOpen}
        onClose={() => setPlaceEditorOpen(false)}
        onSave={handleSavePlace}
        initialData={selectedPlace}
      />

      <OperatorEditor 
        isOpen={operatorEditorOpen}
        onClose={() => setOperatorEditorOpen(false)}
        onSave={handleSaveOperator}
        initialData={selectedOperator}
      />

      <GuideEditor 
        isOpen={guideEditorOpen}
        onClose={() => setGuideEditorOpen(false)}
        onSave={handleSaveGuide}
        initialData={selectedGuide}
      />

      <EventEditor 
        isOpen={eventEditorOpen}
        onClose={() => setEventEditorOpen(false)}
        onSave={handleSaveEvent}
        initialData={selectedEvent}
      />

      <CategoryEditor 
        isOpen={categoryEditorOpen}
        onClose={() => setCategoryEditorOpen(false)}
        onSave={handleSaveCategory}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default App;
