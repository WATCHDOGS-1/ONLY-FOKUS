import { UserButton, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
        padding: '24px 48px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', background: 'rgba(5,10,3,0.3)', 
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.02)'
      }}
    >
      <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <span style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '20px', color: '#ECFCCB', letterSpacing: '-0.04em' }}>OnlyFocus</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isSignedIn ? (
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{ elements: { avatarBox: { width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(163,230,53,0.2)', boxShadow: '0 0 15px rgba(132,204,22,0.2)' } } }} 
          />
        ) : (
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '10px 24px', borderRadius: '9999px', background: 'linear-gradient(135deg, #65A30D, #84CC16)', color: '#050A03', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(132,204,22,0.2)', letterSpacing: '0.01em' }}
            >
              Get Started
            </motion.button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
