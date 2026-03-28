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
          display_name: formData.username,
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
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px 16px', position: 'relative' }}>
      <div className="bg-dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }} />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass"
        style={{ width: '100%', maxWidth: '440px', padding: '40px', position: 'relative', zIndex: 10 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              style={{
                width: '8px', height: '8px', borderRadius: '50%', transition: 'background-color 0.3s',
                backgroundColor: s === step ? 'var(--accent)' : s < step ? 'white' : 'rgba(102,102,128,0.3)'
              }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <AnimatePresence mode="wait" custom={1}>
              {step === 1 && (
                <motion.div key="1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>Choose a username</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', margin: 0 }}>This will be your unique handle.</p>
                  <input required placeholder="aditya_codes" value={formData.username} onChange={(e) => setFormData(p => ({...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')}))} 
                    style={{ width: '100%', backgroundColor: 'var(--surface-2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', padding: '12px 16px', outline: 'none', transition: 'border-color 0.2s', fontSize: '16px' }} 
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>Short Bio</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', margin: 0 }}>What are you working on?</p>
                  <textarea required maxLength={160} placeholder="Building the next big thing..." value={formData.bio} onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} rows={3} 
                    style={{ width: '100%', backgroundColor: 'var(--surface-2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', padding: '12px 16px', outline: 'none', transition: 'border-color 0.2s', resize: 'none', fontSize: '16px' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>{formData.bio.length} / 160</span>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px', margin: 0 }}>Your Avatar</h2>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--surface-2)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 'bold', color: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)', marginBottom: '16px' }}>
                    {formData.username.charAt(0).toUpperCase() || '?'}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>We've generated an avatar for you. You can upload a custom one later.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            type="submit" 
            disabled={loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)} 
            style={{ width: '100%', marginTop: '40px', padding: '14px 24px', borderRadius: '8px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', border: 'none', cursor: (loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)) ? 'not-allowed' : 'pointer', opacity: (loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)) ? 0.5 : 1, transition: 'background-color 0.2s, opacity 0.2s', boxShadow: '0 4px 14px 0 var(--accent-glow)' }}
          >
            {loading ? <div className="animate-spin" style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}/> : step === totalSteps ? 'Complete Setup' : 'Continue'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
