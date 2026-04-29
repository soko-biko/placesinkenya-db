import React from 'react';
import { ArrowRight } from 'lucide-react';

export const EditorialStrip: React.FC = () => {
  const articles = [
    {
      title: "Best Rooftop Bars in Nairobi",
      tag: "NIGHTLIFE",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    },
    {
      title: "Top 10 Hikes Within 2 Hours of Nairobi",
      tag: "OUTDOORS",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    },
    {
      title: "Where Locals Actually Eat in Mombasa",
      tag: "FOOD",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    }
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-20 border-t border-navy/5">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-serif font-bold text-navy">Get Inspired</h2>
        <button className="text-safari font-bold text-sm flex items-center gap-2 group">
          View all articles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, i) => (
          <div key={i} className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-xl">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
            <div className="absolute top-6 left-6">
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20 uppercase tracking-widest">
                {article.tag}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-xl font-bold text-white leading-tight group-hover:text-safari transition-colors">{article.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
