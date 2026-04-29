
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
    <div className="p-8 rounded-[2rem] border border-white/5 hover:border-safari/40 transition-all flex flex-col justify-between h-full group bg-navy text-white shadow-2xl shadow-navy/20">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl bg-safari/10 text-safari border border-safari/20 group-hover:scale-110 transition-transform`}>
            {operator.type === OperatorType.COMPANY ? <Briefcase size={28} /> : <UserCheck size={28} />}
          </div>
          <div className="flex items-center gap-2 text-yellow-500 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <Star size={16} fill="currentColor" />
            <span>{operator.rating}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold font-serif mb-3 group-hover:text-safari transition-colors">{operator.name}</h3>
        <p className="text-white/60 text-base mb-6 leading-relaxed line-clamp-3 font-light">{operator.bio}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {operator.specialties?.map(s => (
            <span key={s} className="text-[10px] bg-white/10 text-white/40 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest font-black">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between px-2 mb-4">
          <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Starting Price</span>
          <span className="font-bold text-safari text-lg">Ksh {operator.basePrice.toLocaleString()}</span>
        </div>
        <button className="flex items-center justify-center gap-3 w-full py-4 bg-safari hover:bg-safari-light text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-safari/20 active:scale-95">
          <MessageSquare size={18} />
          Inquire Now
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map(o => <OperatorCard key={o.id} operator={o} />)}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-serif font-bold text-navy whitespace-nowrap">Local Guides</h2>
          <div className="h-px bg-navy/10 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {individuals.map(o => <OperatorCard key={o.id} operator={o} />)}
        </div>
      </div>
    </div>
  );
};
