import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Setup() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ username: '', displayName: '', bio: '' });
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

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
          display_name: formData.displayName,
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

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#1A1A1A] z-50">
        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: "easeInOut", duration: 0.4 }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        className="w-full max-w-[480px] bg-[#111111] border border-[#222222] rounded-3xl p-8 md:p-12 shadow-2xl relative"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Configure Profile</h1>
          <p className="text-[#888888] font-medium text-sm">Step {step} of {totalSteps}</p>
        </div>

        <form onSubmit={handleSubmit} className="min-h-[220px] flex flex-col justify-between">
          <div className="relative flex-1">
            <AnimatePresence mode="wait" custom={1}>
              {step === 1 && (
                <motion.div key="step1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col gap-3">
                  <label className="text-sm font-semibold text-white">Choose a unique username</label>
                  <input required placeholder="e.g. aditya_codes" value={formData.username} onChange={(e) => setFormData(p => ({...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')}))} className="w-full bg-[#1A1A1A] border border-[#222222] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner" />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col gap-3">
                  <label className="text-sm font-semibold text-white">What should we call you?</label>
                  <input required placeholder="Aditya" value={formData.displayName} onChange={(e) => setFormData(p => ({...p, displayName: e.target.value}))} className="w-full bg-[#1A1A1A] border border-[#222222] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner" />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col gap-3">
                  <label className="text-sm font-semibold text-white">Short Bio</label>
                  <textarea placeholder="Building OnlyFocus Phase 1..." value={formData.bio} onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} rows={3} className="w-full bg-[#1A1A1A] border border-[#222222] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none shadow-inner" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-[#222222]">
            {step > 1 && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleBack} className="px-6 py-3 rounded-xl bg-transparent text-[#888888] font-bold hover:text-white border border-[#222222] hover:bg-[#1A1A1A] transition-colors">
                Back
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 px-6 py-3 rounded-xl bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-[#EAEAEA] transition-colors">
              {loading ? 'Saving...' : step === totalSteps ? 'Complete' : 'Next'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
