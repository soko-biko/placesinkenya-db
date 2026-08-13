import React, { useState } from 'react';
import { Place } from '../types';
import { MediaPicker } from './MediaPicker';
import { Image as ImageIcon, MapPin, Tag, DollarSign, Star, Check, X, Loader2 } from 'lucide-react';

interface PlaceEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (placeData: Partial<Place>) => Promise<void>;
  initialData?: Place | null;
}

const CATEGORIES = [
  'RESTAURANT',
  'ENTERTAINMENT',
  'HANGOUT_SPOTS',
  'OUTDOORS',
  'SAFARI',
  'ADVENTURES',
  'HOTEL',
  'EXPERIENCE',
  'SHOPPING'
];

export const PlaceEditor: React.FC<PlaceEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<Place>>({
    name: initialData?.name || '',
    category: initialData?.category || 'OUTDOORS',
    location: initialData?.location || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    price: initialData?.price || 0,
    rating: initialData?.rating || 4.5,
    isTrending: initialData?.isTrending || false,
    isVerified: initialData?.isVerified ?? true,
    status: initialData?.status || 'PUBLISHED',
    tags: initialData?.tags || []
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().toLowerCase();
    if (!formData.tags?.includes(cleanTag)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), cleanTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.location) {
      alert('Please fill out all required fields (Name, Category, Location).');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save place.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-navy/10">
        {/* Header */}
        <div className="p-6 border-b border-navy/10 flex items-center justify-between bg-cream/30">
          <h3 className="font-serif font-bold text-2xl text-navy">
            {initialData?.id ? 'Edit Catalogue Item' : 'New Catalogue Item'}
          </h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 bg-off-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
                Place Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maasai Mara Safari Lodge"
                className="w-full px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category || 'OUTDOORS'}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-navy/30" size={16} />
                <input 
                  type="text"
                  required
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Narok County, Kenya"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>
            </div>

            {/* Starting Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
                Starting Price (KES)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3.5 text-navy/30" size={16} />
                <input 
                  type="number"
                  min={0}
                  value={formData.price || 0}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="e.g. 15000"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
                Rating (1.0 - 5.0)
              </label>
              <div className="relative">
                <Star className="absolute left-3.5 top-3.5 text-navy/30" size={16} />
                <input 
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating || 4.5}
                  onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
                Publishing Status
              </label>
              <select
                value={formData.status || 'PUBLISHED'}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
              Description
            </label>
            <textarea 
              rows={4}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a compelling overview of this destination..."
              className="w-full px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
            />
          </div>

          {/* Image Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
              Featured Image URL
            </label>
            <div className="flex gap-3">
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
                className="px-5 py-3 bg-navy text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-navy/90 transition-colors shadow shrink-0"
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

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy/70">
              Tags
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-3.5 text-navy/30" size={16} />
                <input 
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Add tag and press Enter"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-5 py-3 bg-navy/10 text-navy rounded-xl text-xs font-bold hover:bg-navy/20 transition-colors"
              >
                Add Tag
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-safari/10 text-safari rounded-full text-xs font-bold flex items-center gap-2">
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.isTrending || false}
                onChange={e => setFormData({ ...formData, isTrending: e.target.checked })}
                className="w-5 h-5 accent-safari rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-navy uppercase tracking-wider">Feature in Trending</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.isVerified ?? true}
                onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-5 h-5 accent-safari rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-navy uppercase tracking-wider">Verified Listing</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-navy/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-12 border border-navy/10 rounded-xl text-xs font-bold text-navy hover:bg-navy/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 h-12 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-safari-hover transition-colors shadow-lg shadow-safari/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              <span>{saving ? 'Saving...' : 'Save Item'}</span>
            </button>
          </div>
        </form>
      </div>

      <MediaPicker 
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
      />
    </div>
  );
};
