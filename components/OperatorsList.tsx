
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
    <div className="p-8 sm:p-10 rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none border border-white/5 hover:border-safari/40 transition-all flex flex-col sm:flex-row gap-10 group bg-navy/60 backdrop-blur-xl text-white shadow-3xl shadow-navy/40">
      <div className="sm:w-1/4 flex flex-col items-center justify-center p-8 bg-safari/5 border border-safari/10 rounded-[2rem] shrink-0 transition-colors group-hover:bg-safari/10">
        <div className={`p-6 rounded-2xl bg-safari/10 text-safari border border-safari/20 group-hover:scale-110 transition-transform mb-4 shadow-inner`}>
          {operator.type === OperatorType.COMPANY ? <Briefcase size={40} /> : <UserCheck size={40} />}
        </div>
        <div className="flex items-center gap-2 text-safari font-black text-xs uppercase tracking-widest">
          <Star size={14} fill="currentColor" />
          <span>{operator.rating} Rating</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-3xl font-bold font-serif group-hover:text-safari transition-colors">{operator.name}</h3>
            <span className="text-[10px] bg-white/5 text-white/40 border border-white/10 px-4 py-1.5 rounded-lg uppercase tracking-widest font-black">
              {operator.type}
            </span>
          </div>
          <p className="text-white/60 text-base leading-relaxed line-clamp-3 font-light">{operator.bio}</p>
          <div className="flex flex-wrap gap-2">
            {operator.specialties?.map(s => (
              <span key={s} className="text-[9px] bg-white/5 text-safari border border-safari/10 px-3 py-1 rounded-lg uppercase tracking-widest font-black">
                #{s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Starting Packages</span>
            <span className="font-bold text-white text-2xl font-serif leading-none">Ksh {operator.basePrice.toLocaleString()}</span>
          </div>
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-safari hover:bg-safari-light text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-safari/20 active:scale-95 group-hover:px-10">
            <MessageSquare size={18} />
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
