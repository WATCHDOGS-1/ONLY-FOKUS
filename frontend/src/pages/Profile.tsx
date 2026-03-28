import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const { getToken, userId: clerkId } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  // Optimistic tracking of whether current user is following this profile
  const [isFollowing, setIsFollowing] = useState(false); 

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
      setStats(await res.json());
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) return;
    const token = await getToken();
    const endpoint = isFollowing ? 'DELETE' : 'POST';
    
    // Optimistic UI updates
    setStats(prev => ({ ...prev, followers: isFollowing ? prev.followers - 1 : prev.followers + 1}));
    setIsFollowing(!isFollowing);

    await fetch(`${import.meta.env.VITE_API_URL}/api/follow/${profile.id}`, {
      method: endpoint,
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center">Profile not found</div>;

  const isSelf = profile.clerk_id === clerkId;

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback className="text-2xl font-semibold bg-secondary text-primary">
              {profile.display_name?.charAt(0) || profile.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{profile.display_name || profile.username}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
            <div className="flex items-center gap-4 text-sm mt-2 text-muted-foreground">
              <span className="flex items-center gap-1"><strong className="text-foreground">{stats.following}</strong> Following</span>
              <span className="flex items-center gap-1"><strong className="text-foreground">{stats.followers}</strong> Followers</span>
            </div>
          </div>
        </div>

        {!isSelf && (
          <Button 
            variant={isFollowing ? "outline" : "default"} 
            className="w-full sm:w-auto font-semibold px-8"
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>

      <div className="py-6 space-y-4">
        {profile.bio && <p className="text-lg leading-relaxed">{profile.bio}</p>}
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Calendar className="w-4 h-4" />
          <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
    </main>
  );
}
