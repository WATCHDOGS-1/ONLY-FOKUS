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
      className="fixed top-0 inset-x-0 glass !rounded-none !border-x-0 !border-t-0 z-50 h-16"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3 group">
          <Target className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-bold text-lg tracking-tight text-white transition-colors">OnlyFocus</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-[var(--border)] shadow-sm shadow-[var(--accent-glow)]" } }} 
            />
          ) : (
            <Link to="/">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[#8B5CF6] transition-colors shadow-[0_0_15px_var(--accent-glow)]"
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
