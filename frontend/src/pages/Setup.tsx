import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Setup() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < totalSteps) return handleNext();

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          username: formData.username,
          display_name: formData.username, // Reuse for setup simplicity
          bio: formData.bio
        })
      });

      if (res.ok) navigate('/home');
      else alert((await res.json()).error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const variants: any = {
    enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 40 : -40, opacity: 0 })
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-8 relative">
      <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass w-full max-w-[440px] p-8 md:p-10 relative z-10"
      >
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${s === step ? 'bg-[var(--accent)]' : s < step ? 'bg-white' : 'bg-[var(--text-muted)]/30'}`} 
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="min-h-[200px] flex flex-col justify-between">
          <div className="relative flex-1">
            <AnimatePresence mode="wait" custom={1}>
              {step === 1 && (
                <motion.div key="1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="absolute inset-0 flex flex-col gap-3">
                  <h2 className="text-2xl font-bold text-white">Choose a username</h2>
                  <p className="text-[var(--text-muted)] text-sm mb-2">This will be your unique handle.</p>
                  <input required placeholder="aditya_codes" value={formData.username} onChange={(e) => setFormData(p => ({...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')}))} className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--text-muted)]" />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="absolute inset-0 flex flex-col gap-3">
                  <h2 className="text-2xl font-bold text-white">Short Bio</h2>
                  <p className="text-[var(--text-muted)] text-sm mb-2">What are you working on?</p>
                  <textarea required maxLength={160} placeholder="Building the next big thing..." value={formData.bio} onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} rows={3} className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all resize-none placeholder:text-[var(--text-muted)]" />
                  <span className="text-xs text-[var(--text-muted)] text-right">{formData.bio.length} / 160</span>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="absolute inset-0 flex flex-col gap-3 items-center text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Your Avatar</h2>
                  <div className="w-24 h-24 rounded-full bg-[var(--surface-2)] border-2 border-[var(--accent)] flex items-center justify-center text-3xl font-bold text-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)] mb-4">
                    {formData.username.charAt(0).toUpperCase() || '?'}
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">We've generated an avatar for you. You can upload a custom one later.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            type="submit" 
            disabled={loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)} 
            className="w-full mt-10 px-6 py-3.5 rounded-lg bg-[var(--accent)] text-white font-semibold flex items-center justify-center disabled:opacity-50 transition-colors shadow-lg"
          >
            {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : step === totalSteps ? 'Complete Setup' : 'Continue'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
