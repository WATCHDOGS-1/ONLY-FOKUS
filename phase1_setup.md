# OnlyFocus Phase 1 Setup Guide

This guide contains the exact step-by-step instructions, folder structure, and code files to get your OnlyFocus app running locally with React, Vite, Node/Express, PostgreSQL (Neon), and Clerk.

## 📂 Folder Structure
```text
ONLY-FOKUS/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts          # Express server & Routes
│   │   ├── db/
│   │   │   ├── index.ts      # Neon PG Connection
│   │   │   └── schema.sql    # Neon DB Schema Let's
│   └── .env                  # Backend secrets
├── frontend/                 # Created via Vite
│   ├── package.json          
│   ├── tailwind.config.js    # Shadcn UI config
│   ├── vite.config.ts        
│   ├── src/
│   │   ├── App.tsx           # Routes & Clerk Provider
│   │   ├── index.css         # Tailwind & Shadcn Base
│   │   ├── lib/utils.ts      # Tailwind Merge utility
│   │   ├── pages/
│   │   │   ├── Landing.tsx   # Login Page
│   │   │   ├── Setup.tsx     # Profile creation page
│   │   │   ├── Home.tsx      # Dashboard space
│   │   │   └── Profile.tsx   # Public profile view
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn components (button, input, avatar)
│   │   │   └── Navbar.tsx    # App navigation
│   └── .env.local            # Frontend Clerk keys
```

---

## 🚀 Step 1: Database Setup (Neon)

1. Create a project in [Neon Postgres](https://neon.tech/).
2. Get your connection string (`DATABASE_URL`).
3. Note: The backend schema has already been written to `backend/src/db/schema.sql` in your workspace. You can execute this schema in your Neon SQL editor to create your tables.

---

## 🚀 Step 2: Backend Setup
The backend files have already been initialized in your workspace! You just need to install the dependencies and run it.

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
   
2. Create a `.env` file in `backend/`:
   ```env
   DATABASE_URL="postgres://user:password@ep-cool-db.neon.tech/neondb?sslmode=require"
   CLERK_SECRET_KEY="sk_test_..."
   PORT=8000
   ```

3. Start the server:
   ```bash
   npm run dev
   ```
   *Server runs on http://localhost:8000*

---

## 🚀 Step 3: Frontend Initialization

We will use Vite, Tailwind, Shadcn, and Clerk. From your `ONLY-FOKUS` root folder:

```bash
# 1. Create vite app
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# 2. Install dependencies (React Router, Clerk, Lucide Icons)
npm install @clerk/clerk-react react-router-dom lucide-react

# 3. Add Tailwind CSS and Shadcn UI (follow prompts: yes to all defaults, use CSS variables)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i -D @types/node
```

Setup Shadcn config aliases in `frontend/tsxconfig.json` inside compilerOptions:
```json
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
```

Configure Vite aliases in `frontend/vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Now initialize Shadcn UI:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input avatar label
```

Create `frontend/.env.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8000
```

---

## 💻 Step 4: Frontend Code Files

### `src/index.css` (Deep Violet Dark Mode Theme)
Update your base css with exact styling required.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 4%;
    --foreground: 0 0% 98%;
    /* Deep Violet #7C3AED */
    --primary: 262 80% 50%;
    --primary-foreground: 0 0% 100%;
    --card: 240 10% 6%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 6%;
    --popover-foreground: 0 0% 98%;
    --secondary: 240 4% 16%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 4% 16%;
    --muted-foreground: 240 5% 65%;
    --accent: 262 80% 50%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 4% 16%;
    --input: 240 4% 16%;
    --ring: 262 80% 50%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body, html {
    @apply bg-background text-foreground;
  }
}
```

### `src/App.tsx`
Handles routing and global Clerk provider.

```tsx
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<Setup />} />
            
            <Route path="/home" element={
              <SignedIn>
                <Navbar />
                <Home />
              </SignedIn>
            } />
            <Route path="/:username" element={
              <>
                <Navbar />
                <Profile />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}
```

### `src/components/Navbar.tsx`
```tsx
import { UserButton, useUser } from '@clerk/clerk-react';
import { Focus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user } = useUser();
  
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <Focus className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">OnlyFocus</span>
        </Link>
        
        {user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
}
```

### `src/pages/Landing.tsx`
```tsx
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Focus className="w-16 h-16 text-primary" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">OnlyFocus</h1>
          <p className="text-muted-foreground text-lg">Deep work made social.</p>
        </div>
        
        <SignInButton mode="modal" fallbackRedirectUrl="/setup">
          <Button size="lg" className="w-full font-semibold">
            Get Started
          </Button>
        </SignInButton>
      </div>
    </main>
  );
}
```

### `src/pages/Setup.tsx`
```tsx
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
```

### `src/pages/Home.tsx`
```tsx
export default function Home() {
  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Empty</h1>
        <p className="text-muted-foreground">Focus sessions will appear here.</p>
      </div>
    </main>
  );
}
```

### `src/pages/Profile.tsx`
```tsx
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
```

## 🏃‍♂️ Step 5: Run Everything

1. **Backend**: Open terminal, inside `backend/` folder start `npm run dev`.
2. **Frontend**: Open a second terminal, inside `frontend/` folder run `npm run dev`.
3. Open `http://localhost:5173`. If everything is set up, you'll see your deep violet, dark mode only, Linear-style landing page. Click Get Started!
