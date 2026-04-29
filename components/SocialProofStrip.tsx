import React from 'react';
import { User } from 'lucide-react';

export const SocialProofStrip: React.FC = () => {
  const activities = [
    { user: 'Sarah from London', action: 'tried nyama choma at Carnivore', time: '2 hrs ago' },
    { user: 'James from Berlin', action: 'hiked Ngong Hills', time: '4 hrs ago' },
    { user: 'Aisha from Dubai', action: 'caught a live set at The Alchemist', time: 'Yesterday' },
    { user: 'Mark from Cape Town', action: 'went rafting at Sagana', time: 'Yesterday' },
    { user: 'Priya from Mumbai', action: 'worked from Java House Karen', time: '3 hrs ago' },
  ];

  return (
    <section className="bg-navy py-12 overflow-hidden border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 mb-8">
        <h2 className="text-white font-serif text-2xl font-bold text-center">What Travellers Are Doing in Kenya This Week</h2>
      </div>
      
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {[...activities, ...activities].map((activity, i) => (
          <div key={i} className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-safari border border-white/10">
              <User size={20} />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-white text-sm font-medium">
                <span className="text-safari font-bold">{activity.user}</span> {activity.action}
              </p>
              <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
