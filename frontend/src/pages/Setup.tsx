import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { glassStyle, IridescentOverlay } from './Landing';

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
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ ...glassStyle, width: '100%', maxWidth: '440px', padding: '48px', position: 'relative', zIndex: 10 }}
      >
        <IridescentOverlay />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                style={{
                  width: '6px', height: '6px', borderRadius: '50%', transition: 'background-color 0.4s',
                  backgroundColor: s === step ? '#84CC16' : s < step ? 'white' : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <AnimatePresence mode="wait" custom={1}>
                {step === 1 && (
                  <motion.div key="1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'white', margin: 0 }}>Choose a username</h2>
                    <p style={{ color: '#4D5C35', fontSize: '15px', marginBottom: '8px', margin: 0, letterSpacing: '0.01em' }}>This will be your unique handle.</p>
                    <input required placeholder="aditya_codes" value={formData.username} onChange={(e) => setFormData(p => ({...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')}))} 
                      style={{ width: '100%', backgroundColor: 'rgba(5,10,3,0.5)', border: '1px solid rgba(163,230,53,0.1)', color: 'white', borderRadius: '12px', padding: '16px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', fontSize: '15px' }} 
                      onFocus={e => { e.currentTarget.style.borderColor = '#84CC16'; e.currentTarget.style.boxShadow = '0 0 15px rgba(132,204,22,0.15)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(163,230,53,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'white', margin: 0 }}>Short Bio</h2>
                    <p style={{ color: '#4D5C35', fontSize: '15px', marginBottom: '8px', margin: 0, letterSpacing: '0.01em' }}>What are you working on?</p>
                    <textarea required maxLength={160} placeholder="Building the next big thing..." value={formData.bio} onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} rows={3} 
                      style={{ width: '100%', backgroundColor: 'rgba(5,10,3,0.5)', border: '1px solid rgba(163,230,53,0.1)', color: 'white', borderRadius: '12px', padding: '16px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', resize: 'none', fontSize: '15px' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#84CC16'; e.currentTarget.style.boxShadow = '0 0 15px rgba(132,204,22,0.15)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(163,230,53,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <span style={{ fontSize: '12px', color: '#4D5C35', textAlign: 'right' }}>{formData.bio.length} / 160</span>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'white', marginBottom: '8px', margin: 0 }}>Your Avatar</h2>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(5,10,3,0.5)', border: '2px solid #84CC16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 'bold', color: '#84CC16', boxShadow: '0 0 40px rgba(132,204,22,0.3)', marginBottom: '16px' }}>
                      {formData.username.charAt(0).toUpperCase() || '?'}
                    </div>
                    <p style={{ color: '#4D5C35', fontSize: '14px', margin: 0 }}>We've generated an avatar for you. You can upload a custom one later.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              disabled={loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)} 
              style={{ width: '100%', marginTop: '40px', padding: '16px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #65A30D, #84CC16)', boxShadow: '0 0 30px rgba(132,204,22,0.3)', color: '#050A03', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', border: 'none', cursor: (loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)) ? 'not-allowed' : 'none', opacity: (loading || (step === 1 && !formData.username) || (step === 2 && !formData.bio)) ? 0.3 : 1, transition: 'background-color 0.4s, opacity 0.4s', fontSize: '15px', letterSpacing: '0.01em' }}
            >
              {loading ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(5,10,3,0.3)', borderTopColor: '#050A03' }} className="animate-spin" /> : step === totalSteps ? 'Complete Setup' : 'Continue'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
