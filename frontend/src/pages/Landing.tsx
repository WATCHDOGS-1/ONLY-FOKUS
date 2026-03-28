import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Focus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Navigate to="/home" />;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <main className="relative flex-1 flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      
      {/* Floating orbs */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }} 
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }} 
         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4338ca]/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl w-full text-center space-y-12 px-4"
      >
        <motion.div variants={item} className="flex justify-center">
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] shadow-[0_0_40px_rgba(124,58,237,0.1)]">
            <Focus className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.h1 
            variants={item}
            className="text-6xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
          >
            Deep work, <br className="sm:hidden" /> made social.
          </motion.h1>
          <motion.p 
            variants={item}
            className="text-xl sm:text-2xl text-[#888888] font-medium max-w-2xl mx-auto"
          >
            Study with focus. Build in public. Grow together.
          </motion.p>
        </div>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <SignInButton mode="modal" fallbackRedirectUrl="/setup">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(124,58,237,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </motion.button>
          </SignInButton>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent text-white font-bold text-lg hover:bg-[#111111] border border-[#222222] transition-colors"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </main>
  );
}
