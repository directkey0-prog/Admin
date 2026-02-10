import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAdminAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Approvals from './pages/admin/Approvals';
import Properties from './pages/admin/Properties';
import Users from './pages/admin/Users';
import Transactions from './pages/admin/Transactions';
import Settings from './pages/admin/Settings';

const ProtectedLayout = () => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  if (admin) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pending" element={<Approvals />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/users" element={<Users />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <BackToTop />
      </AuthProvider>
    </Router>
  );
}

export default App;
