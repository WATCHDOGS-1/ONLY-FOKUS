import { ClerkProvider, SignedIn } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NebulaBackground from './components/NebulaBackground';
import CursorTrail from './components/CursorTrail';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense } from 'react';

import './index.css';
import Navbar from './components/Navbar';

// Lazy loading pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Setup = React.lazy(() => import('./pages/Setup'));
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }
} as const;

const LoadingFallback = () => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent' }} className="animate-spin" />
  </div>
);

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants as any}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Suspense fallback={<LoadingFallback />}><Landing /></Suspense></PageWrapper>} />
        <Route path="/setup" element={<PageWrapper><Suspense fallback={<LoadingFallback />}><Setup /></Suspense></PageWrapper>} />
        
        <Route path="/home" element={
          <SignedIn>
            <PageWrapper>
              <Navbar />
              <Suspense fallback={<LoadingFallback />}><Home /></Suspense>
            </PageWrapper>
          </SignedIn>
        } />
        <Route path="/:username" element={
          <PageWrapper>
            <Navbar />
            <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>
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
        <NebulaBackground />
        <CursorTrail />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}
