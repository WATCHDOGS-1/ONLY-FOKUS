import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Focus, Flame, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const CountUp = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1000;
    const incrementTime = (duration / end) * 5;
    const timer = setInterval(() => {
      start += 1;
      setCount(prev => Math.min(prev + 1, end));
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
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
      setStats({ ...data, totalHours: 24, streak: 5 }); // Mocked derived stats
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

  if (loading) return <div className="p-8 text-center text-secondary-foreground animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-white">Profile not found</div>;

  const isSelf = profile.clerk_id === currentUser?.id;

  return (
    <main className="flex-1 w-full bg-[#0A0A0A] pb-24">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-b from-primary/40 via-[#111111] to-[#0A0A0A] relative border-b border-[#222222]">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none mix-blend-overlay" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-[#0A0A0A] ring-4 ring-primary/50 shadow-2xl bg-card">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback className="text-4xl font-black bg-[#111111] text-primary">
                {profile.display_name?.charAt(0) || profile.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 mb-2 text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">{profile.display_name || profile.username}</h1>
              <p className="text-[#888888] font-medium text-lg">@{profile.username}</p>
            </div>
          </motion.div>

          {!isSelf && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center md:justify-end md:mb-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowToggle}
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  isFollowing 
                    ? 'bg-transparent border border-[#222222] text-[#888888] hover:bg-[#111111] hover:text-white' 
                    : 'bg-primary border border-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:bg-primary/90'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </motion.button>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mt-8 space-y-6">
          {profile.bio && <p className="text-[#EAEAEA] text-lg leading-relaxed max-w-2xl text-center md:text-left">{profile.bio}</p>}
          <div className="flex items-center justify-center md:justify-start text-sm font-semibold text-[#888888] gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Followers', value: stats.followers, icon: User },
            { label: 'Following', value: stats.following, icon: User },
            { label: 'Focus Hours', value: stats.totalHours, icon: Clock },
            { label: 'Streak', value: stats.streak, icon: Flame }
          ].map((stat, i) => (
            <div key={i} className="card-hover p-6 flex flex-col items-center md:items-start text-center md:text-left group relative">
              <span className="text-secondary-foreground font-semibold text-sm mb-2 uppercase tracking-wider">{stat.label}</span>
              <span className="text-3xl font-black text-white group-hover:text-primary transition-colors">
                <CountUp value={stat.value} />
              </span>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
          <div className="flex border-b border-[#222222]">
            {['Sessions', 'About'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-6 font-bold text-lg transition-colors relative ${activeTab === tab ? 'text-white' : 'text-[#888888] hover:text-[#EAEAEA]'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                )}
              </button>
            ))}
          </div>
          
          <div className="py-12 flex flex-col items-center justify-center opacity-50 space-y-4">
             <Focus className="w-12 h-12 text-[#888888]" />
             <p className="text-[#888888] font-medium text-lg text-center">No {activeTab.toLowerCase()} data available yet.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// Ensure User is imported for stats
