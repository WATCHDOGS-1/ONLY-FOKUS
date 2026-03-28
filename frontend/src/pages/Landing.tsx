import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Users, Bot } from 'lucide-react';

export default function Landing() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Navigate to="/home" />;

  const titleWords = ["Deep work,", "made social."];
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background with orbs and grid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bg-dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div className="animate-float-1" style={{ position: 'absolute', top: '25%', left: '25%', width: '500px', height: '500px', backgroundColor: 'rgba(124,58,237,0.2)', borderRadius: '50%', filter: 'blur(120px)' }} />
        <div className="animate-float-2" style={{ position: 'absolute', top: '50%', right: '25%', width: '400px', height: '400px', backgroundColor: 'rgba(67,56,202,0.2)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div className="animate-float-3" style={{ position: 'absolute', bottom: '25%', left: '33%', width: '600px', height: '600px', backgroundColor: 'rgba(109,40,217,0.15)', borderRadius: '50%', filter: 'blur(140px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', paddingTop: '128px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
        <motion.div variants={container} initial="hidden" animate="show" style={{ textAlign: 'center', maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.div variants={item} style={{ marginBottom: '32px' }}>
            <div className="glass" style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500 }}>
              <span style={{ color: 'var(--accent)' }}>✦</span>
              <span style={{ color: 'var(--text)' }}>Now in Beta</span>
            </div>
          </motion.div>

          <h1 style={{ fontSize: 'min(72px, 12vw)', fontWeight: 'bold', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '24px', display: 'flex', flexDirection: 'column' }}>
            {titleWords.map((word, i) => (
              <motion.span key={i} variants={item} style={{ color: 'white', display: 'block' }}>
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p variants={item} style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '672px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
            Study with focus. Build in public. Grow together.
          </motion.p>
          
          <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '32px', width: '100%' }}>
            <SignInButton mode="modal" fallbackRedirectUrl="/setup">
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px var(--accent-glow)' }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '14px 32px', borderRadius: '9999px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, fontSize: '18px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                Get Started
              </motion.button>
            </SignInButton>
            
            <motion.button 
              className="glass"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '14px 32px', borderRadius: '9999px', color: 'white', fontWeight: 600, fontSize: '18px', cursor: 'pointer', transition: 'background-color 0.2s' }}
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.span variants={item} style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Join 0 focused students
          </motion.span>
        </motion.div>

        {/* Features Row */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} 
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', width: '100%', maxWidth: '1024px', marginTop: '128px' }}
        >
          {[{
            icon: Target,
            title: "Deep Focus",
            desc: "Pomodoro sessions that actually work."
          }, {
            icon: Users,
            title: "Study Social",
            desc: "Learn with friends, not alone."
          }, {
            icon: Bot,
            title: "AI Coach",
            desc: "Guidance that adapts to you."
          }].map((feature, idx) => (
            <div key={idx} className="glass" style={{ flex: '1 1 250px', padding: '24px', transition: 'transform 0.3s' }} 
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--glass-border)' }}>
                <feature.icon style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
