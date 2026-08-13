import React, { useState } from 'react';
import { Event } from '../types';
import { MediaPicker } from './MediaPicker';
import { Image as ImageIcon, Calendar, MapPin, Check, X, Loader2 } from 'lucide-react';

interface EventEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Event>) => Promise<void>;
  initialData?: Event | null;
}

export const EventEditor: React.FC<EventEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: initialData?.title || '',
    category: initialData?.category || 'CULTURE',
    description: initialData?.description || '',
    location: initialData?.location || 'Nairobi, Kenya',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || '',
    providerName: initialData?.providerName || 'Places in Kenya Official',
    status: initialData?.status || 'PUBLISHED',
    bookingLink: initialData?.bookingLink || ''
  });

  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      alert('Event Title and Date are required.');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-navy/10">
        <div className="p-6 border-b border-navy/10 flex items-center justify-between bg-cream/30">
          <h3 className="font-serif font-bold text-2xl text-navy">
            {initialData?.id ? 'Edit Event' : 'New Event / Experience'}
          </h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 bg-off-white">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Event Title *</label>
              <input 
                type="text"
                required
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                placeholder="e.g. Kenya International Jazz Safari 2026"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Date *</label>
                <input 
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Category</label>
                <input 
                  type="text"
                  value={formData.category || ''}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                  placeholder="e.g. FESTIVAL, SAFARI, CONCERT"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Location</label>
                <input 
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                  placeholder="e.g. Carnivore Grounds, Nairobi"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Ticket Price (KES)</label>
                <input 
                  type="number"
                  value={formData.price || 0}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Organizer / Host</label>
                <input 
                  type="text"
                  value={formData.providerName || ''}
                  onChange={e => setFormData({ ...formData, providerName: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Status</label>
                <select 
                  value={formData.status || 'PUBLISHED'} 
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Description</label>
              <textarea 
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Event Poster Image URL</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
                <button 
                  type="button" 
                  onClick={() => setMediaPickerOpen(true)}
                  className="px-4 py-3 bg-navy text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 hover:bg-navy/90 transition-colors shadow"
                >
                  <ImageIcon size={16} /> Choose from Media Library
                </button>
              </div>
              {formData.imageUrl && (
                <div className="mt-3 aspect-video w-full max-w-sm rounded-2xl overflow-hidden border border-navy/10 shadow-sm relative bg-navy/5">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-navy/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 h-12 border border-navy/10 rounded-xl text-xs font-bold text-navy">Cancel</button>
            <button type="submit" disabled={saving} className="px-8 h-12 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Event
            </button>
          </div>
        </form>
      </div>

      <MediaPicker isOpen={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} onSelect={url => setFormData(p => ({ ...p, imageUrl: url }))} />
    </div>
  );
};
