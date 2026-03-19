import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Slots from './pages/Slots';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" /></div>;
  return token ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  if (!user) return null;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        location.pathname === to
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            ParkHub
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLink('/slots', 'Slots')}
            {navLink('/bookings', 'My Bookings')}
            {user.role === 'admin' && navLink('/admin', 'Admin')}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{user.username}</span>
          {user.role === 'admin' && (
            <span className="badge badge-warning">Admin</span>
          )}
          <button onClick={logout} className="btn-secondary text-xs px-3 py-1.5">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" /></div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/slots" element={<ProtectedRoute><Slots /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/" element={user ? <Navigate to="/slots" /> : <Landing />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
