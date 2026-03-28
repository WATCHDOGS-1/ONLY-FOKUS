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
    <div style={{ flex: 1, display: 'flex', width: '100%', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', paddingTop: '64px' }}>
      {/* Left Sidebar Fixed */}
      <aside style={{ 
        position: 'fixed', left: 'calc(max(0px, 50% - 700px))', top: '64px', bottom: 0, 
        width: '240px', display: 'flex', flexDirection: 'column', 
        padding: '32px 24px', borderRight: '1px solid rgba(255,255,255,0.04)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                className={isActive ? '' : 'hover:bg-glass hover:text-white'}
                style={{
                   display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', transition: 'all 0.2s', fontWeight: 500, textDecoration: 'none',
                   backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                   color: isActive ? 'var(--accent)' : 'var(--text-muted)'
                }}
                onMouseEnter={!isActive ? e => { e.currentTarget.style.backgroundColor = 'var(--glass)'; e.currentTarget.style.color = 'white'; } : undefined}
                onMouseLeave={!isActive ? e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } : undefined}
              >
                <item.icon style={{ width: '20px', height: '20px' }} />
                {item.label}
              </Link>
            )
          })}
        </div>
        
        <Link to={`/${user?.username}`} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none', transition: 'background-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--glass)'; (e.currentTarget.children[1].children[0] as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; (e.currentTarget.children[1].children[0] as HTMLElement).style.color = 'white'; }}
        >
          <img src={user?.imageUrl} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--glass-border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'white', transition: 'color 0.2s' }}>{user?.firstName || user?.username}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Profile</span>
          </div>
        </Link>
      </aside>

      {/* Main Container Push Right */}
      <main style={{ flex: 1, marginLeft: '240px', marginRight: '280px', padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <header style={{ marginBottom: '48px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ fontSize: '36px', fontWeight: 'bold', letterSpacing: '-0.02em', color: 'white', marginBottom: '8px', margin: 0 }}
          >
            {getGreeting()}, <span style={{ color: 'var(--accent)' }}>{user?.firstName || user?.username}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
            Ready for a deep work session?
          </motion.p>
        </header>

        <section className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '512px', margin: '0 auto', width: '100%', padding: '48px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 30px var(--accent-glow)', border: '1px solid var(--glass-border)' }}>
            <Target style={{ width: '40px', height: '40px', color: 'var(--accent)' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px', margin: 0 }}>Your focus journey starts here</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', margin: '0 0 32px 0' }}>Start your first session to see your stats</p>
          <motion.button 
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '9999px', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, outline: 'none', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8B5CF6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            Start Session
          </motion.button>
        </section>
      </main>

      {/* Right Sidebar Fixed */}
      <aside style={{ 
        position: 'fixed', right: 'calc(max(0px, 50% - 700px))', top: '64px', bottom: 0, 
        width: '280px', display: 'flex', flexDirection: 'column', 
        padding: '32px 24px', borderLeft: '1px solid rgba(255,255,255,0.04)' 
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', margin: '0 0 24px 0' }}>Leaderboard</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3].map(i => (
            <div key={i} className="glass" style={{ padding: '16px', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--surface-2)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '12px', width: '64px', backgroundColor: 'var(--surface-2)', borderRadius: '4px' }} />
                <div style={{ height: '8px', width: '40px', backgroundColor: 'var(--surface-2)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top {i}</span>
            </div>
          ))}
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '24px', margin: '24px 0 0 0' }}>Coming soon</p>
        </div>
      </aside>
    </div>
  );
}
