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
