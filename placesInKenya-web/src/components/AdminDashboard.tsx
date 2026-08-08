import React, { useState, useEffect } from 'react';
import { pendingProvidersService, providersService, placesService, eventsService, siteSettingsService, DEFAULT_SITE_SETTINGS } from '../firebase/services';
import { PendingProvider, TourOperator, Place, Event, PlaceCategory, OperatorType, SiteSettings } from '../types';
import { MOCK_PLACES, MOCK_EVENTS, MOCK_OPERATORS } from '../constants';
import { 
  ShieldCheck, MapPin, Plus, CheckCircle2, XCircle, Clock, Search, 
  ChevronRight, BarChart3, Users, Settings, FileText, Eye, Paperclip, 
  Edit3, Trash2, Calendar, Star, Filter, Sparkles, X, RefreshCw, 
  ExternalLink, Tag, ArrowUpRight, Compass, Building2, AlertTriangle,
  Database, FileSpreadsheet, Upload, Download, Image, Layout, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'events' | 'operators' | 'approvals' | 'config'>('overview');
  
  // Datasets
  const [placesList, setPlacesList] = useState<Place[]>([]);
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [operatorsList, setOperatorsList] = useState<TourOperator[]>([]);
  const [pendingApps, setPendingApps] = useState<PendingProvider[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Site Settings & Asset Management State
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [saveSettingsMsg, setSaveSettingsMsg] = useState<string>('');
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Bulk Import States
  const [importTarget, setImportTarget] = useState<'places' | 'events' | 'operators'>('places');
  const [importCsvText, setImportCsvText] = useState<string>('');
  const [importFileName, setImportFileName] = useState<string>('');
  const [parsedImportItems, setParsedImportItems] = useState<any[]>([]);
  const [importError, setImportError] = useState<string>('');
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Modals & Forms
  const [editingItem, setEditingItem] = useState<{ type: 'place' | 'event' | 'operator'; data: any } | null>(null);
  const [creatingItemType, setCreatingItemType] = useState<'place' | 'event' | 'operator' | null>(null);
  const [viewingApp, setViewingApp] = useState<PendingProvider | null>(null);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    count?: number;
    itemNames?: string[];
    actionText: string;
    variant: 'success' | 'danger' | 'warning';
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  // Form states
  const [placeForm, setPlaceForm] = useState<Partial<Place>>({
    name: '',
    category: PlaceCategory.RESTAURANT,
    description: '',
    price: 1500,
    location: 'Nairobi',
    imageUrl: '',
    rating: 4.8,
    isTrending: false,
    isVerified: true,
    tags: ['Popular'],
    bookingLink: '',
    ownerId: 'admin'
  });

  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: '',
    category: 'ADVENTURES',
    description: '',
    price: 3500,
    location: 'Nairobi',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    imageUrl: '',
    providerName: 'PlacesInKenya Curated',
    totalCapacity: 50,
    bookedCapacity: 0,
    bookingLink: '',
    mapsLink: ''
  });

  const [operatorForm, setOperatorForm] = useState<Partial<TourOperator>>({
    name: '',
    type: OperatorType.COMPANY,
    title: 'Certified Experience Provider',
    bio: '',
    basePrice: 15000,
    rating: 4.9,
    location: 'Nairobi',
    imageUrl: '',
    specialties: ['Safari', 'Excursions'],
    isVerified: true,
    bookingLink: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Places from Firestore, fallback to MOCK if empty
      const firestorePlaces = await placesService.getAll();
      if (firestorePlaces && firestorePlaces.length > 0) {
        // Merge with MOCK_PLACES so everything is accessible
        const combined = [...firestorePlaces];
        MOCK_PLACES.forEach(mp => {
          if (!combined.some(p => p.id === mp.id)) combined.push(mp);
        });
        setPlacesList(combined);
      } else {
        setPlacesList(MOCK_PLACES);
      }

      // 2. Fetch Events from Firestore
      const firestoreEvents = await eventsService.getAll();
      const localEventsStr = localStorage.getItem('places_custom_events');
      const localEvents = localEventsStr ? JSON.parse(localEventsStr) : [];
      
      const combinedEvents = [...firestoreEvents, ...localEvents];
      MOCK_EVENTS.forEach(me => {
        if (!combinedEvents.some(e => e.id === me.id)) combinedEvents.push(me);
      });
      setEventsList(combinedEvents);

      // 3. Fetch Providers from Firestore
      const firestoreProviders = await providersService.getAll();
      if (firestoreProviders && firestoreProviders.length > 0) {
        const combinedOps = [...firestoreProviders];
        MOCK_OPERATORS.forEach(mo => {
          if (!combinedOps.some(o => o.id === mo.id)) combinedOps.push(mo);
        });
        setOperatorsList(combinedOps);
      } else {
        setOperatorsList(MOCK_OPERATORS);
      }

      // 4. Fetch Pending Registrations
      const apps = await pendingProvidersService.getAll();
      setPendingApps(apps || []);

      // 5. Fetch Site Settings & Asset Configuration
      try {
        const settings = await siteSettingsService.getSettings();
        setSiteSettingsForm(settings);
      } catch (e) {
        console.warn('Fallback to default site settings:', e);
      }

    } catch (err) {
      console.error('Error syncing Firestore admin datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSettingsMsg('');
    try {
      const updated = await siteSettingsService.updateSettings(siteSettingsForm);
      setSiteSettingsForm(updated);
      setSaveSettingsMsg('All site assets, background images, and headings updated successfully!');
      setTimeout(() => setSaveSettingsMsg(''), 6000);
    } catch (err: any) {
      setSaveSettingsMsg('Failed to update site settings: ' + (err.message || String(err)));
    } finally {
      setIsSavingSettings(false);
    }
  };


  // Selection & Bulk Approval logic
  const toggleSelectApp = (id: string) => {
    setSelectedAppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllApps = () => {
    if (selectedAppIds.length === pendingApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(pendingApps.map(a => a.id));
    }
  };

  const triggerBulkApprove = (appsToApprove: PendingProvider[]) => {
    if (appsToApprove.length === 0) return;
    
    setConfirmModal({
      isOpen: true,
      title: appsToApprove.length === 1 ? 'Approve Partner Registration' : 'Bulk Approve Partner Applications',
      description: `You are about to approve ${appsToApprove.length} pending partner ${appsToApprove.length === 1 ? 'application' : 'applications'}. This will convert them into verified tour operators and publish their profiles live to Firestore and the main website.`,
      count: appsToApprove.length,
      itemNames: appsToApprove.map(a => a.businessName || a.name || 'Unnamed Applicant'),
      actionText: `Approve ${appsToApprove.length} ${appsToApprove.length === 1 ? 'Application' : 'Applications'}`,
      variant: 'success',
      onConfirm: async () => {
        setSyncing(true);
        try {
          const newOperators: TourOperator[] = [];
          for (const app of appsToApprove) {
            await pendingProvidersService.approve(app.id);
            newOperators.push({
              id: 'op_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              name: app.businessName || app.name || 'Verified Partner',
              type: (app.type as any) || OperatorType.COMPANY,
              bio: app.description || app.bio || 'Verified Partner on PlacesInKenya.',
              basePrice: app.basePrice || 15000,
              rating: 4.9,
              reviewsCount: 1,
              specialties: ['Custom Tours', 'Cultural Safaris'],
              location: 'Kenya',
              imageUrl: app.documents?.logoUrl || 'https://images.unsplash.com/photo-1549417229-aa67d3263c09',
              isVerified: true
            });
          }
          const approvedIds = appsToApprove.map(a => a.id);
          setOperatorsList(prev => [...newOperators, ...prev]);
          setPendingApps(prev => prev.filter(a => !approvedIds.includes(a.id)));
          setSelectedAppIds(prev => prev.filter(id => !approvedIds.includes(id)));
        } catch (err) {
          console.error(err);
        } finally {
          setSyncing(false);
          setConfirmModal(null);
        }
      }
    });
  };

  const triggerBulkReject = (appsToReject: PendingProvider[]) => {
    if (appsToReject.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: appsToReject.length === 1 ? 'Reject Partner Application' : 'Bulk Reject Partner Applications',
      description: `Are you sure you want to reject ${appsToReject.length} partner ${appsToReject.length === 1 ? 'application' : 'applications'}? Rejected applications will be removed from the onboarding queue.`,
      count: appsToReject.length,
      itemNames: appsToReject.map(a => a.businessName || a.name || 'Unnamed Applicant'),
      actionText: `Reject ${appsToReject.length} ${appsToReject.length === 1 ? 'Application' : 'Applications'}`,
      variant: 'danger',
      onConfirm: async () => {
        setSyncing(true);
        try {
          const rejectIds = appsToReject.map(a => a.id);
          for (const app of appsToReject) {
            await pendingProvidersService.reject(app.id);
          }
          setPendingApps(prev => prev.filter(a => !rejectIds.includes(a.id)));
          setSelectedAppIds(prev => prev.filter(id => !rejectIds.includes(id)));
        } catch (err) {
          console.error(err);
        } finally {
          setSyncing(false);
          setConfirmModal(null);
        }
      }
    });
  };

  // CREATE ENTITY HANDLERS
  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeForm.name) return;
    setSyncing(true);
    try {
      const created = await placesService.create(placeForm as Place);
      const newPlace: Place = {
        id: created?.id || 'place_' + Date.now(),
        name: placeForm.name || 'New Establishment',
        category: placeForm.category || PlaceCategory.RESTAURANT,
        description: placeForm.description || '',
        price: Number(placeForm.price) || 0,
        location: placeForm.location || 'Nairobi',
        imageUrl: placeForm.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947',
        rating: Number(placeForm.rating) || 4.8,
        isTrending: Boolean(placeForm.isTrending),
        isVerified: Boolean(placeForm.isVerified),
        tags: Array.isArray(placeForm.tags) ? placeForm.tags : ['Popular'],
        ownerId: 'admin',
        bookingLink: placeForm.bookingLink || ''
      };

      setPlacesList(prev => [newPlace, ...prev]);
      
      // Local storage sync backup
      const existingPlaces = JSON.parse(localStorage.getItem('places_custom_partners') || '[]');
      localStorage.setItem('places_custom_partners', JSON.stringify([newPlace, ...existingPlaces]));

      setCreatingItemType(null);
      alert('New Destination successfully published to Firestore and Main Site.');
    } catch (err) {
      console.error(err);
      alert('Destination created and synced.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;
    setSyncing(true);
    try {
      const created = await eventsService.create(eventForm as Event);
      const newEv: Event = {
        id: created?.id || 'event_' + Date.now(),
        title: eventForm.title || 'New Experience',
        providerId: 'admin',
        providerName: eventForm.providerName || 'PlacesInKenya Curated',
        date: eventForm.date || new Date().toISOString(),
        description: eventForm.description || '',
        price: Number(eventForm.price) || 0,
        location: eventForm.location || 'Nairobi',
        imageUrl: eventForm.imageUrl || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        registrations: 0,
        category: eventForm.category || 'ADVENTURES',
        totalCapacity: Number(eventForm.totalCapacity) || 50,
        bookedCapacity: 0,
        bookingLink: eventForm.bookingLink || '',
        mapsLink: eventForm.mapsLink || ''
      };

      setEventsList(prev => [newEv, ...prev]);

      const existingEvents = JSON.parse(localStorage.getItem('places_custom_events') || '[]');
      localStorage.setItem('places_custom_events', JSON.stringify([newEv, ...existingEvents]));

      setCreatingItemType(null);
      alert('New Event successfully registered in Firestore.');
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorForm.name) return;
    setSyncing(true);
    try {
      const created = await providersService.create(operatorForm as TourOperator);
      const newOp: TourOperator = {
        id: created?.id || 'op_' + Date.now(),
        name: operatorForm.name || 'New Partner',
        type: operatorForm.type || OperatorType.COMPANY,
        title: operatorForm.title || 'Experience Provider',
        bio: operatorForm.bio || '',
        basePrice: Number(operatorForm.basePrice) || 15000,
        rating: Number(operatorForm.rating) || 4.9,
        location: operatorForm.location || 'Nairobi',
        imageUrl: operatorForm.imageUrl || 'https://images.unsplash.com/photo-1549417229-aa67d3263c09',
        specialties: typeof operatorForm.specialties === 'string' ? (operatorForm.specialties as string).split(',').map(s => s.trim()) : (operatorForm.specialties || ['Safaris']),
        isVerified: Boolean(operatorForm.isVerified),
        bookingLink: operatorForm.bookingLink || ''
      };

      setOperatorsList(prev => [newOp, ...prev]);
      setCreatingItemType(null);
      alert('New Operator successfully added to Firestore Registry.');
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  // UPDATE HANDLERS
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSyncing(true);
    const { type, data } = editingItem;
    try {
      if (type === 'place') {
        await placesService.update(data.id, data);
        setPlacesList(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
      } else if (type === 'event') {
        await eventsService.update(data.id, data);
        setEventsList(prev => prev.map(e => e.id === data.id ? { ...e, ...data } : e));
      } else if (type === 'operator') {
        await providersService.update(data.id, data);
        setOperatorsList(prev => prev.map(o => o.id === data.id ? { ...o, ...data } : o));
      }
      setEditingItem(null);
      alert('Changes saved to Firestore & live site.');
    } catch (err) {
      console.error(err);
      // Fallback local update
      if (type === 'place') setPlacesList(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
      if (type === 'event') setEventsList(prev => prev.map(e => e.id === data.id ? { ...e, ...data } : e));
      if (type === 'operator') setOperatorsList(prev => prev.map(o => o.id === data.id ? { ...o, ...data } : o));
      setEditingItem(null);
    } finally {
      setSyncing(false);
    }
  };

  // DELETE HANDLERS
  const handleDeletePlace = (id: string, name?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Destination',
      description: `Are you sure you want to permanently delete ${name ? `"${name}"` : 'this destination'}? This will remove it from Firestore and the live website.`,
      actionText: 'Delete Destination',
      variant: 'danger',
      onConfirm: async () => {
        setSyncing(true);
        try {
          await placesService.delete(id);
          setPlacesList(prev => prev.filter(p => p.id !== id));
        } catch (err) {
          console.error(err);
          setPlacesList(prev => prev.filter(p => p.id !== id));
        } finally {
          setSyncing(false);
          setConfirmModal(null);
        }
      }
    });
  };

  const handleDeleteEvent = (id: string, title?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Experience / Event',
      description: `Are you sure you want to delete ${title ? `"${title}"` : 'this event'}? This action will remove it from the live experiences feed.`,
      actionText: 'Delete Event',
      variant: 'danger',
      onConfirm: async () => {
        setSyncing(true);
        try {
          await eventsService.delete(id);
          setEventsList(prev => prev.filter(e => e.id !== id));
        } catch (err) {
          console.error(err);
          setEventsList(prev => prev.filter(e => e.id !== id));
        } finally {
          setSyncing(false);
          setConfirmModal(null);
        }
      }
    });
  };

  const handleDeleteOperator = (id: string, name?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Tour Operator',
      description: `Are you sure you want to remove ${name ? `"${name}"` : 'this operator'}? They will no longer appear in operator searches or booking directories.`,
      actionText: 'Delete Operator',
      variant: 'danger',
      onConfirm: async () => {
        setSyncing(true);
        try {
          await providersService.delete(id);
          setOperatorsList(prev => prev.filter(o => o.id !== id));
        } catch (err) {
          console.error(err);
          setOperatorsList(prev => prev.filter(o => o.id !== id));
        } finally {
          setSyncing(false);
          setConfirmModal(null);
        }
      }
    });
  };

  // TOGGLES
  const handleToggleTrending = async (place: Place) => {
    const updated = !place.isTrending;
    setPlacesList(prev => prev.map(p => p.id === place.id ? { ...p, isTrending: updated } : p));
    try {
      await placesService.update(place.id, { isTrending: updated });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleVerifiedPlace = async (place: Place) => {
    const updated = !place.isVerified;
    setPlacesList(prev => prev.map(p => p.id === place.id ? { ...p, isVerified: updated } : p));
    try {
      await placesService.update(place.id, { isVerified: updated });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleVerifiedOperator = async (op: TourOperator) => {
    const updated = !op.isVerified;
    setOperatorsList(prev => prev.map(o => o.id === op.id ? { ...o, isVerified: updated } : o));
    try {
      await providersService.update(op.id, { isVerified: updated });
    } catch (e) {
      console.error(e);
    }
  };

  // CSV PARSER & BULK DATA IMPORT LOGIC
  const parseCsv = (text: string): { headers: string[]; rows: string[][] } => {
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        currentLine += char;
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = '';
        if (char === '\r' && text[i + 1] === '\n') {
          i++;
        }
      } else {
        currentLine += char;
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    if (lines.length === 0) return { headers: [], rows: [] };

    const parseRow = (line: string): string[] => {
      const fields: string[] = [];
      let field = '';
      let inQ = false;

      for (let j = 0; j < line.length; j++) {
        const c = line[j];
        if (c === '"') {
          if (inQ && line[j + 1] === '"') {
            field += '"';
            j++;
          } else {
            inQ = !inQ;
          }
        } else if (c === ',' && !inQ) {
          fields.push(field.trim());
          field = '';
        } else {
          field += c;
        }
      }
      fields.push(field.trim());
      return fields;
    };

    const headers = parseRow(lines[0]).map(h => h.toLowerCase().trim().replace(/^"/, '').replace(/"$/, ''));
    const rows = lines.slice(1).map(line => parseRow(line));

    return { headers, rows };
  };

  const downloadCsvTemplate = (entityType: 'places' | 'events' | 'operators') => {
    let headers = '';
    let sampleRow = '';
    let filename = '';

    if (entityType === 'places') {
      headers = 'name,category,description,price,location,imageUrl,rating,tags,bookingLink';
      sampleRow = '"Giraffe Sanctuary","RESTAURANT","Sanctuary for endangered Rothschild giraffes in Karen.",1500,"Nairobi","https://images.unsplash.com/photo-1547471080-7cc2caa01a7e",4.9,"Wildlife,Family","https://example.com/booking"';
      filename = 'places_import_template.csv';
    } else if (entityType === 'events') {
      headers = 'title,category,description,price,location,date,imageUrl,providerName,totalCapacity,bookingLink,mapsLink';
      sampleRow = '"Diani SunFest 2026","ADVENTURES","Annual beach festival with live music.",3500,"Diani","2026-09-15","https://images.unsplash.com/photo-1507525428034-b723cf961d3e","Coast Events",200,"https://example.com/tickets","https://maps.google.com"';
      filename = 'events_import_template.csv';
    } else {
      headers = 'name,type,title,bio,basePrice,rating,location,imageUrl,specialties,bookingLink';
      sampleRow = '"Mara Expeditions","COMPANY","Certified Wildlife Operator","Custom luxury safari packages across Kenya.",25000,4.9,"Nairobi","https://images.unsplash.com/photo-1516426122078-c23e76319801","Safari,Luxury","https://example.com/safari"';
      filename = 'operators_import_template.csv';
    }

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers, sampleRow].join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError('');
    setImportSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportCsvText(text);
        parseAndSetImportData(text, importTarget);
      }
    };
    reader.readAsText(file);
  };

  const parseAndSetImportData = (rawText: string, target: 'places' | 'events' | 'operators') => {
    setImportError('');
    try {
      const { headers, rows } = parseCsv(rawText);
      if (headers.length === 0 || rows.length === 0) {
        setImportError('CSV file is empty or missing headers.');
        setParsedImportItems([]);
        return;
      }

      const items: any[] = [];
      rows.forEach((row, rowIndex) => {
        if (row.length === 0 || row.every(cell => !cell.trim())) return;

        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = row[idx] || '';
        });

        if (target === 'places') {
          const name = rowObj['name'] || `Place #${rowIndex + 1}`;
          const catInput = (rowObj['category'] || 'RESTAURANT').toUpperCase();
          const category = Object.values(PlaceCategory).includes(catInput as any) 
            ? (catInput as PlaceCategory) 
            : PlaceCategory.RESTAURANT;
          
          items.push({
            id: 'place_imp_' + Date.now() + '_' + rowIndex,
            name,
            category,
            description: rowObj['description'] || 'Imported destination in Kenya.',
            price: parseFloat(rowObj['price']) || 1500,
            location: rowObj['location'] || 'Nairobi',
            imageUrl: rowObj['imageurl'] || rowObj['imageUrl'] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
            rating: parseFloat(rowObj['rating']) || 4.8,
            isTrending: true,
            isVerified: true,
            tags: rowObj['tags'] ? rowObj['tags'].split(',').map(t => t.trim()) : ['Imported'],
            bookingLink: rowObj['bookinglink'] || rowObj['bookingLink'] || '',
            ownerId: 'admin'
          });
        } else if (target === 'events') {
          items.push({
            id: 'event_imp_' + Date.now() + '_' + rowIndex,
            title: rowObj['title'] || `Event #${rowIndex + 1}`,
            category: rowObj['category'] || 'ADVENTURES',
            description: rowObj['description'] || 'Imported event experience.',
            price: parseFloat(rowObj['price']) || 3500,
            location: rowObj['location'] || 'Nairobi',
            date: rowObj['date'] || new Date().toISOString().split('T')[0],
            imageUrl: rowObj['imageurl'] || rowObj['imageUrl'] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            providerName: rowObj['providername'] || rowObj['providerName'] || 'PlacesInKenya Curated',
            totalCapacity: parseInt(rowObj['totalcapacity'] || rowObj['totalCapacity']) || 50,
            bookedCapacity: 0,
            bookingLink: rowObj['bookinglink'] || rowObj['bookingLink'] || '',
            mapsLink: rowObj['mapslink'] || rowObj['mapsLink'] || ''
          });
        } else if (target === 'operators') {
          const typeInput = (rowObj['type'] || 'COMPANY').toUpperCase();
          const type = Object.values(OperatorType).includes(typeInput as any)
            ? (typeInput as OperatorType)
            : OperatorType.COMPANY;

          items.push({
            id: 'op_imp_' + Date.now() + '_' + rowIndex,
            name: rowObj['name'] || `Operator #${rowIndex + 1}`,
            type,
            title: rowObj['title'] || 'Certified Tour Operator',
            bio: rowObj['bio'] || 'Verified partner registered on PlacesInKenya.',
            basePrice: parseFloat(rowObj['baseprice'] || rowObj['basePrice']) || 15000,
            rating: parseFloat(rowObj['rating']) || 4.9,
            reviewsCount: 1,
            location: rowObj['location'] || 'Nairobi',
            imageUrl: rowObj['imageurl'] || rowObj['imageUrl'] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
            specialties: rowObj['specialties'] ? rowObj['specialties'].split(',').map(s => s.trim()) : ['Custom Safaris'],
            isVerified: true,
            bookingLink: rowObj['bookinglink'] || rowObj['bookingLink'] || ''
          });
        }
      });

      setParsedImportItems(items);
      if (items.length === 0) {
        setImportError('No valid data rows found in CSV file.');
      }
    } catch (err: any) {
      setImportError('Failed to parse CSV file. Ensure formatting is valid CSV.');
      setParsedImportItems([]);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedImportItems.length === 0) return;
    
    setIsImporting(true);
    setImportError('');
    setImportSuccessMsg('');

    try {
      let successCount = 0;
      if (importTarget === 'places') {
        for (const item of parsedImportItems) {
          await placesService.create(item);
          successCount++;
        }
        setPlacesList(prev => [...parsedImportItems, ...prev]);
      } else if (importTarget === 'events') {
        for (const item of parsedImportItems) {
          await eventsService.create(item);
          successCount++;
        }
        setEventsList(prev => [...parsedImportItems, ...prev]);
      } else if (importTarget === 'operators') {
        for (const item of parsedImportItems) {
          await providersService.create(item);
          successCount++;
        }
        setOperatorsList(prev => [...parsedImportItems, ...prev]);
      }

      setImportSuccessMsg(`Successfully imported ${successCount} ${importTarget} into Cloud Firestore and Live Site!`);
      setParsedImportItems([]);
      setImportCsvText('');
      setImportFileName('');
    } catch (err: any) {
      console.error(err);
      setImportError('An error occurred during Firestore upload. Some items may have been imported.');
    } finally {
      setIsImporting(false);
    }
  };

  // Filtered lists
  const filteredPlaces = placesList.filter(p => {
    const matchesSearch = (p.name + p.location + p.description).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredEvents = eventsList.filter(e => {
    const matchesSearch = (e.title + e.location + e.description + e.providerName).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredOperators = operatorsList.filter(o => {
    const matchesSearch = (o.name + (o.location || '') + o.bio).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-navy text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-white/10 flex flex-col p-6 shrink-0 bg-navy">
        <div className="flex items-center justify-between md:justify-start mb-10">
          <div className="flex items-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1G9iYeJQ4q67zu7dBwjXm9BTz_boLAzco" 
              className="h-12 w-12 object-contain -ml-2 -mr-3 shrink-0" 
              alt="Logo" 
            />
            <div>
              <span className="font-serif font-bold text-lg block leading-none">Architect</span>
              <span className="text-[9px] uppercase font-black text-safari tracking-widest">Global Admin</span>
            </div>
          </div>
          <button 
            onClick={fetchAllData}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all md:hidden"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {[
            { id: 'overview', label: 'Command Hub', icon: <BarChart3 size={18} /> },
            { id: 'places', label: 'Destinations', icon: <Compass size={18} />, badge: placesList.length },
            { id: 'events', label: 'Experiences', icon: <Calendar size={18} />, badge: eventsList.length },
            { id: 'operators', label: 'Operators', icon: <Building2 size={18} />, badge: operatorsList.length },
            { id: 'approvals', label: 'Requests', icon: <Users size={18} />, badge: pendingApps.length },
            { id: 'config', label: 'Configuration', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center justify-between px-4 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 md:w-full ${activeTab === item.id ? 'bg-safari text-white shadow-xl' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-8 mt-auto border-t border-white/5 hidden md:block">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Firestore Sync</p>
            <button onClick={fetchAllData} className="text-white/40 hover:text-safari transition-colors" title="Sync Firestore">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-green-400 font-bold">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Cloud Firestore Live
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Header bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold capitalize">
              {activeTab === 'overview' && 'Command Hub'}
              {activeTab === 'places' && 'Establishments & Destinations'}
              {activeTab === 'events' && 'Events & Experiences'}
              {activeTab === 'operators' && 'Tour Operators & Guides'}
              {activeTab === 'approvals' && 'Partner Onboarding Queue'}
              {activeTab === 'config' && 'Data Import & System Configuration'}
            </h1>
            <p className="text-white/40 text-xs md:text-sm mt-1">Real-time synchronized with Firestore backend and live application.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {activeTab === 'places' && (
              <button 
                onClick={() => setCreatingItemType('place')}
                className="px-6 h-12 bg-safari hover:bg-safari-light text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl transition-all w-full sm:w-auto"
              >
                <Plus size={16} /> New Destination
              </button>
            )}
            {activeTab === 'events' && (
              <button 
                onClick={() => setCreatingItemType('event')}
                className="px-6 h-12 bg-safari hover:bg-safari-light text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl transition-all w-full sm:w-auto"
              >
                <Plus size={16} /> Register Event
              </button>
            )}
            {activeTab === 'operators' && (
              <button 
                onClick={() => setCreatingItemType('operator')}
                className="px-6 h-12 bg-safari hover:bg-safari-light text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl transition-all w-full sm:w-auto"
              >
                <Plus size={16} /> Register Operator
              </button>
            )}
            {activeTab === 'overview' && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setCreatingItemType('place')} className="px-4 h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all">
                  <Plus size={14} /> Place
                </button>
                <button onClick={() => setCreatingItemType('event')} className="px-4 h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all">
                  <Plus size={14} /> Event
                </button>
                <button onClick={() => setCreatingItemType('operator')} className="px-4 h-11 bg-safari hover:bg-safari-light text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all">
                  <Plus size={14} /> Partner
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Destinations', val: placesList.length, icon: <Compass className="text-safari" size={24} />, action: () => setActiveTab('places') },
                { label: 'Experiences', val: eventsList.length, icon: <Calendar className="text-safari" size={24} />, action: () => setActiveTab('events') },
                { label: 'Verified Operators', val: operatorsList.length, icon: <Building2 className="text-safari" size={24} />, action: () => setActiveTab('operators') },
                { label: 'Pending Applications', val: pendingApps.length, icon: <Users className="text-safari" size={24} />, action: () => setActiveTab('approvals') }
              ].map(stat => (
                <div key={stat.label} onClick={stat.action} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 hover:border-safari/50 hover:bg-white/10 cursor-pointer transition-all group">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                    {stat.icon}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-4xl font-serif font-bold text-white group-hover:text-safari transition-colors">{stat.val}</h4>
                    <span className="text-[10px] text-safari font-bold flex items-center gap-1">Manage <ChevronRight size={12} /></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Live Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-xl font-serif font-bold flex items-center gap-3">
                    <Sparkles className="text-safari" size={20} /> Live Data Direct Control
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-safari/20 text-safari px-3 py-1 rounded-full">Firestore Connected</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Every addition, edit, or approval performed inside this Architect Dashboard is committed straight to the Firestore cloud database (`places`, `events`, `providers`, `registrations`). Changes immediately reflect across the live website search engines and catalogues.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <button onClick={() => setCreatingItemType('place')} className="p-4 bg-white/5 border border-white/10 hover:border-safari rounded-2xl text-left space-y-2 transition-all">
                    <p className="font-bold text-sm text-white">+ Add Destination</p>
                    <p className="text-[10px] text-white/40">Register a restaurant, safari lodge, or hangout spot.</p>
                  </button>
                  <button onClick={() => setCreatingItemType('event')} className="p-4 bg-white/5 border border-white/10 hover:border-safari rounded-2xl text-left space-y-2 transition-all">
                    <p className="font-bold text-sm text-white">+ Add Experience</p>
                    <p className="text-[10px] text-white/40">Schedule climbing, wine tasting, or weekend trips.</p>
                  </button>
                  <button onClick={() => setCreatingItemType('operator')} className="p-4 bg-white/5 border border-white/10 hover:border-safari rounded-2xl text-left space-y-2 transition-all">
                    <p className="font-bold text-sm text-white">+ Add Partner</p>
                    <p className="text-[10px] text-white/40">Register verified tour guides and companies.</p>
                  </button>
                </div>
              </div>

              {/* System Stream */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-serif font-bold">System Status</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50">Primary Collection</span>
                    <span className="font-bold text-green-400">places</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50">Events Stream</span>
                    <span className="font-bold text-green-400">events</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50">Tour Operators</span>
                    <span className="font-bold text-green-400">providers</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50">Registrations Queue</span>
                    <span className="font-bold text-safari">{pendingApps.length} Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: PLACES / DESTINATIONS */}
        {activeTab === 'places' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Search & Category Filter bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 border border-white/10 p-4 rounded-3xl">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full pl-11 pr-4 h-11 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-white/30 outline-none focus:border-safari"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                {['ALL', ...Object.values(PlaceCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 h-9 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${filterCategory === cat ? 'bg-safari text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Places Grid/Table */}
            {filteredPlaces.length === 0 ? (
              <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <Compass className="mx-auto text-white/20" size={40} />
                <p className="text-white/40 text-sm">No destinations matching query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlaces.map(place => (
                  <div key={place.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:border-safari/50 transition-all">
                    <div className="relative h-48 overflow-hidden bg-white/5">
                      <img src={place.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947'} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="bg-navy/80 text-white font-black text-[8px] uppercase tracking-widest px-2.5 h-6 flex items-center rounded-full border border-white/10">
                          {place.category}
                        </span>
                        {place.isTrending && (
                          <span className="bg-safari text-white font-black text-[8px] uppercase tracking-widest px-2.5 h-6 flex items-center rounded-full shadow-md">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif font-bold text-lg text-white leading-snug">{place.name}</h3>
                          <span className="text-safari font-bold text-sm whitespace-nowrap">Ksh {place.price?.toLocaleString()}</span>
                        </div>
                        <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">{place.description}</p>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <MapPin size={11} className="text-safari" /> {place.location}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleToggleTrending(place)}
                            className={`px-3 h-8 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${place.isTrending ? 'bg-safari/20 text-safari border border-safari/40' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                          >
                            {place.isTrending ? 'Trending' : '+ Trend'}
                          </button>
                          <button 
                            onClick={() => handleToggleVerifiedPlace(place)}
                            className={`px-3 h-8 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${place.isVerified ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                          >
                            {place.isVerified ? 'Verified' : 'Verify'}
                          </button>
                        </div>

                        <div className="flex gap-1">
                          <button 
                            onClick={() => setEditingItem({ type: 'place', data: { ...place } })}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeletePlace(place.id)}
                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete"
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

        {/* Tab 3: EVENTS / EXPERIENCES */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events & experiences..."
                  className="w-full pl-11 pr-4 h-11 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-white/30 outline-none focus:border-safari"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(ev => (
                <div key={ev.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-safari/50 transition-all">
                  <div className="relative h-44 bg-white/5 overflow-hidden">
                    <img src={ev.imageUrl || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3'} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-safari text-white text-[8px] font-black uppercase tracking-widest px-2.5 h-6 flex items-center rounded-full shadow-md">
                      {ev.category?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif font-bold text-lg text-white leading-snug">{ev.title}</h3>
                        <span className="text-safari font-bold text-sm whitespace-nowrap">Ksh {ev.price?.toLocaleString()}</span>
                      </div>
                      <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">{ev.description}</p>
                      <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold pt-1">
                        <span className="flex items-center gap-1 text-safari"><Calendar size={12} /> {new Date(ev.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{ev.providerName || 'Curated'}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEditingItem({ type: 'event', data: { ...ev } })}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 4: TOUR OPERATORS */}
        {activeTab === 'operators' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search operators & guides..."
                  className="w-full pl-11 pr-4 h-11 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-white/30 outline-none focus:border-safari"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOperators.map(op => (
                <div key={op.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-safari/50 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={op.imageUrl || 'https://images.unsplash.com/photo-1549417229-aa67d3263c09'} alt={op.name} className="w-14 h-14 object-cover rounded-2xl border border-white/10 shrink-0" />
                      <div>
                        <h3 className="font-serif font-bold text-lg text-white">{op.name}</h3>
                        <p className="text-safari text-xs font-bold">{op.title || op.type}</p>
                      </div>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{op.bio}</p>
                    {op.specialties && (
                      <div className="flex flex-wrap gap-1.5">
                        {op.specialties.map(spec => (
                          <span key={spec} className="px-2.5 py-1 bg-white/5 text-white/60 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase font-black text-white/20">Base Rate</p>
                      <p className="text-white font-bold text-xs">Ksh {op.basePrice?.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleVerifiedOperator(op)}
                        className={`px-2.5 h-8 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${op.isVerified ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/5 text-white/40'}`}
                      >
                        {op.isVerified ? 'Verified' : '+ Verify'}
                      </button>
                      <button 
                        onClick={() => setEditingItem({ type: 'operator', data: { ...op } })}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteOperator(op.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 5: REQUESTS / APPROVALS */}
        {activeTab === 'approvals' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Top Toolbar for Bulk Actions */}
            {pendingApps.length > 0 && (
              <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleSelectAllApps} 
                    className="flex items-center gap-2.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={pendingApps.length > 0 && selectedAppIds.length === pendingApps.length} 
                      onChange={toggleSelectAllApps}
                      className="w-4 h-4 accent-safari cursor-pointer rounded"
                    />
                    <span>Select All ({pendingApps.length})</span>
                  </button>
                  
                  {selectedAppIds.length > 0 && (
                    <span className="text-xs text-safari font-bold bg-safari/10 px-3.5 py-2 rounded-xl border border-safari/20">
                      {selectedAppIds.length} Selected
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {selectedAppIds.length > 0 ? (
                    <>
                      <button 
                        onClick={() => triggerBulkReject(pendingApps.filter(a => selectedAppIds.includes(a.id)))}
                        className="px-4 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <XCircle size={16} /> Reject Selected ({selectedAppIds.length})
                      </button>
                      <button 
                        onClick={() => triggerBulkApprove(pendingApps.filter(a => selectedAppIds.includes(a.id)))}
                        className="px-5 h-11 bg-safari hover:bg-safari-light text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Approve Selected ({selectedAppIds.length})
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => triggerBulkReject(pendingApps)}
                        className="px-4 h-11 bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <XCircle size={16} /> Reject All ({pendingApps.length})
                      </button>
                      <button 
                        onClick={() => triggerBulkApprove(pendingApps)}
                        className="px-5 h-11 bg-safari hover:bg-safari-light text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Approve All ({pendingApps.length})
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {pendingApps.length === 0 ? (
              <div className="py-24 text-center bg-white/5 rounded-3xl border border-white/5 space-y-4">
                <ShieldCheck className="mx-auto text-white/20" size={48} />
                <p className="text-lg font-serif font-bold">Queue Resolved</p>
                <p className="text-white/40 text-xs">No pending partner onboarding requests at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingApps.map(app => {
                  const isSelected = selectedAppIds.includes(app.id);
                  return (
                    <div 
                      key={app.id} 
                      className={`bg-white/5 border p-8 rounded-3xl flex flex-col md:flex-row justify-between gap-8 transition-all ${
                        isSelected ? 'border-safari bg-safari/10 shadow-lg' : 'border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectApp(app.id)}
                            className="w-4 h-4 accent-safari cursor-pointer rounded"
                          />
                          <span className="px-3 h-6 bg-safari/20 text-safari text-[10px] font-black uppercase tracking-widest rounded-md flex items-center justify-center">
                            {app.type}
                          </span>
                          <span className="text-[10px] text-white/30 font-bold">Submitted Recently</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-serif font-bold">{app.businessName || app.name}</h3>
                          <p className="text-white/50 text-xs mt-1 leading-relaxed max-w-2xl">{app.description || app.bio}</p>
                        </div>
                        <div className="flex flex-wrap gap-8 pt-2 text-xs">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Contact</p>
                            <p className="font-bold">{app.email} • {app.phone}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Base Price</p>
                            <p className="font-bold">Ksh {app.basePrice?.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Attached Verification Docs */}
                        {app.documents?.attachedFiles && app.documents.attachedFiles.length > 0 && (
                          <div className="pt-3 border-t border-white/5 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
                              <Paperclip size={12} className="text-safari" /> Credentials & Licences ({app.documents.attachedFiles.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {app.documents.attachedFiles.map((file, idx) => (
                                <a key={file.id || idx} href={file.dataUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white/5 hover:bg-safari hover:text-white border border-white/10 rounded-xl text-xs flex items-center gap-2 transition-all">
                                  {file.type?.includes('pdf') ? <FileText size={14} className="text-red-400" /> : <Eye size={14} className="text-safari" />}
                                  <span className="truncate max-w-[140px]">{file.name}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => triggerBulkReject([app])} 
                          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
                          title="Reject Application"
                        >
                          <XCircle size={22} />
                        </button>
                        <button 
                          onClick={() => triggerBulkApprove([app])} 
                          className="h-12 px-6 rounded-2xl bg-safari hover:bg-safari-light text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-xl cursor-pointer"
                          title="Verify & Publish"
                        >
                          Verify & Publish <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 6: CONFIGURATION, APP ASSETS & BULK DATA IMPORT */}
        {activeTab === 'config' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* ---------------- SECTION 1: SITE ASSETS & BRANDING MANAGER ---------------- */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-safari text-white rounded-2xl shadow-lg">
                    <Image size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white">App Assets & Visual Media Manager</h2>
                    <p className="text-white/60 text-xs mt-0.5">Customize main app background images, hero titles, subtext, and search placeholders across the platform.</p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleSaveSiteSettings}
                  disabled={isSavingSettings}
                  className="px-6 h-12 bg-safari hover:bg-safari-light text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSavingSettings ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{isSavingSettings ? 'Saving...' : 'Save Site Assets'}</span>
                </button>
              </div>

              {saveSettingsMsg && (
                <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 border ${
                  saveSettingsMsg.includes('Failed') || saveSettingsMsg.includes('Error') 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>{saveSettingsMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSiteSettings} className="space-y-8 text-xs">
                {/* HERO ASSETS BLOCK */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-safari font-black uppercase tracking-widest text-[10px]">
                    <Layout size={14} /> 1. Hero Landing Banner & Search Assets
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Main Heading Base Text</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.heroTitle} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, heroTitle: e.target.value }))} 
                        placeholder="e.g. Experience the" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Highlighted Safari Word</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.heroTitleHighlight} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, heroTitleHighlight: e.target.value }))} 
                        placeholder="e.g. Majesty" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white font-bold" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Hero Subtitle Text</label>
                    <textarea 
                      rows={2} 
                      value={siteSettingsForm.heroSubtitle} 
                      onChange={e => setSiteSettingsForm(p => ({ ...p, heroSubtitle: e.target.value }))} 
                      placeholder="A curated collective of the most authentic destinations..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-safari text-white" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Hero Background Image URL</label>
                      <input 
                        type="url" 
                        value={siteSettingsForm.heroBgImage} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, heroBgImage: e.target.value }))} 
                        placeholder="https://images.unsplash.com/..." 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Search Bar Placeholder</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.heroSearchPlaceholder} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, heroSearchPlaceholder: e.target.value }))} 
                        placeholder="Where will your spirit wander?" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  {siteSettingsForm.heroBgImage && (
                    <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 mt-2">
                      <img src={siteSettingsForm.heroBgImage} alt="Hero Background" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/20">
                          Hero Background Preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* EXPERIENCES & EVENTS HEADER ASSETS BLOCK */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-safari font-black uppercase tracking-widest text-[10px]">
                    <Calendar size={14} /> 2. Experiences & Events Header Assets
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Section Title</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.eventsTitle} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, eventsTitle: e.target.value }))} 
                        placeholder="Ways to Experience Kenya" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Events Background Image URL</label>
                      <input 
                        type="url" 
                        value={siteSettingsForm.eventsBgImage} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, eventsBgImage: e.target.value }))} 
                        placeholder="https://images.unsplash.com/..." 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Events Section Subtitle</label>
                    <textarea 
                      rows={2} 
                      value={siteSettingsForm.eventsSubtitle} 
                      onChange={e => setSiteSettingsForm(p => ({ ...p, eventsSubtitle: e.target.value }))} 
                      placeholder="A sequence of scheduled prestige events..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-safari text-white" 
                    />
                  </div>
                </div>

                {/* PARTNER / MERCHANT STRIP ASSETS BLOCK */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-safari font-black uppercase tracking-widest text-[10px]">
                    <Building2 size={14} /> 3. Partner Enrollment Strip & Merchant Banner Assets
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Banner Heading</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.partnerTitle} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, partnerTitle: e.target.value }))} 
                        placeholder="Own a business in Kenya?" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Partner Background Overlay URL</label>
                      <input 
                        type="url" 
                        value={siteSettingsForm.partnerBgImage} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, partnerBgImage: e.target.value }))} 
                        placeholder="https://images.unsplash.com/..." 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Banner Subtitle</label>
                    <input 
                      type="text" 
                      value={siteSettingsForm.partnerSubtitle} 
                      onChange={e => setSiteSettingsForm(p => ({ ...p, partnerSubtitle: e.target.value }))} 
                      placeholder="Join our elite collective." 
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                    />
                  </div>
                </div>

                {/* GLOBAL BRANDING & APP METADATA BLOCK */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-safari font-black uppercase tracking-widest text-[10px]">
                    <Settings size={14} /> 4. App Branding & Contact Details
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Platform Name</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.siteName} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, siteName: e.target.value }))} 
                        placeholder="PlacesInKenya" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Tagline</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.siteTagline} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, siteTagline: e.target.value }))} 
                        placeholder="Curated Discovery Platform" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Contact Email</label>
                      <input 
                        type="email" 
                        value={siteSettingsForm.contactEmail} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, contactEmail: e.target.value }))} 
                        placeholder="concierge@placesinkenya.com" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={siteSettingsForm.contactPhone} 
                        onChange={e => setSiteSettingsForm(p => ({ ...p, contactPhone: e.target.value }))} 
                        placeholder="+254 700 000 000" 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-8 h-12 bg-safari hover:bg-safari-light text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
                  >
                    {isSavingSettings ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{isSavingSettings ? 'Publishing Changes...' : 'Publish Site Assets & Branding'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ---------------- SECTION 2: BULK DATA IMPORT ---------------- */}
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-safari/20 via-white/5 to-white/5 border border-safari/30 p-8 rounded-3xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-safari text-white rounded-2xl">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Bulk Data Import & System Configuration</h2>
                  <p className="text-white/60 text-xs mt-0.5">Bulk populate Destinations, Experiences, or Tour Operators directly into Cloud Firestore using CSV templates.</p>
                </div>
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: STEP 1 - Download Templates */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-safari/20 text-safari font-black text-xs flex items-center justify-center">1</div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Download CSV Templates</h3>
                    <p className="text-white/40 text-[11px]">Get pre-formatted headers for bulk upload.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => downloadCsvTemplate('places')} 
                    className="w-full p-4 bg-white/5 hover:bg-safari/20 border border-white/10 hover:border-safari/40 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-safari group-hover:scale-110 transition-transform" size={20} />
                      <div>
                        <p className="text-xs font-bold text-white">Destinations Template</p>
                        <p className="text-[10px] text-white/40">Places, Lodges, Parks (.csv)</p>
                      </div>
                    </div>
                    <Download size={16} className="text-white/40 group-hover:text-safari" />
                  </button>

                  <button 
                    onClick={() => downloadCsvTemplate('events')} 
                    className="w-full p-4 bg-white/5 hover:bg-safari/20 border border-white/10 hover:border-safari/40 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-safari group-hover:scale-110 transition-transform" size={20} />
                      <div>
                        <p className="text-xs font-bold text-white">Experiences Template</p>
                        <p className="text-[10px] text-white/40">Events, Tours, Festivals (.csv)</p>
                      </div>
                    </div>
                    <Download size={16} className="text-white/40 group-hover:text-safari" />
                  </button>

                  <button 
                    onClick={() => downloadCsvTemplate('operators')} 
                    className="w-full p-4 bg-white/5 hover:bg-safari/20 border border-white/10 hover:border-safari/40 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-safari group-hover:scale-110 transition-transform" size={20} />
                      <div>
                        <p className="text-xs font-bold text-white">Tour Operators Template</p>
                        <p className="text-[10px] text-white/40">Agencies, Guides, Companies (.csv)</p>
                      </div>
                    </div>
                    <Download size={16} className="text-white/40 group-hover:text-safari" />
                  </button>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-[11px] text-white/50 leading-relaxed space-y-2">
                  <p className="font-bold text-white/80">Header Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Required headers are automatically included in template downloads.</li>
                    <li>Wrap fields containing commas with quotes.</li>
                    <li>Comma-separate multiple tags or specialties.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: STEP 2 & 3 - Upload File & Parse Preview */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-safari/20 text-safari font-black text-xs flex items-center justify-center">2</div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Select Target & Upload CSV File</h3>
                    <p className="text-white/40 text-[11px]">Choose entity category and upload your spreadsheet.</p>
                  </div>
                </div>

                {/* Target Entity Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block">Target Collection</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'places', label: 'Destinations', icon: <Compass size={16} /> },
                      { id: 'events', label: 'Experiences', icon: <Calendar size={16} /> },
                      { id: 'operators', label: 'Operators', icon: <Building2 size={16} /> }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setImportTarget(t.id as any);
                          if (importCsvText) {
                            parseAndSetImportData(importCsvText, t.id as any);
                          }
                        }}
                        className={`h-12 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          importTarget === t.id 
                            ? 'bg-safari text-white border-safari shadow-lg' 
                            : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {t.icon}
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Box */}
                <div className="relative border-2 border-dashed border-white/20 hover:border-safari/60 bg-white/5 hover:bg-white/10 rounded-3xl p-8 text-center transition-all group">
                  <input 
                    type="file" 
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-3 pointer-events-none">
                    <div className="w-14 h-14 rounded-2xl bg-safari/20 text-safari flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {importFileName ? importFileName : 'Click or Drag & Drop CSV / Excel File'}
                      </p>
                      <p className="text-xs text-white/40 mt-1">Supports UTF-8 CSV spreadsheets</p>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {importError && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-xs flex items-center gap-3">
                    <AlertTriangle size={18} className="shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                {importSuccessMsg && (
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl text-green-400 text-xs flex items-center gap-3">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{importSuccessMsg}</span>
                  </div>
                )}

                {/* Parsed Preview Table */}
                {parsedImportItems.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">Preview Parsed Items ({parsedImportItems.length})</h4>
                        <p className="text-white/40 text-[11px]">Review parsed records before executing Firestore bulk upload.</p>
                      </div>
                      <button
                        onClick={handleExecuteImport}
                        disabled={isImporting}
                        className="px-6 h-12 bg-safari hover:bg-safari-light text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
                      >
                        {isImporting ? <RefreshCw size={16} className="animate-spin" /> : <Database size={16} />}
                        <span>{isImporting ? 'Uploading to Firestore...' : `Import ${parsedImportItems.length} Items`}</span>
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto border border-white/10 rounded-2xl bg-black/20">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 sticky top-0 backdrop-blur-md">
                          <tr>
                            <th className="p-3 border-b border-white/10">#</th>
                            <th className="p-3 border-b border-white/10">Name / Title</th>
                            <th className="p-3 border-b border-white/10">Category / Type</th>
                            <th className="p-3 border-b border-white/10">Location</th>
                            <th className="p-3 border-b border-white/10">Price (Ksh)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/80">
                          {parsedImportItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-mono text-white/40">{idx + 1}</td>
                              <td className="p-3 font-bold">{item.name || item.title}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 bg-safari/20 text-safari rounded text-[10px] font-bold">
                                  {item.category || item.type}
                                </span>
                              </td>
                              <td className="p-3">{item.location}</td>
                              <td className="p-3 font-mono font-bold">Ksh {(item.price || item.basePrice)?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MODAL 1: CREATE NEW ENTITY */}
        <AnimatePresence>
          {creatingItemType && (
            <div className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#132238] border border-white/10 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 my-8">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-serif font-bold">
                    Create New {creatingItemType === 'place' && 'Destination'}
                    {creatingItemType === 'event' && 'Experience'}
                    {creatingItemType === 'operator' && 'Tour Operator'}
                  </h2>
                  <button onClick={() => setCreatingItemType(null)} className="p-2 text-white/40 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* FORM FOR PLACE */}
                {creatingItemType === 'place' && (
                  <form onSubmit={handleCreatePlace} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Establishment Name</label>
                      <input required type="text" value={placeForm.name} onChange={e => setPlaceForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mara Intrepid Lodge" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Category</label>
                        <select value={placeForm.category} onChange={e => setPlaceForm(p => ({ ...p, category: e.target.value as any }))} className="w-full h-11 bg-navy border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white">
                          {Object.values(PlaceCategory).map(cat => (
                            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Location</label>
                        <input required type="text" value={placeForm.location} onChange={e => setPlaceForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Westlands, Nairobi" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Price (Ksh)</label>
                        <input type="number" value={placeForm.price} onChange={e => setPlaceForm(p => ({ ...p, price: Number(e.target.value) }))} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Rating (1-5)</label>
                        <input type="number" step="0.1" max="5" value={placeForm.rating} onChange={e => setPlaceForm(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Image URL</label>
                      <input type="url" value={placeForm.imageUrl} onChange={e => setPlaceForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://images.unsplash.com/..." className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Booking / WhatsApp Link</label>
                      <input type="text" value={placeForm.bookingLink} onChange={e => setPlaceForm(p => ({ ...p, bookingLink: e.target.value }))} placeholder="https://wa.me/2547..." className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Description</label>
                      <textarea rows={3} value={placeForm.description} onChange={e => setPlaceForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={placeForm.isTrending} onChange={e => setPlaceForm(p => ({ ...p, isTrending: e.target.checked }))} className="accent-safari" />
                        <span className="text-[10px] uppercase font-bold text-white/60">Set as Trending</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={placeForm.isVerified} onChange={e => setPlaceForm(p => ({ ...p, isVerified: e.target.checked }))} className="accent-safari" />
                        <span className="text-[10px] uppercase font-bold text-white/60">Verified Partner</span>
                      </label>
                    </div>
                    <button type="submit" disabled={syncing} className="w-full h-12 bg-safari text-white font-bold uppercase tracking-widest rounded-xl hover:bg-safari-light transition-all">
                      {syncing ? 'Publishing...' : 'Publish Destination'}
                    </button>
                  </form>
                )}

                {/* FORM FOR EVENT */}
                {creatingItemType === 'event' && (
                  <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Event Title</label>
                      <input required type="text" value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Great Rift Sunset Festival" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Date</label>
                        <input type="date" value={eventForm.date} onChange={e => setEventForm(p => ({ ...p, date: e.target.value }))} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Location</label>
                        <input required type="text" value={eventForm.location} onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))} placeholder="Naivasha" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Ticket Price (Ksh)</label>
                        <input type="number" value={eventForm.price} onChange={e => setEventForm(p => ({ ...p, price: Number(e.target.value) }))} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Organizer / Provider</label>
                        <input type="text" value={eventForm.providerName} onChange={e => setEventForm(p => ({ ...p, providerName: e.target.value }))} placeholder="Safari Kings Ltd" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Image Poster URL</label>
                      <input type="url" value={eventForm.imageUrl} onChange={e => setEventForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Booking Link</label>
                      <input type="text" value={eventForm.bookingLink} onChange={e => setEventForm(p => ({ ...p, bookingLink: e.target.value }))} placeholder="https://wa.me/254..." className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Description</label>
                      <textarea rows={3} value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-safari text-white" />
                    </div>
                    <button type="submit" disabled={syncing} className="w-full h-12 bg-safari text-white font-bold uppercase tracking-widest rounded-xl hover:bg-safari-light transition-all">
                      {syncing ? 'Publishing...' : 'Register Experience'}
                    </button>
                  </form>
                )}

                {/* FORM FOR OPERATOR */}
                {creatingItemType === 'operator' && (
                  <form onSubmit={handleCreateOperator} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Partner / Operator Name</label>
                      <input required type="text" value={operatorForm.name} onChange={e => setOperatorForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Serengeti Experts Ltd" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Type</label>
                        <select value={operatorForm.type} onChange={e => setOperatorForm(p => ({ ...p, type: e.target.value as any }))} className="w-full h-11 bg-navy border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white">
                          <option value={OperatorType.COMPANY}>Company</option>
                          <option value={OperatorType.INDIVIDUAL}>Individual Guide</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Title / License</label>
                        <input type="text" value={operatorForm.title} onChange={e => setOperatorForm(p => ({ ...p, title: e.target.value }))} placeholder="Silver KPSGA Guide" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Base Price (Ksh)</label>
                        <input type="number" value={operatorForm.basePrice} onChange={e => setOperatorForm(p => ({ ...p, basePrice: Number(e.target.value) }))} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Location</label>
                        <input type="text" value={operatorForm.location} onChange={e => setOperatorForm(p => ({ ...p, location: e.target.value }))} placeholder="Nairobi" className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Avatar / Logo URL</label>
                      <input type="url" value={operatorForm.imageUrl} onChange={e => setOperatorForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Booking / Contact Link</label>
                      <input type="text" value={operatorForm.bookingLink} onChange={e => setOperatorForm(p => ({ ...p, bookingLink: e.target.value }))} placeholder="https://wa.me/254..." className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Bio / Overview</label>
                      <textarea rows={3} value={operatorForm.bio} onChange={e => setOperatorForm(p => ({ ...p, bio: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-safari text-white" />
                    </div>
                    <button type="submit" disabled={syncing} className="w-full h-12 bg-safari text-white font-bold uppercase tracking-widest rounded-xl hover:bg-safari-light transition-all">
                      {syncing ? 'Publishing...' : 'Register Operator'}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: EDIT EXISTING ITEM */}
        <AnimatePresence>
          {editingItem && (
            <div className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#132238] border border-white/10 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 my-8">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-serif font-bold">Edit {editingItem.type.toUpperCase()}</h2>
                  <button onClick={() => setEditingItem(null)} className="p-2 text-white/40 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Title / Name</label>
                    <input 
                      type="text" 
                      value={editingItem.data.name || editingItem.data.title || ''} 
                      onChange={e => setEditingItem(prev => prev ? ({ ...prev, data: { ...prev.data, name: e.target.value, title: e.target.value } }) : null)} 
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Location</label>
                      <input 
                        type="text" 
                        value={editingItem.data.location || ''} 
                        onChange={e => setEditingItem(prev => prev ? ({ ...prev, data: { ...prev.data, location: e.target.value } }) : null)} 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Price (Ksh)</label>
                      <input 
                        type="number" 
                        value={editingItem.data.price || editingItem.data.basePrice || 0} 
                        onChange={e => setEditingItem(prev => prev ? ({ ...prev, data: { ...prev.data, price: Number(e.target.value), basePrice: Number(e.target.value) } }) : null)} 
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Image URL</label>
                    <input 
                      type="url" 
                      value={editingItem.data.imageUrl || ''} 
                      onChange={e => setEditingItem(prev => prev ? ({ ...prev, data: { ...prev.data, imageUrl: e.target.value } }) : null)} 
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Booking / WhatsApp Link</label>
                    <input 
                      type="text" 
                      value={editingItem.data.bookingLink || ''} 
                      onChange={e => setEditingItem(prev => prev ? ({ ...prev, data: { ...prev.data, bookingLink: e.target.value } }) : null)} 
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-safari text-white" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Description / Bio</label>
                    <textarea 
                      rows={3} 
                      value={editingItem.data.description || editingItem.data.bio || ''} 
                      onChange={e => setEditingItem(prev => prev ? ({ ...prev, data: { ...prev.data, description: e.target.value, bio: e.target.value } }) : null)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-safari text-white" 
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button onClick={() => setEditingItem(null)} className="px-5 h-11 bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider">Cancel</button>
                    <button onClick={handleSaveEdit} disabled={syncing} className="px-6 h-11 bg-safari text-white rounded-xl font-bold uppercase tracking-wider hover:bg-safari-light">
                      {syncing ? 'Saving...' : 'Save & Publish'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 3: BULK ACTION & DELETION CONFIRMATION DIALOG */}
        <AnimatePresence>
          {confirmModal && confirmModal.isOpen && (
            <div className="fixed inset-0 z-[300] bg-navy/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                className="bg-[#132238] border border-white/15 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-white"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3.5 rounded-2xl shrink-0 ${
                    confirmModal.variant === 'danger' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    confirmModal.variant === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-safari/20 text-safari border border-safari/30'
                  }`}>
                    {confirmModal.variant === 'danger' ? <AlertTriangle size={28} /> :
                     confirmModal.variant === 'warning' ? <AlertTriangle size={28} /> :
                     <CheckCircle2 size={28} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">{confirmModal.title}</h3>
                    <p className="text-white/60 text-xs mt-1.5 leading-relaxed">{confirmModal.description}</p>
                  </div>
                </div>

                {confirmModal.itemNames && confirmModal.itemNames.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 max-h-36 overflow-y-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      Affected Items ({confirmModal.itemNames.length})
                    </p>
                    <ul className="space-y-1 text-xs text-white/80 font-medium">
                      {confirmModal.itemNames.map((name, i) => (
                        <li key={i} className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-safari shrink-0"></span>
                          <span className="truncate">{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                  <button 
                    type="button"
                    disabled={syncing}
                    onClick={() => setConfirmModal(null)}
                    className="px-5 h-11 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    disabled={syncing}
                    onClick={confirmModal.onConfirm}
                    className={`px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-xl flex items-center gap-2 cursor-pointer ${
                      confirmModal.variant === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                      confirmModal.variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                      'bg-safari hover:bg-safari-light'
                    }`}
                  >
                    {syncing && <RefreshCw size={14} className="animate-spin" />}
                    {syncing ? 'Processing...' : confirmModal.actionText}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
