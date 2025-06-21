import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import TrainersPage from './pages/TrainersPage';
import SocietyPage from './pages/SocietyPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthRoute from './components/routes/AuthRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/trainers" element={<TrainersPage />} />
                <Route path="/society" element={<SocietyPage />} />
              </Route>
            </Route>

            {/* Redirect to dashboard by default if logged in */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;