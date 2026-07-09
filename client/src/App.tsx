import { useState, useEffect } from 'react';
import './index.css';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';

import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { WeekendScreen } from './components/WeekendScreen';
import { ToastContainer } from './components/Toast';
import { AuthGuard } from './components/AuthGuard';
import { useAuthStore } from './store/useAuthStore';
import { useParkingStore } from './store/useParkingStore';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { useAppStore } from './store/useAppStore';
import { ProfilePage } from './pages/ProfilePage';

type AuthView = 'login' | 'forgot-password';

function AppContent() {
  const { role } = useAuthStore();
  const { isWeekend, fetchStatus } = useParkingStore();
  const { currentView } = useAppStore();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (currentView === 'profile') {
    return <ProfilePage />;
  }

  if (role === 'hr') {
    return <AdminDashboardPage />;
  }

  if (isWeekend) {
    return <WeekendScreen />;
  }

  return <DashboardPage />;
}

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [authView, setAuthView] = useState<AuthView>('login');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    const handleNavigate = (view: 'login' | 'signup' | 'forgot-password') => {
      if (view === 'signup') {
        setAuthView('activate');
      } else if (view === 'forgot-password') {
        setAuthView('forgot-password');
      } else {
        setAuthView('login');
      }
    };

    return (
      <>
        {authView === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {authView === 'forgot-password' && <ForgotPasswordPage onNavigate={handleNavigate} />}
        <ToastContainer />
      </>
    );
  }

  return (
    <AuthGuard>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8F9FA' }}>
        <Navbar />

        <AppContent />

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid #E4E7EC',
            background: '#FFFFFF',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'auto',
          }}
        >
          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Quadrant Parking System · Internal Use Only
          </p>
        </footer>

        <ToastContainer />
        <ChangePasswordModal />
      </div>
    </AuthGuard>
  );
}

export default App;
