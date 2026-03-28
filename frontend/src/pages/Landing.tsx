import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Users, Bot } from 'lucide-react';

export const glassStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderTop: '1px solid rgba(255,255,255,0.13)',
  borderLeft: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(28px) saturate(180%) brightness(1.1)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%) brightness(1.1)',
  borderRadius: '20px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

export const IridescentOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
    background: 'linear-gradient(105deg, transparent 20%, rgba(147,51,234,0.07) 38%, rgba(245,158,11,0.05) 50%, rgba(236,72,153,0.06) 62%, transparent 80%)'
  }} />
);

export default function Landing() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Navigate to="/home" />;

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', zIndex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '120px 20px', flex: 1, justifyContent: 'center' }}>
        
        <motion.div variants={container} initial="hidden" animate="show" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Pill Badge */}
          <motion.div variants={item} style={{ marginBottom: '32px' }}>
            <div style={{ ...glassStyle, borderRadius: '999px', padding: '5px 14px', color: '#C084FC', fontSize: '12px', display: 'inline-flex', alignItems: 'center', fontWeight: 600 }}>
              <IridescentOverlay />
              ✦ Now in Beta
            </div>
          </motion.div>

          {/* Heading */}
          <h1 style={{ margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.span variants={item} style={{ fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, color: '#F0EAFF', letterSpacing: '-0.03em', lineHeight: 1.1, display: 'block' }}>
              Deep work,
            </motion.span>
            <motion.span variants={item} style={{ 
              fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, display: 'block',
              background: 'linear-gradient(135deg, #9333EA 0%, #F59E0B 50%, #EC4899 100%)', 
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent'
            }}>
              made social.
            </motion.span>
          </h1>

          <motion.p variants={item} style={{ color: '#635D7A', fontSize: '18px', marginTop: '16px', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.6 }}>
            Study with focus. Build in public. Grow together.
          </motion.p>
          
          <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            <SignInButton mode="modal" fallbackRedirectUrl="/setup">
              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)', borderRadius: '999px', padding: '13px 32px', color: 'white', fontWeight: 600, border: 'none', boxShadow: '0 0 40px rgba(147,51,234,0.5)', cursor: 'pointer', fontSize: '15px' }}
              >
                Get Started
              </motion.button>
            </SignInButton>
            
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ ...glassStyle, borderRadius: '999px', padding: '13px 32px', color: '#F0EAFF', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '15px' }}
            >
              <IridescentOverlay />
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} 
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', width: '100%', maxWidth: '1000px', marginTop: '80px' }}
        >
          {[{
            icon: Target,
            title: "Deep Focus",
            desc: "Pomodoro sessions that actually work.",
            color: '#9333EA'
          }, {
            icon: Users,
            title: "Study Social",
            desc: "Learn with friends, not alone.",
            color: '#EC4899'
          }, {
            icon: Bot,
            title: "AI Coach",
            desc: "Guidance that adapts to you.",
            color: '#F59E0B'
          }].map((feature, idx) => (
            <div key={idx} style={{ ...glassStyle, flex: '1 1 300px', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'transform 0.3s' }} 
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <IridescentOverlay />
              <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <feature.icon style={{ width: '24px', height: '24px', color: feature.color }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '8px', zIndex: 1 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontSize: '15px', zIndex: 1 }}>{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
