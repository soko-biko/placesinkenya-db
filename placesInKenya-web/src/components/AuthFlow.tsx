import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, ArrowRight, Github, ChevronRight, CheckCircle2, ShieldCheck, Globe, Instagram, Twitter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

interface AuthFlowProps {
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { login, signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState<User['persona']>('TRAVELER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else {
        await signup(email, password, name, persona);
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex overflow-hidden">
      {/* Left Column: Ambient Imagery & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Kenyan Savannah"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-transparent to-navy/80" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-safari flex items-center justify-center rounded-xl shadow-xl">
                <Globe size={24} className="text-white" />
             </div>
             <span className="text-white text-lg font-serif font-bold tracking-tight">PlacesInKenya</span>
          </div>

          <div className="space-y-8">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
               className="space-y-6"
             >
                <h2 className="text-5xl font-serif font-bold text-white leading-tight">
                   "To travel is to discover that <span className="italic text-safari font-light">everyone</span> is wrong about other countries."
                </h2>
                <div className="flex items-center gap-4">
                   <div className="h-px w-12 bg-safari"></div>
                   <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black">Aldous Huxley — Explorers Collective</p>
                </div>
             </motion.div>
          </div>

          <div className="flex gap-6">
             <button className="text-white/20 hover:text-white transition-colors"><Instagram size={20}/></button>
             <button className="text-white/20 hover:text-white transition-colors"><Twitter size={20}/></button>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 md:p-20 overflow-y-auto bg-topo">
        <button 
          onClick={onClose}
          className="absolute top-12 right-12 p-3 text-navy/20 hover:text-navy transition-colors"
        >
          <ChevronRight size={24} className="rotate-180 md:rotate-0" />
        </button>

        <div className="w-full max-w-md space-y-12">
          {success ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-500 text-white flex items-center justify-center rounded-[32px] mx-auto shadow-2xl shadow-green-500/20">
                 <CheckCircle2 size={48} />
              </div>
              <div className="space-y-4">
                 <h2 className="text-3xl font-serif font-bold text-navy">Karibu, {name.split(' ')[0]}!</h2>
                 <p className="text-navy/40 font-medium">Welcome to the collective. Your journey begins now.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-3">
                 <motion.h1 
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif font-bold text-navy"
                 >
                   {mode === 'login' ? 'Welcome back, Explorer' : 'Join the Collective'}
                 </motion.h1>
                 <p className="text-navy/40 font-medium leading-relaxed">
                   {mode === 'login' 
                     ? 'Access your saved destinations and professional travel networks.' 
                     : 'Unlock the full potential of your Kenyan journey with curated access.'}
                 </p>
              </div>

              {/* Social Login */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full h-16 bg-white border border-navy/5 rounded-2xl flex items-center justify-center gap-4 hover:bg-stone-50 transition-all shadow-sm active:scale-[0.98] tap-target"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_活跃用户_logo.svg" className="w-6 h-6" alt="Google" />
                <span className="text-[11px] font-black uppercase tracking-widest text-navy">Continue with Google</span>
              </button>

              <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy/5"></div></div>
                 <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest text-navy/20 bg-stone-50 px-4">OR USE EMAIL</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 ml-4">Full Name</label>
                    <div className="relative group">
                       <input 
                         required
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder="e.g. Biko Wanderer"
                         className="w-full h-16 bg-white border border-navy/5 rounded-2xl px-6 outline-none focus:ring-2 focus:ring-safari/20 transition-all font-medium text-navy tap-target"
                       />
                       <UserIcon size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/10 group-focus-within:text-safari" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 ml-4">Email Address</label>
                  <div className="relative group">
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="biko@collective.travel"
                      className="w-full h-16 bg-white border border-navy/5 rounded-2xl px-6 outline-none focus:ring-2 focus:ring-safari/20 transition-all font-medium text-navy tap-target"
                    />
                    <Mail size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/10 group-focus-within:text-safari" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy/40">Password</label>
                    {mode === 'login' && <button type="button" className="text-[9px] font-black uppercase tracking-widest text-safari hover:underline">Forgot?</button>}
                  </div>
                  <div className="relative group">
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-16 bg-white border border-navy/5 rounded-2xl px-6 outline-none focus:ring-2 focus:ring-safari/20 transition-all font-medium text-navy tap-target"
                    />
                    <Lock size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/10 group-focus-within:text-safari" />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="space-y-4 pt-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy/40 ml-4">Account Focus</label>
                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'TRAVELER', label: 'Traveler' },
                         { id: 'LOCAL_EXPLORER', label: 'Local' },
                         { id: 'BUSINESS_OWNER', label: 'Pro' }
                       ].map((opt) => (
                         <button
                           key={opt.id}
                           type="button"
                           onClick={() => setPersona(opt.id as User['persona'])}
                           className={`h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border tap-target ${persona === opt.id ? 'bg-navy border-navy text-white shadow-lg' : 'bg-white border-navy/5 text-navy/30 hover:border-navy/10'}`}
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider text-center">{error}</p>}

                <div className="pt-6">
                  <button 
                    disabled={loading}
                    className="w-full h-16 bg-safari text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-safari/20 hover:bg-safari-light transition-all active:scale-[0.98] disabled:opacity-50 tap-target"
                  >
                    {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Collective' : 'Create My Account'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>

              <div className="text-center pt-8 border-t border-navy/5">
                 <button 
                   onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                   className="text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy transition-colors"
                 >
                   {mode === 'login' ? 'New to PlacesInKenya? Create an account' : 'Already part of the collective? Sign In'}
                 </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-navy/10">
                 <ShieldCheck size={12} />
                 <span>Military Grade Profile Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
