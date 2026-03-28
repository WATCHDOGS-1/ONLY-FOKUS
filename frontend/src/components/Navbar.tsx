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
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
        padding: '16px 40px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', background: 'rgba(3,2,10,0.6)', 
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <Target style={{ width: '20px', height: '20px', color: '#9333EA' }} />
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#F0EAFF', letterSpacing: '-0.02em' }}>OnlyFocus</span>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9333EA', marginLeft: '2px' }} />
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isSignedIn ? (
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{ elements: { avatarBox: { width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', boxShadow: '0 0 10px rgba(147,51,234,0.3)' } } }} 
          />
        ) : (
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '8px 20px', borderRadius: '9999px', background: 'linear-gradient(135deg, #7C3AED, #9333EA)', color: 'white', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 0 15px rgba(147,51,234,0.3)' }}
            >
              Get Started
            </motion.button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
