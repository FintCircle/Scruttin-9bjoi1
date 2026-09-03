import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import OnboardingFlow from '@/components/features/OnboardingFlow';
import Discover from '@/pages/Discover';
import Tagged from '@/pages/Tagged';
import QA from '@/pages/QA';
import Create from '@/pages/Create';
import Profile from '@/pages/Profile';
import ProjectPage from '@/pages/ProjectPage';
import NotFound from '@/pages/NotFound';
import { useOnboarding } from '@/hooks/useOnboarding';

function AppContent() {
  const { profile } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(!profile.completed);

  return (
    <div className="min-h-screen bg-[hsl(36,33%,97%)]">
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      {!showOnboarding && (
        <>
          <Navbar />
          <main className="lg:ml-64 pb-20 lg:pb-8 pt-16 lg:pt-0">
            <div className="max-w-2xl mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Navigate to="/discover" replace />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/tagged" element={<Tagged />} />
                <Route path="/qa" element={<QA />} />
                <Route path="/create" element={<Create />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
