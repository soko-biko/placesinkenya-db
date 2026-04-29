import React from 'react';
import { Utensils, Music, Coffee, TreePine, Compass, Mountain } from 'lucide-react';
import { PlaceCategory } from '../types';

interface CategoryQuickGridProps {
  onCategoryClick: (category: PlaceCategory) => void;
}

export const CategoryQuickGrid: React.FC<CategoryQuickGridProps> = ({ onCategoryClick }) => {
  const categories = [
    { id: PlaceCategory.RESTAURANTS, label: 'Restaurants', icon: Utensils, color: 'bg-orange-50 text-orange-600' },
    { id: PlaceCategory.ENTERTAINMENT, label: 'Entertainment', icon: Music, color: 'bg-purple-50 text-purple-600' },
    { id: PlaceCategory.OUTDOORS, label: 'Outdoors', icon: TreePine, color: 'bg-green-50 text-green-600' },
    { id: PlaceCategory.HANGOUT_SPOTS, label: 'Hangout Spots', icon: Coffee, color: 'bg-amber-50 text-amber-600' },
    { id: PlaceCategory.SAFARI, label: 'Safaris', icon: Compass, color: 'bg-yellow-50 text-yellow-600' },
    { id: PlaceCategory.ADVENTURES, label: 'Adventures', icon: Mountain, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 -mt-12 relative z-20">
      <div className="bg-white rounded-3xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-navy/5">
        <h3 className="text-navy/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 text-center">What Are You Looking For?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="group flex flex-col items-center gap-4 p-5 bg-navy/[0.02] hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all rounded-2xl border border-navy/5 hover:border-safari/30"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-navy/5 group-hover:border-safari/30 transition-all">
                <cat.icon size={24} className="text-navy group-hover:text-safari transition-colors" />
              </div>
              <span className="text-xs font-bold text-navy group-hover:text-safari transition-colors uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
