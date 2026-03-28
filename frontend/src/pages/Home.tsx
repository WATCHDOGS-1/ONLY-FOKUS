import { useUser } from '@clerk/clerk-react';
import { Home as HomeIcon, Compass, Target, StickyNote, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { glassStyle, IridescentOverlay } from './Landing';

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
    <div style={{ flex: 1, display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* Left Sidebar Fixed */}
      <aside style={{ 
        position: 'fixed', left: 0, top: 0, bottom: 0, 
        width: '240px', display: 'flex', flexDirection: 'column', 
        padding: '100px 24px 32px 24px', borderRight: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8,7,15,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                style={{
                   display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', transition: 'all 0.2s', fontWeight: 600, textDecoration: 'none',
                   backgroundColor: isActive ? 'rgba(147,51,234,0.15)' : 'transparent',
                   color: isActive ? '#A78BFA' : 'var(--text-muted)'
                }}
                onMouseEnter={!isActive ? e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'white'; } : undefined}
                onMouseLeave={!isActive ? e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } : undefined}
              >
                <item.icon style={{ width: '20px', height: '20px' }} />
                {item.label}
              </Link>
            )
          })}
        </div>
        
        <Link to={`/${user?.username}`} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', textDecoration: 'none', transition: 'background-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; (e.currentTarget.children[1].children[0] as HTMLElement).style.color = '#A78BFA'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; (e.currentTarget.children[1].children[0] as HTMLElement).style.color = 'white'; }}
        >
          <div style={{ padding: '2px', borderRadius: '50%', background: 'linear-gradient(135deg, #9333EA, #EC4899)' }}>
            <img src={user?.imageUrl} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(8,7,15,1)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'white', transition: 'color 0.2s' }}>{user?.firstName || user?.username}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Profile</span>
          </div>
        </Link>
      </aside>

      {/* Main Container Push Right */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '120px 60px 60px 60px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10, maxWidth: '1200px' }}>
        <header style={{ marginBottom: '60px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: 'white', marginBottom: '8px', margin: 0 }}
          >
            {getGreeting()}, <span style={{ color: '#F0EAFF', fontWeight: 800 }}>{user?.firstName || user?.username}</span> <span style={{ color: '#9333EA' }}>✦</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: 'var(--text-muted)', fontSize: '16px', margin: '8px 0 0 0' }}>
            Ready for a deep work session?
          </motion.p>
        </header>

        <section style={{ ...glassStyle, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '600px', width: '100%', padding: '60px' }}>
          <IridescentOverlay />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(147,51,234,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 0 60px rgba(147,51,234,0.6)', border: '1px solid rgba(147,51,234,0.3)' }}>
              <Target style={{ width: '36px', height: '36px', color: '#C084FC' }} />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', marginBottom: '12px', margin: 0 }}>Your focus journey starts here</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', margin: '0 0 40px 0', fontSize: '16px' }}>Start your first session to see your cosmic stats unfold.</p>
            <motion.button 
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '9999px', background: 'linear-gradient(135deg, #7C3AED, #9333EA)', color: 'white', fontWeight: 600, outline: 'none', border: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 0 30px rgba(147,51,234,0.4)', fontSize: '16px' }}
            >
              <Plus style={{ width: '20px', height: '20px' }} />
              Start Session
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}
