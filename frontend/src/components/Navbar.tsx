import { UserButton, useAuth } from '@clerk/clerk-react';
import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        zIndex: 50,
        height: '64px'
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <Target style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
          <span style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '-0.02em', color: 'white' }}>OnlyFocus</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{ elements: { avatarBox: { width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', boxShadow: '0 0 10px var(--accent-glow)' } } }} 
            />
          ) : (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px var(--accent-glow)'
                }}
              >
                Get Started
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
