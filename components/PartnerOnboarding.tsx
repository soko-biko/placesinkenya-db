import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  Rocket,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface PartnerOnboardingProps {
  onBack: () => void;
}

export const PartnerOnboarding: React.FC<PartnerOnboardingProps> = ({ onBack }) => {
  const [formStep, setFormStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-20 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-500/20"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">Application Received</h2>
        <p className="text-navy/60 text-lg max-w-md mx-auto mb-10">
          Thank you for joining the PlacesInKenya collective. Our partnership team will review your credentials and reach out within 48 hours.
        </p>
        <button 
          onClick={onBack}
          className="px-10 py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-navy/90 transition-all active:scale-95"
        >
          Back to Explorer
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20 items-start">
        <div className="space-y-12">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="text-navy font-bold text-sm flex items-center gap-2 hover:text-safari transition-all group"
            >
              <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to explorer
            </button>
            <div className="space-y-3">
              <span className="text-safari font-bold uppercase tracking-widest text-[11px]">Partnerships</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy leading-tight">Partner with us</h1>
              <p className="text-lg text-navy/60 font-medium max-w-xl">
                Elevate your business by joining Kenya's premier destination discovery platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-navy/5 border border-navy/5 rounded-2xl space-y-4">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-safari shadow-sm">
                <Rocket size={22} />
              </div>
              <h3 className="text-lg font-bold font-serif text-navy">Global Reach</h3>
              <p className="text-navy/60 text-sm font-medium leading-relaxed">Targeted exposure to international and local tourists actively planning their Kenyan itinerary.</p>
            </div>
            <div className="p-6 bg-navy/5 border border-navy/5 rounded-2xl space-y-4">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-safari shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-lg font-bold font-serif text-navy">Verified Status</h3>
              <p className="text-navy/60 text-sm font-medium leading-relaxed">Gain the 'Verified Operator' badge, building immediate trust with potential clients through our certification.</p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-navy/5"
        >
          <div className="mb-10 text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold text-navy whitespace-nowrap">Become an Official Tours Partner</h2>
            <div className="flex justify-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${formStep === 1 ? 'bg-safari' : 'bg-navy/10'}`}></div>
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${formStep === 2 ? 'bg-safari' : 'bg-navy/10'}`}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formStep === 1 ? (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy/40 ml-1">Legal Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                    <input required type="text" className="w-full bg-navy/5 border border-navy/10 rounded-xl h-12 pl-12 pr-4 outline-none focus:border-safari/50 transition-all font-medium text-navy" placeholder="Mara Safaris Ltd" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy/40 ml-1">Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                    <input required type="email" className="w-full bg-navy/5 border border-navy/10 rounded-xl h-12 pl-12 pr-4 outline-none focus:border-safari/50 transition-all font-medium text-navy" placeholder="partners@yourbrand.com" />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="w-full h-12 bg-navy text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-safari transition-all flex items-center justify-center gap-3"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy/40 ml-1">Primary Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                    <input required type="text" className="w-full bg-navy/5 border border-navy/10 rounded-xl h-12 pl-12 pr-4 outline-none focus:border-safari/50 transition-all font-medium text-navy" placeholder="City, Region" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy/40 ml-1">Website / Portfolio</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                    <input type="url" className="w-full bg-navy/5 border border-navy/10 rounded-xl h-12 pl-12 pr-4 outline-none focus:border-safari/50 transition-all font-medium text-navy" placeholder="https://..." />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="flex-1 h-12 border border-navy/10 text-navy font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-navy/5 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] h-12 bg-safari text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-safari-light transition-all"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};
