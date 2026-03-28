import { ClerkProvider, SignedIn } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex-1 flex flex-col w-full h-full"
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/setup" element={<PageWrapper><Setup /></PageWrapper>} />
        
        <Route path="/home" element={
          <SignedIn>
            <PageWrapper>
              <Navbar />
              <Home />
            </PageWrapper>
          </SignedIn>
        } />
        <Route path="/:username" element={
          <PageWrapper>
            <Navbar />
            <Profile />
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}
