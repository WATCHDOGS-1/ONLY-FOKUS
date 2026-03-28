import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { glassStyle, IridescentOverlay } from './Landing';

const CountUp = ({ value, label }: { value: number, label: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    if (value === 0) return;
    
    const incrementTime = Math.max(10, duration / value);
    const timer = setInterval(() => {
      start += Math.ceil(value / 50);
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 0 30px rgba(132,204,22,0.2)' }} 
      style={{ ...glassStyle, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'all 0.4s ease' }}
    >
      <IridescentOverlay />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <span style={{ color: '#4D5C35', fontWeight: 700, fontSize: '12px', marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        <span style={{ 
          fontSize: '42px', fontWeight: 800, background: 'linear-gradient(135deg, #ECFCCB 0%, #A3E635 100%)', 
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', display: 'block' 
        }}>
          {count}
        </span>
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const { getToken } = useAuth();
  const { user: currentUser } = useUser();
  
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, totalHours: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Sessions');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${username}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        fetchStats(data.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/follow/${id}/stats`);
    if (res.ok) {
      const data = await res.json();
      setStats({ ...data, totalHours: 42, streak: 12 });
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) return;
    const token = await getToken();
    const endpoint = isFollowing ? 'DELETE' : 'POST';
    
    setStats(prev => ({ ...prev, followers: isFollowing ? prev.followers - 1 : prev.followers + 1}));
    setIsFollowing(!isFollowing);

    await fetch(`${import.meta.env.VITE_API_URL}/api/follow/${profile.id}`, {
      method: endpoint,
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  if (loading) return null;
  if (!profile) return <div style={{ padding: '48px', textAlign: 'center', color: 'white', paddingTop: '128px' }}>Profile not found</div>;

  const isSelf = profile.clerk_id === currentUser?.id;

  return (
    <main style={{ flex: 1, width: '100%', paddingBottom: '96px', overflowX: 'hidden', position: 'relative' }}>
      {/* Cover Header */}
      <div style={{ height: '220px', width: '100%', background: 'linear-gradient(135deg, rgba(132,204,22,0.25), rgba(217,119,6,0.15), transparent)', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.02)' }} />

      <div style={{ maxWidth: '1000px', margin: '-56px auto 0 auto', padding: '0 32px', position: 'relative', zIndex: 10, width: '100%', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
            {/* Overlapping Avatar */}
            <div style={{ width: '112px', height: '112px', borderRadius: '50%', border: '4px solid #050A03', outline: '3px solid #84CC16', backgroundColor: 'var(--surface)', flexShrink: 0, overflow: 'hidden', position: 'relative', boxShadow: '0 0 30px rgba(132,204,22,0.4)' }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '32px', color: '#84CC16' }}>
                  {profile.display_name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          {!isSelf && (
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleFollowToggle}
              style={
                isFollowing ? {
                   ...glassStyle, padding: '12px 32px', borderRadius: '9999px', fontWeight: 700, color: '#ECFCCB', border: '1px solid rgba(163,230,53,0.3)', cursor: 'none', transition: 'all 0.2s', outline: 'none'
                } : {
                   padding: '12px 32px', borderRadius: '9999px', fontWeight: 700, color: '#050A03', background: 'linear-gradient(135deg, #65A30D, #84CC16)', border: 'none', cursor: 'none', transition: 'all 0.2s', boxShadow: '0 0 30px rgba(132,204,22,0.4)', outline: 'none'
                }
              }
            >
              {isFollowing && <IridescentOverlay />}
              <span style={{ position: 'relative', zIndex: 10, letterSpacing: '0.01em' }}>{isFollowing ? 'Following' : 'Follow'}</span>
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div style={{ marginTop: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ECFCCB', margin: 0, letterSpacing: '-0.02em' }}>{profile.display_name}</h1>
          <p style={{ color: '#A3E635', fontWeight: 600, margin: '6px 0 0 0', fontSize: '15px' }}>@{profile.username}</p>
          {profile.bio && <p style={{ color: 'var(--text-muted)', marginTop: '24px', lineHeight: 1.6, maxWidth: '700px', margin: '24px 0 0 0', fontSize: '15px' }}>{profile.bio}</p>}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '56px', width: '100%' }}>
          <CountUp value={stats.followers} label="Followers" />
          <CountUp value={stats.following} label="Following" />
          <CountUp value={stats.totalHours} label="Focus Hours" />
          <CountUp value={stats.streak} label="Streak" />
        </div>

        {/* Tabs Segment */}
        <div style={{ marginTop: '80px', width: '100%' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', gap: '48px' }}>
            {['Sessions', 'About'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ paddingBottom: '16px', fontSize: '14px', fontWeight: 700, backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'none', position: 'relative', transition: 'color 0.2s', color: activeTab === tab ? '#ECFCCB' : '#4D5C35', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ECFCCB'}
                onMouseLeave={e => e.currentTarget.style.color = activeTab === tab ? '#ECFCCB' : '#4D5C35'}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="profile-tab" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#84CC16', boxShadow: '0 0 10px rgba(132,204,22,0.5)' }} />
                )}
              </button>
            ))}
          </div>
          
          {/* Content Area */}
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#4D5C35', fontSize: '16px' }}>
             No {activeTab.toLowerCase()} data yet.
          </div>
        </div>
      </div>
    </main>
  );
}
