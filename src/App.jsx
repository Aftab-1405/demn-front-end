import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import CreateReel from './pages/CreateReel';
import FactCheckDashboard from './pages/FactCheckDashboard';
import Analytics from './pages/Analytics';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Components
import Navbar from './components/Navbar';
import ProcessingTracker from './components/ProcessingTracker';
import InstallPWA from './components/InstallPWA';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking auth status, don't redirect yet
  if (loading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to feed if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return !isAuthenticated ? children : <Navigate to="/feed" />;
};

function AppRoutes() {
  const location = useLocation();
  const { loading } = useAuth();

  // [UPDATED] Initialization Screen without Spinner
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-body)',
        gap: 'var(--space-6)'
      }}>
        {/* Breathing Logo Animation */}
        <img
          src="/icons/icon-source.svg"
          alt="D.E.M.N Logo"
          style={{
            width: '80px',
            height: '80px',
            animation: 'pulse 2s infinite ease-in-out'
          }}
        />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          <h2 style={{
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: '600',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            Initializing D.E.M.N
          </h2>

          {/* [REMOVED] Spinner was here */}
        </div>

        {/* Inline Style for Pulse Animation */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Define routes where navbar should be hidden
  const noNavRoutes = ['/', '/login', '/register'];
  const showNavbar = !noNavRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/reel"
          element={
            <ProtectedRoute>
              <CreateReel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fact-check/:type/:id"
          element={
            <ProtectedRoute>
              <FactCheckDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <NotificationProvider>
            <AppRoutes />

            {/* Vertical Processing Tracker - Fixed Left */}
            <ProcessingTracker />

            {/* Install PWA Banner */}
            <InstallPWA />
          </NotificationProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;