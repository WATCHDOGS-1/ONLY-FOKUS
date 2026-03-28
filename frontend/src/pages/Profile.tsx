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
      start += Math.ceil(value / 50); // Increment chunk
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 0 30px rgba(124,58,237,0.2)' }} className="glass p-6 flex flex-col items-start transition-all">
      <span className="text-[var(--text-muted)] font-medium text-sm mb-2">{label}</span>
      <span className="text-3xl font-extrabold text-white tracking-tight">{count}</span>
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
      setStats({ ...data, totalHours: 42, streak: 12 }); // Mocked derived
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

  if (loading) return null; // Using suspense fallback ideally, but fine for now
  if (!profile) return <div className="p-12 text-center text-white pt-32">Profile not found</div>;

  const isSelf = profile.clerk_id === currentUser?.id;

  return (
    <main className="flex-1 w-full bg-[var(--bg)] pb-24">
      {/* Cover Header */}
      <div className="h-[180px] w-full bg-gradient-to-b from-[var(--accent)]/40 to-transparent relative" />

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 w-full mb-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 ml-8">
          <div className="flex gap-6 items-end">
            {/* Overlapping Avatar */}
            <div className="w-[80px] h-[80px] rounded-full border-4 border-[var(--bg)] ring-2 ring-[var(--accent)] bg-[var(--surface)] shrink-0 overflow-hidden relative">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[var(--accent)]">
                  {profile.display_name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          {!isSelf && (
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                isFollowing 
                  ? 'glass hover:bg-[var(--glass-border)] text-white !border-white/20' 
                  : 'bg-[var(--accent)] text-white hover:bg-[#8B5CF6] shadow-[0_0_15px_var(--accent-glow)]'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 ml-8">
          <h1 className="text-[20px] font-bold text-white">{profile.display_name}</h1>
          <p className="text-[var(--text-muted)]">@{profile.username}</p>
          {profile.bio && <p className="text-[var(--text)] mt-4 leading-relaxed max-w-2xl">{profile.bio}</p>}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full">
          <CountUp value={stats.followers} label="Followers" />
          <CountUp value={stats.following} label="Following" />
          <CountUp value={stats.totalHours} label="Focus Hours" />
          <CountUp value={stats.streak} label="Streak" />
        </div>

        {/* Tabs Segment */}
        <div className="mt-16 w-full">
          <div className="flex border-b border-[var(--glass-border)] gap-8">
            {['Sessions', 'About'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold relative transition-colors ${activeTab === tab ? 'text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                )}
              </button>
            ))}
          </div>
          
          {/* Content Area */}
          <div className="py-16 text-center text-[var(--text-muted)]">
             No {activeTab.toLowerCase()} data yet.
          </div>
        </div>
      </div>
    </main>
  );
}
