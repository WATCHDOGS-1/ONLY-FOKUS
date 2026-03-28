import { UserButton, useUser, useAuth } from '@clerk/clerk-react';
import { Focus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  
  return (
    <nav className="glass-nav sticky top-0 bg-[#0A0A0A]/50 backdrop-blur-xl border-b border-[#222222] z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Focus className="w-5 h-5 text-primary" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-primary transition-colors">OnlyFocus</span>
        </Link>
        
        {isSignedIn && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary-foreground">
            <Link to="/home" className="hover:text-white transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <Link to={`/${user?.username}`} className="hover:text-white transition-colors">Profile</Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{ elements: { avatarBox: "w-9 h-9 border border-[#222222] shadow-sm shadow-primary/10" } }} 
            />
          ) : (
            <Link to="/" className="text-sm font-semibold hover:text-primary transition-colors text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
