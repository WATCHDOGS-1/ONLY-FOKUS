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
