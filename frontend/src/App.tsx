import { ClerkProvider, SignedIn } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
