import { useUser } from '@clerk/clerk-react';
import { Home as HomeIcon, Compass, Target, StickyNote, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
  const { user } = useUser();
  const location = useLocation();

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/home' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Target, label: 'Rooms', path: '/rooms' },
    { icon: StickyNote, label: 'Notes', path: '/notes' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 flex w-full max-w-[1400px] mx-auto min-h-screen pt-16">
      {/* Left Sidebar Fixed */}
      <aside className="fixed left-0 lg:left-[calc(50%-700px)] w-[240px] top-16 bottom-0 hidden lg:flex flex-col py-8 px-6 border-r border-[var(--glass-border)]/50">
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--glass)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
        
        <Link to={`/${user?.username}`} className="mt-auto flex items-center gap-3 group px-2 hover:bg-[var(--glass)] p-2 rounded-lg transition-colors">
          <img src={user?.imageUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-[var(--glass-border)]" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors">{user?.firstName || user?.username}</span>
            <span className="text-xs text-[var(--text-muted)]">Profile</span>
          </div>
        </Link>
      </aside>

      {/* Main Container Push Right */}
      <main className="flex-1 lg:ml-[240px] xl:mr-[280px] p-6 lg:p-10 flex flex-col">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
          >
            {getGreeting()}, <span className="text-[var(--accent)]">{user?.firstName || user?.username}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[var(--text-muted)] font-medium">
            Ready for a deep work session?
          </motion.p>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full glass p-12">
          <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-6 shadow-[0_0_30px_var(--accent-glow)] border border-[var(--glass-border)]">
            <Target className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your focus journey starts here</h2>
          <p className="text-[var(--text-muted)] mb-8">Start your first session to see your stats</p>
          <motion.button 
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[#8B5CF6] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Start Session
          </motion.button>
        </section>
      </main>

      {/* Right Sidebar Fixed */}
      <aside className="fixed right-0 lg:right-[calc(50%-700px)] w-[280px] top-16 bottom-0 hidden xl:flex flex-col py-8 px-6 border-l border-[var(--glass-border)]/50">
        <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider mb-6">Leaderboard</h3>
        
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass p-4 opacity-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-[var(--surface-2)] rounded" />
                <div className="h-2 w-10 bg-[var(--surface-2)] rounded" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">Top {i}</span>
            </div>
          ))}
          <p className="text-xs text-[var(--text-muted)] text-center mt-6">Coming soon</p>
        </div>
      </aside>
    </div>
  );
}
