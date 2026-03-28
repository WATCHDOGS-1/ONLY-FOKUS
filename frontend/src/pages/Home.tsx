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
        padding: '120px 24px 32px 24px', borderRight: '1px solid rgba(255,255,255,0.02)',
        background: 'rgba(5,10,3,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                className="group"
                style={{
                   display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', transition: 'all 0.2s', fontWeight: 600, textDecoration: 'none',
                   backgroundColor: isActive ? 'rgba(132,204,22,0.08)' : 'transparent',
                   color: isActive ? '#A3E635' : '#4D5C35',
                   borderLeft: isActive ? '3px solid #84CC16' : '3px solid transparent',
                   cursor: 'none'
                }}
                onMouseEnter={!isActive ? e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = '#ECFCCB'; } : undefined}
                onMouseLeave={!isActive ? e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4D5C35'; } : undefined}
              >
                <item.icon style={{ width: '20px', height: '20px' }} />
                {item.label}
              </Link>
            )
          })}
        </div>
        
        <Link to={`/${user?.username}`} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', textDecoration: 'none', transition: 'background-color 0.2s', cursor: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; (e.currentTarget.children[1].children[0] as HTMLElement).style.color = '#A3E635'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; (e.currentTarget.children[1].children[0] as HTMLElement).style.color = '#ECFCCB'; }}
        >
          <div style={{ padding: '2px', borderRadius: '50%', background: 'linear-gradient(135deg, #A3E635, #D97706)' }}>
            <img src={user?.imageUrl} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(5,10,3,1)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ECFCCB', transition: 'color 0.2s' }}>{user?.firstName || user?.username}</span>
            <span style={{ fontSize: '12px', color: '#4D5C35' }}>Profile</span>
          </div>
        </Link>
      </aside>

      {/* Main Container Push Right */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '120px 60px 60px 60px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10, maxWidth: '1000px' }}>
        <header style={{ marginBottom: '80px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ECFCCB', marginBottom: '8px', margin: 0 }}
          >
            {getGreeting()}, <span style={{ color: 'white', fontWeight: 800 }}>{user?.firstName || user?.username}</span> <span style={{ color: '#84CC16' }}>✦</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: '#4D5C35', fontSize: '16px', margin: '12px 0 0 0', fontWeight: 500 }}>
            Ready for a deep work session?
          </motion.p>
        </header>

        <section style={{ ...glassStyle, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '640px', width: '100%', padding: '60px 80px' }}>
          <IridescentOverlay />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: 'rgba(132,204,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 0 60px rgba(132,204,22,0.4)', border: '1px solid rgba(163,230,53,0.2)' }}>
              <Target style={{ width: '36px', height: '36px', color: '#A3E635' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ECFCCB', marginBottom: '16px', margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>Your focus journey starts here</h2>
            <p style={{ color: '#4D5C35', marginBottom: '48px', margin: '0 0 48px 0', fontSize: '15px' }}>Start your first session to let the nebula guide your stats.</p>
            <motion.button 
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 32px', borderRadius: '9999px', background: 'linear-gradient(135deg, #65A30D, #84CC16)', color: '#050A03', fontWeight: 700, outline: 'none', border: 'none', cursor: 'none', transition: 'box-shadow 0.2s', boxShadow: '0 0 40px rgba(132,204,22,0.3)', fontSize: '15px', letterSpacing: '0.01em' }}
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
