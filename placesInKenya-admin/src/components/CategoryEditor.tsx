import React, { useState } from 'react';
import { Category } from '../types';
import { MediaPicker } from './MediaPicker';
import { Image as ImageIcon, Layers, Check, X, Loader2 } from 'lucide-react';

interface CategoryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<void>;
  initialData?: Category | null;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    displayOrder: initialData?.displayOrder || 1,
    isActive: initialData?.isActive ?? true
  });

  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Category Name is required.');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-navy/10">
        <div className="p-6 border-b border-navy/10 flex items-center justify-between bg-cream/30">
          <h3 className="font-serif font-bold text-2xl text-navy">
            {initialData?.id ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 bg-off-white">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Category Name *</label>
              <input 
                type="text"
                required
                value={formData.name || ''}
                onChange={e => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setFormData({ ...formData, name, slug: formData.slug || slug });
                }}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                placeholder="e.g. SHOPPING, ADVENTURES, SAFARI"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Slug ID</label>
              <input 
                type="text"
                value={formData.slug || ''}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari font-mono"
                placeholder="e.g. shopping"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Display Order</label>
              <input 
                type="number"
                value={formData.displayOrder || 1}
                onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full mt-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
              />
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
              <label className="text-xs font-bold uppercase tracking-wider text-navy/70">Thumbnail / Hero Image URL</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white border border-navy/10 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-safari"
                />
                <button 
                  type="button" 
                  onClick={() => setMediaPickerOpen(true)}
                  className="px-4 py-3 bg-navy text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <ImageIcon size={16} /> Media
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isActive ?? true} 
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })} 
                className="w-5 h-5 accent-safari"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-navy">Active Category</span>
            </label>
          </div>

          <div className="pt-6 border-t border-navy/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 h-12 border border-navy/10 rounded-xl text-xs font-bold text-navy">Cancel</button>
            <button type="submit" disabled={saving} className="px-8 h-12 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-safari/20">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Category
            </button>
          </div>
        </form>
      </div>

      <MediaPicker isOpen={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} onSelect={url => setFormData(p => ({ ...p, imageUrl: url }))} />
    </div>
  );
};
