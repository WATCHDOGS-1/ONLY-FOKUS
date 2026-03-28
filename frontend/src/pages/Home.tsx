import { useUser } from '@clerk/clerk-react';
import { Home as HomeIcon, Compass, User, Settings, Focus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useUser();

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/home', active: true },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: User, label: 'Profile', path: `/${user?.username}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 flex gap-8 min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full fixed top-24 left-max pb-8 shrink-0">
        <div className="flex flex-col gap-2 flex-1 pt-4">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold ${item.active ? 'bg-primary/10 text-primary' : 'text-[#888888] hover:text-white hover:bg-[#111111]'}`}>
              <item.icon className={`w-6 h-6 ${item.active ? 'text-primary' : 'text-[#888888]'}`} />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 lg:ml-[280px] lg:mr-[280px] min-h-full rounded-3xl bg-[#0A0A0A] border border-[#222222] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none mix-blend-overlay" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center space-y-6 z-10"
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(124,58,237,0.2)]"
          >
            <Focus className="w-12 h-12 text-primary" />
          </motion.div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Your focus journey starts here.</h1>
            <p className="text-[#888888] max-w-sm mx-auto font-medium text-lg leading-relaxed">
              No sessions yet. Let's start building your streak and leveling up today.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-sm rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:bg-[#EAEAEA] transition-all"
          >
            Start Session
          </motion.button>
        </motion.div>
      </section>

      {/* Right Sidebar Placeholder */}
      <aside className="hidden xl:flex flex-col w-64 h-[calc(100vh-120px)] fixed top-24 right-max shrink-0 bg-[#111111] rounded-2xl border border-[#222222] p-6">
        <h3 className="text-sm font-bold text-[#888888] uppercase tracking-widest mb-4">Activity Feed</h3>
        <div className="flex-1 flex items-center justify-center opacity-50">
          <p className="text-[#888888] text-sm text-center">Friends activity coming soon.</p>
        </div>
      </aside>
    </main>
  );
}
