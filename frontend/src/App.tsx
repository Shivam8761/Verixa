import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CompanyPrepPage } from './pages/CompanyPrepPage';
import { DsaPracticePage } from './pages/DsaPracticePage';
import { CodingProblemPage } from './pages/CodingProblemPage';
import { MistakesPage } from './pages/MistakesPage';
import { ContestsPage } from './pages/ContestsPage';
import { ContestArenaPage } from './pages/ContestArenaPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AiInterviewPage } from './pages/AiInterviewPage';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage';
import { ProgressPage } from './pages/ProgressPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { PracticeQuestionPage } from './pages/PracticeQuestionPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="py-20 text-center text-slate-400 text-sm">Authenticating...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-prep"
              element={
                <ProtectedRoute>
                  <CompanyPrepPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa"
              element={
                <ProtectedRoute>
                  <DsaPracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa/problem/:id"
              element={
                <ProtectedRoute>
                  <CodingProblemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/:id"
              element={
                <ProtectedRoute>
                  <PracticeQuestionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mistakes"
              element={
                <ProtectedRoute>
                  <MistakesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contests"
              element={
                <ProtectedRoute>
                  <ContestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contests/:id"
              element={
                <ProtectedRoute>
                  <ContestArenaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute>
                  <AiAssistantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-interview"
              element={
                <ProtectedRoute>
                  <AiInterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <ResumeAnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanelPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
