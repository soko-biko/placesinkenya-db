import React, { useState } from 'react';
import { TourOperator } from '../types';
import { MediaPicker } from './MediaPicker';
import { Image as ImageIcon, Building2, Mail, Phone, Check, X, Loader2 } from 'lucide-react';

interface OperatorEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TourOperator>) => Promise<void>;
  initialData?: TourOperator | null;
}

export const OperatorEditor: React.FC<OperatorEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<TourOperator>>({
    name: initialData?.name || '',
    type: initialData?.type || 'COMPANY',
    bio: initialData?.bio || '',
    basePrice: initialData?.basePrice || 15000,
    imageUrl: initialData?.imageUrl || '',
    verified: initialData?.verified ?? true,
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });

  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Name is required.');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save tour operator.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-navy/10">
        <div className="p-6 border-b border-navy/10 flex items-center justify-between bg-cream/30">
          <h3 className="font-serif font-bold text-2xl text-navy">
            {initialData?.id ? 'Edit Tour Operator' : 'New Tour Operator'}
          </h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 bg-off-white">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Company / Operator Name *</label>
              <input 
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                placeholder="e.g. Great Rift Safaris"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Type</label>
                <select 
                  value={formData.type || 'COMPANY'} 
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                >
                  <option value="COMPANY">Company / Agency</option>
                  <option value="INDIVIDUAL">Independent Specialist</option>
                  <option value="RESTAURANT">Hospitality Partner</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Base Starting Rate (KES)</label>
                <input 
                  type="number"
                  value={formData.basePrice || 15000}
                  onChange={e => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Email Address</label>
                <input 
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                  placeholder="contact@operator.co.ke"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Phone Number</label>
                <input 
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                  placeholder="+254 700 000 000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Bio / Description</label>
              <textarea 
                rows={3}
                value={formData.bio || ''}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Logo / Showcase Image URL</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                  placeholder="https://..."
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

            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.verified ?? true} 
                onChange={e => setFormData({ ...formData, verified: e.target.checked })} 
                className="w-5 h-5 accent-safari"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-navy">Verified Operator</span>
            </label>
          </div>

          <div className="pt-6 border-t border-navy/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 h-12 border border-navy/10 rounded-xl text-xs font-bold text-navy">Cancel</button>
            <button type="submit" disabled={saving} className="px-8 h-12 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Operator
            </button>
          </div>
        </form>
      </div>

      <MediaPicker isOpen={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} onSelect={url => setFormData(p => ({ ...p, imageUrl: url }))} />
    </div>
  );
};
