import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const glassStyle = {
  background: 'linear-gradient(135deg, rgba(132,204,22,0.04) 0%, rgba(217,119,6,0.02) 100%)',
  border: '1px solid rgba(163,230,53,0.07)',
  borderTop: '1px solid rgba(163,230,53,0.13)',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  borderRadius: '20px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(163,230,53,0.06)',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

// Shimmer child effect using amber/green mix
export const IridescentOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
    background: 'linear-gradient(105deg, transparent 20%, rgba(132,204,22,0.05) 38%, rgba(217,119,6,0.04) 50%, rgba(163,230,53,0.03) 62%, transparent 80%)'
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
    <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', zIndex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '120px 20px', flex: 1, justifyContent: 'center' }}>
        
        <motion.div variants={container} initial="hidden" animate="show" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          {/* Badge */}
          <motion.div variants={item} style={{ marginBottom: '32px' }}>
            <div style={{ color: '#84CC16', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', borderBottom: '1px solid rgba(132,204,22,0.3)', paddingBottom: '2px' }}>
              ✦ Beta
            </div>
          </motion.div>

          {/* Heading */}
          <h1 style={{ margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.span variants={item} style={{ 
              fontSize: 'clamp(64px, 9vw, 96px)', fontWeight: 900, color: '#ECFCCB', 
              letterSpacing: '-0.04em', lineHeight: 1.1, display: 'block', fontStyle: 'italic'
            }}>
              Deep work,
            </motion.span>
            <motion.span variants={item} style={{ 
              fontSize: 'clamp(64px, 9vw, 96px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, display: 'block',
              background: 'linear-gradient(135deg, #A3E635 0%, #D97706 60%)', 
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent'
            }}>
              made social.
            </motion.span>
          </h1>

          <motion.p variants={item} style={{ color: '#4D5C35', fontSize: '16px', letterSpacing: '0.01em', marginTop: '24px', marginBottom: '48px', maxWidth: '500px', lineHeight: 1.6 }}>
            The study platform for people who take their work seriously.
          </motion.p>
          
          <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
            <SignInButton mode="modal" fallbackRedirectUrl="/setup">
              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: 'linear-gradient(135deg, #65A30D, #84CC16)', borderRadius: '999px', padding: '14px 34px', color: '#050A03', fontWeight: 700, border: 'none', boxShadow: '0 0 30px rgba(132,204,22,0.3)', cursor: 'none', fontSize: '15px', letterSpacing: '0.01em' }}
              >
                Get Started
              </motion.button>
            </SignInButton>
            
            <motion.button 
              style={{ background: 'transparent', border: 'none', color: '#4D5C35', fontWeight: 600, cursor: 'none', fontSize: '15px', padding: '14px 20px', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#84CC16'; e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#4D5C35'; e.currentTarget.style.textDecoration = 'none'; }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Cards - Editorial */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} 
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', width: '100%', maxWidth: '1000px', marginTop: '100px' }}
        >
          {[{
            num: "01", title: "Deep Focus", desc: "Pomodoro sessions that actually work."
          }, {
            num: "02", title: "Study Social", desc: "Learn with friends, not alone."
          }, {
            num: "03", title: "AI Coach", desc: "Guidance that adapts to you."
          }].map((feature, idx) => (
            <div key={idx} style={{ ...glassStyle, flex: '1 1 300px', padding: '36px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'all 0.4s ease' }} 
                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(132,204,22,0.12)'; }}
                 onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = glassStyle.boxShadow; }}
            >
              <IridescentOverlay />
              <div style={{ color: '#84CC16', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '24px', zIndex: 1 }}>
                {feature.num}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'white', marginBottom: '10px', zIndex: 1 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontSize: '14px', zIndex: 1 }}>{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
