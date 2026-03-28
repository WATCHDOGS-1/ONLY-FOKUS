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
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background with orbs and grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] animate-float-1" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#4338CA]/20 rounded-full blur-[100px] animate-float-2" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-[#6D28D9]/15 rounded-full blur-[140px] animate-float-3" />
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1 justify-center pt-32 pb-20 px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div variants={item} className="mb-8">
            <div className="glass px-4 py-2 flex items-center gap-2 rounded-full inline-flex border-[var(--glass-border)] text-sm font-medium">
              <span className="text-[var(--accent)]">✦</span>
              <span className="text-[var(--text)]">Now in Beta</span>
            </div>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6 flex flex-col">
            {titleWords.map((word, i) => (
              <motion.span key={i} variants={item} className="text-white block">
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p variants={item} className="text-[18px] text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Study with focus. Build in public. Grow together.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
            <SignInButton mode="modal" fallbackRedirectUrl="/setup">
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px var(--accent-glow)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold text-lg transition-colors hover:bg-[#8B5CF6]"
              >
                Get Started
              </motion.button>
            </SignInButton>
            
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="glass w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-semibold text-lg hover:bg-[var(--glass-border)] transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.span variants={item} className="text-xs text-[var(--text-muted)] tracking-wider uppercase font-semibold">
            Join 0 focused students
          </motion.span>
        </motion.div>

        {/* Features Row - Scrolling reveals could use IntersectionObserver, but simple animate mount here */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} 
          className="grid sm:grid-cols-3 gap-6 w-full max-w-5xl mt-32"
        >
          <div className="glass p-6 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[var(--glass)] flex items-center justify-center mb-4 border border-[var(--glass-border)] group-hover:border-[var(--accent)] transition-colors">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deep Focus</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">Pomodoro sessions that actually work.</p>
          </div>
          <div className="glass p-6 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[var(--glass)] flex items-center justify-center mb-4 border border-[var(--glass-border)] group-hover:border-[var(--accent)] transition-colors">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Study Social</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">Learn with friends, not alone.</p>
          </div>
          <div className="glass p-6 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[var(--glass)] flex items-center justify-center mb-4 border border-[var(--glass-border)] group-hover:border-[var(--accent)] transition-colors">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Coach</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">Guidance that adapts to you.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
