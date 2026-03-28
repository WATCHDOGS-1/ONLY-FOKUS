import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Setup() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', displayName: '', bio: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          display_name: formData.displayName,
          bio: formData.bio
        })
      });

      if (res.ok) {
        navigate('/home');
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Set up your profile</h1>
          <p className="text-sm text-muted-foreground">Pick a unique username to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              required 
              placeholder="e.g. aditya" 
              value={formData.username}
              onChange={(e) => setFormData(p => ({...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')}))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input 
              id="displayName" 
              placeholder="Aditya" 
              value={formData.displayName}
              onChange={(e) => setFormData(p => ({...p, displayName: e.target.value}))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input 
              id="bio" 
              placeholder="Building Phase 1..." 
              value={formData.bio}
              onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </form>
      </div>
    </main>
  );
}
