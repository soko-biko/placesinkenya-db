import React, { useState, useEffect } from 'react';
import { mediaService } from '../firebase/services';
import { MediaAsset } from '../types';
import { Image as ImageIcon, Upload, Search, Check, X, Loader2, Trash2, Copy } from 'lucide-react';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image from Media Library"
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await mediaService.getAll();
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newAsset = await mediaService.upload(file, { altText: file.name });
      setAssets(prev => [newAsset, ...prev]);
      setSelectedUrl(newAsset.downloadURL);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.filename.toLowerCase().includes(search.toLowerCase()) || 
    (a.altText && a.altText.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-navy/10">
        {/* Header */}
        <div className="p-6 border-b border-navy/10 flex items-center justify-between bg-cream/40">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-safari" size={24} />
            <div>
              <h3 className="font-serif font-bold text-xl text-navy">{title}</h3>
              <p className="text-navy/50 text-xs">Choose an existing asset or upload a new file to Storage</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-navy/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 text-navy/30" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy/5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-safari"
            />
          </div>

          <label className="w-full sm:w-auto h-11 px-6 bg-safari text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-safari-hover transition-colors shadow-lg shadow-safari/20">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Grid Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-off-white">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-navy/40 gap-3">
              <Loader2 size={32} className="animate-spin text-safari" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading Media Assets...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ImageIcon size={48} className="mx-auto text-navy/20" />
              <p className="font-serif font-bold text-navy/60">No Media Found</p>
              <p className="text-xs text-navy/40">Upload an image to start populating your Media Library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedUrl === asset.downloadURL;
                return (
                  <div 
                    key={asset.id}
                    onClick={() => setSelectedUrl(asset.downloadURL)}
                    className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected ? 'border-safari ring-4 ring-safari/20 scale-[0.98]' : 'border-transparent hover:border-navy/20'
                    }`}
                  >
                    <img 
                      src={asset.downloadURL} 
                      alt={asset.altText || asset.filename} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <p className="text-white text-xs font-bold truncate">{asset.filename}</p>
                      <p className="text-white/60 text-[10px]">{asset.contentType.split('/')[1]?.toUpperCase()}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-safari text-white flex items-center justify-center shadow-lg">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-navy/10 flex items-center justify-between bg-white">
          <p className="text-xs text-navy/50 font-medium">
            {selectedUrl ? "1 asset selected" : "Click on an image to select it"}
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 h-11 border border-navy/10 rounded-xl text-xs font-bold text-navy hover:bg-navy/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  onSelect(selectedUrl);
                  onClose();
                }
              }}
              className="px-8 h-11 bg-navy text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-navy/90 transition-colors shadow-lg"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
