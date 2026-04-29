
import React from 'react';
import { TourOperator, OperatorType } from '../types';
import { Star, Phone, Briefcase, UserCheck, MessageSquare } from 'lucide-react';

interface OperatorsListProps {
  operators: TourOperator[];
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operators }) => {
  const companies = operators.filter(o => o.type === OperatorType.COMPANY);
  const individuals = operators.filter(o => o.type === OperatorType.INDIVIDUAL);

  const OperatorCard: React.FC<{ operator: TourOperator }> = ({ operator }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full border border-navy/5 group">
      {/* Visual Header / Avatar Section */}
      <div className="relative h-48 bg-navy p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-safari via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transform group-hover:scale-110 transition-transform duration-500">
          {operator.type === OperatorType.COMPANY ? (
            <Briefcase size={40} className="text-navy" />
          ) : (
            <UserCheck size={40} className="text-navy" />
          )}
        </div>

        {/* Verified Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-green-500/20 shadow-sm flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 text-[10px] font-black uppercase tracking-wider">Verified</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-safari px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
          <Star size={12} fill="white" className="text-white" />
          <span className="text-white text-[11px] font-bold">{operator.rating} Status</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-navy group-hover:text-safari transition-colors">{operator.name}</h3>
            <span className="text-[10px] text-navy/30 uppercase font-bold tracking-widest">
              {operator.type?.replace('_', ' ')} Partner
            </span>
          </div>

          <p className="text-navy/60 text-sm leading-relaxed line-clamp-3 font-medium">
            {operator.bio}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {operator.specialties?.map(s => (
              <span key={s} className="text-[9px] bg-navy/5 text-navy border border-navy/10 px-2.5 py-1 rounded-md uppercase tracking-wider font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col w-full md:w-auto">
            <span className="text-[10px] text-navy/30 uppercase font-black tracking-widest leading-none mb-1">Starting From</span>
            <span className="font-bold text-navy text-xl font-sans">Ksh {operator.basePrice.toLocaleString()}</span>
          </div>
          <button className="flex items-center justify-center gap-3 w-full md:w-auto px-10 h-12 bg-navy hover:bg-safari text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95">
            <MessageSquare size={16} />
            Connect Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-20 py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-serif font-bold text-navy whitespace-nowrap">Tour Companies</h2>
          <div className="h-px bg-navy/10 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {companies.map(o => <OperatorCard key={o.id} operator={o} />)}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-serif font-bold text-navy whitespace-nowrap">Local Guides</h2>
          <div className="h-px bg-navy/10 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {individuals.map(o => <OperatorCard key={o.id} operator={o} />)}
        </div>
      </div>
    </div>
  );
};
