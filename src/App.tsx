import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { CenterProvider } from './contexts/CenterContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import TrainersPage from './pages/TrainersPage';
import MembershipsPage from './pages/MembershipsPage';
import EventsPage from './pages/EventsPage';
import CenterPage from './pages/CenterPage';
import DietPlansPage from './pages/DietPlansPage';
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';
import BulkMembersPage from './pages/BulkMembersPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthRoute from './components/routes/AuthRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/ui/Toast';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <CenterProvider>
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
                  <Route path="/memberships" element={<MembershipsPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/diet-plans" element={<DietPlansPage />} />
                  <Route path="/center" element={<CenterPage />} />
                  <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
                  <Route path="/bulk-members" element={<BulkMembersPage />} />
                </Route>
              </Route>

              {/* Redirect to dashboard by default if logged in */}
              <Route path="/" element={<Navigate to="/members" replace />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <Toast />
        </CenterProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;