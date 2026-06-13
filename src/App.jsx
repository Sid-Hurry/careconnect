/* eslint-disable react/prop-types */
import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { GlobalProvider, useGlobalContext } from './context/Context';

// Components
import Home from './components/Home';
import Login from './components/Login';
import Layout from './components/Layout';
import Overview from './components/Overview';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Inventory from './components/Inventory';
import OPDQueue from './components/OPDQueue';
import Beds from './components/Beds';
import Admissions from './components/Admissions';
import AlertCenter from './components/AlertCenter';
import Notices from './components/Notices';
import About from './components/About';
import InProgress from './components/InProgress';
import PrivacyPolicy from './components/PrivacyPolicy';
import Contact from './components/Contact';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useGlobalContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route Guard based on Role permissions (RBAC)
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useGlobalContext();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/About',
      element: <About />
    },
    {
      path: '/privacy',
      element: <PrivacyPolicy />
    },
    {
      path: '/contact',
      element: <Contact />
    },
    // Authenticated routes wrapped in ProtectedRoute and Layout
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Layout>
            <Overview />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/patients',
      element: (
        <ProtectedRoute>
          <Layout>
            <Patients />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/opd-queue',
      element: (
        <ProtectedRoute>
          <Layout>
            <OPDQueue />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/beds',
      element: (
        <ProtectedRoute>
          <Layout>
            <Beds />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/admissions',
      element: (
        <ProtectedRoute>
          <Layout>
            <Admissions />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/inventory',
      element: (
        <ProtectedRoute>
          <Layout>
            <Inventory />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/alerts',
      element: (
        <ProtectedRoute>
          <Layout>
            <AlertCenter />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/notices',
      element: (
        <ProtectedRoute>
          <Layout>
            <Notices />
          </Layout>
        </ProtectedRoute>
      )
    },
    // Doctor & Management exclusive staff list
    {
      path: '/doctors',
      element: (
        <ProtectedRoute>
          <RoleRoute allowedRoles={['Management', 'Doctor']}>
            <Layout>
              <Doctors />
            </Layout>
          </RoleRoute>
        </ProtectedRoute>
      )
    },
    // Redirects for legacy routes to prevent broken links
    {
      path: '/Mangement-Login',
      element: <Navigate to="/login" replace />
    },
    {
      path: '/Doctor-Login',
      element: <Navigate to="/login" replace />
    },
    {
      path: '/Staff-Login',
      element: <Navigate to="/login" replace />
    },
    {
      path: '/Doctor-Login/in-progress',
      element: <InProgress />
    },
    {
      path: '/Mangement-Login/Dashboard/overview',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '/Mangement-Login/Dashboard/patients',
      element: <Navigate to="/patients" replace />
    },
    {
      path: '/Mangement-Login/Dashboard/doctors',
      element: <Navigate to="/doctors" replace />
    },
    {
      path: '/Mangement-Login/Dashboard/inventory',
      element: <Navigate to="/inventory" replace />
    },
    // Fallback redirect
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  );
}

export default App;
