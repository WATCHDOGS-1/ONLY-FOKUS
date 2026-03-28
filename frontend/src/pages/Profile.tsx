import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

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
      whileHover={{ y: -4, boxShadow: '0 0 30px rgba(124,58,237,0.2)' }} 
      className="glass"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'all 0.3s' }}
    >
      <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '14px', marginBottom: '8px' }}>{label}</span>
      <span style={{ fontSize: '30px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{count}</span>
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
    <main style={{ flex: 1, width: '100%', backgroundColor: 'var(--bg)', paddingBottom: '96px', overflowX: 'hidden' }}>
      {/* Cover Header */}
      <div style={{ height: '180px', width: '100%', background: 'linear-gradient(180deg, rgba(124,58,237,0.4) 0%, rgba(8,8,10,1) 100%)', position: 'relative' }} />

      <div style={{ maxWidth: '896px', margin: '-40px auto 0 auto', padding: '0 24px', position: 'relative', zIndex: 10, width: '100%', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginLeft: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
            {/* Overlapping Avatar */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--bg)', outline: '2px solid var(--accent)', backgroundColor: 'var(--surface)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: 'var(--accent)' }}>
                  {profile.display_name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          {!isSelf && (
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleFollowToggle}
              className={isFollowing ? 'glass' : ''}
              style={
                isFollowing ? {
                   padding: '8px 24px', borderRadius: '9999px', fontWeight: 600, color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
                } : {
                   padding: '8px 24px', borderRadius: '9999px', fontWeight: 600, color: 'white', backgroundColor: 'var(--accent)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 15px var(--accent-glow)', outline: 'none'
                }
              }
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div style={{ marginTop: '16px', marginLeft: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>{profile.display_name}</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>@{profile.username}</p>
          {profile.bio && <p style={{ color: 'var(--text)', marginTop: '16px', lineHeight: 1.6, maxWidth: '672px', margin: '16px 0 0 0' }}>{profile.bio}</p>}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '48px', width: '100%' }}>
          <CountUp value={stats.followers} label="Followers" />
          <CountUp value={stats.following} label="Following" />
          <CountUp value={stats.totalHours} label="Focus Hours" />
          <CountUp value={stats.streak} label="Streak" />
        </div>

        {/* Tabs Segment */}
        <div style={{ marginTop: '64px', width: '100%' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', gap: '32px' }}>
            {['Sessions', 'About'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ paddingBottom: '16px', fontSize: '14px', fontWeight: 600, backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', position: 'relative', transition: 'color 0.2s', color: activeTab === tab ? 'white' : 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = activeTab === tab ? 'white' : 'var(--text-muted)'}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="profile-tab" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: 'var(--accent)' }} />
                )}
              </button>
            ))}
          </div>
          
          {/* Content Area */}
          <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
             No {activeTab.toLowerCase()} data yet.
          </div>
        </div>
      </div>
    </main>
  );
}
