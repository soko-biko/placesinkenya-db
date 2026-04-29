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
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-12">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="text-safari font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowRight size={14} className="rotate-180" /> Back to Home
            </button>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-navy leading-none">Partner With Us</h1>
            <p className="text-xl text-navy/60 font-light max-w-xl">
              Elevate your business by joining Kenya's premier destination discovery platform. We connect verified operators with high-intent travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 bg-navy rounded-[2.5rem] text-white space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-safari border border-white/5">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif">Global Reach</h3>
              <p className="text-white/50 text-sm font-light">Targeted exposure to international and local tourists actively planning their Kenyan itinerary.</p>
            </div>
            <div className="p-8 bg-white border border-navy/5 rounded-[2.5rem] space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-navy/5 rounded-2xl flex items-center justify-center text-safari border border-navy/5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-navy">Verified Status</h3>
              <p className="text-navy/50 text-sm font-light">Gain the 'Verified Operator' badge, building immediate trust with potential clients through our certification.</p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-navy/5"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center border-b border-navy/5 pb-8 mb-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif font-bold text-navy">Onboarding</h2>
                <p className="text-navy/40 text-xs font-black uppercase tracking-widest">Step {formStep} of 2</p>
              </div>
              <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${formStep === 1 ? 'bg-safari' : 'bg-navy/10'}`}></div>
                <div className={`w-3 h-3 rounded-full ${formStep === 2 ? 'bg-safari' : 'bg-navy/10'}`}></div>
              </div>
            </div>

            {formStep === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Legal Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={20} />
                    <input required type="text" className="w-full bg-navy/5 border border-navy/10 rounded-2xl px-14 py-5 outline-none focus:border-safari/50 transition-all font-medium" placeholder="E.g. Mara Safaris Ltd" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={20} />
                    <input required type="email" className="w-full bg-navy/5 border border-navy/10 rounded-2xl px-14 py-5 outline-none focus:border-safari/50 transition-all font-medium" placeholder="partners@yourbrand.com" />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="w-full py-6 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-navy/90 transition-all flex items-center justify-center gap-3"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Primary Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={20} />
                    <input required type="text" className="w-full bg-navy/5 border border-navy/10 rounded-2xl px-14 py-5 outline-none focus:border-safari/50 transition-all font-medium" placeholder="City, Region" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Website / Portfolio</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={20} />
                    <input type="url" className="w-full bg-navy/5 border border-navy/10 rounded-2xl px-14 py-5 outline-none focus:border-safari/50 transition-all font-medium" placeholder="https://..." />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="flex-1 py-6 border border-navy/10 text-navy font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-navy/5 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-6 bg-safari text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-safari/20 hover:bg-safari-light transition-all"
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
