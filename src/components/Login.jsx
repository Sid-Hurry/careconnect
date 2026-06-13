import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';

const Login = () => {
  // Portal selection state - default to Management for instant usability
  const [selectedPortal, setSelectedPortal] = useState('Management'); // 'Management', 'Doctor', 'Nurse', 'Reception Staff'
  
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  
  const { login } = useGlobalContext();
  const navigate = useNavigate();

  const portals = [
    {
      id: 'Management',
      title: 'Management Console',
      description: 'Hospital analytics, administrative controls, and staff roster controls.',
      defaultEmail: 'admin@careconnect.com',
      defaultPassword: 'admin123'
    },
    {
      id: 'Doctor',
      title: 'Clinician Portal',
      description: 'Outpatient queue ticketing, vitals logs, and dispatch notifications.',
      defaultEmail: 'doctor@careconnect.com',
      defaultPassword: 'doctor123'
    },
    {
      id: 'Nurse',
      title: 'Ward Operations',
      description: 'Bed occupancy allocations, nursing duties, and consumables inventory drawing.',
      defaultEmail: 'nurse@careconnect.com',
      defaultPassword: 'nurse123'
    },
    {
      id: 'Reception Staff',
      title: 'Intake & Reception',
      description: 'Patient queue ticketing, medical registration, and bed intake requests.',
      defaultEmail: 'reception@careconnect.com',
      defaultPassword: 'reception123'
    }
  ];

  const performManualOfflineSignIn = (portal) => {
    const matchedMockUser = {
      id: portal.id === 'Management' ? 'u1' : portal.id === 'Doctor' ? 'u2' : portal.id === 'Nurse' ? 'u4' : 'u6',
      name: portal.id === 'Management' ? 'Dr. Arthur Pendelton' : portal.id === 'Doctor' ? 'Dr. Evelyn Smith' : portal.id === 'Nurse' ? 'Sarah Connor, RN' : 'Jane Doe',
      email: portal.defaultEmail,
      role: portal.id,
      department: portal.id === 'Management' ? 'Administration' : portal.id === 'Doctor' ? 'Cardiology' : portal.id === 'Nurse' ? 'Critical Care' : 'OPD Desk'
    };
    const fakeToken = `offline_token_${matchedMockUser.role}_${matchedMockUser.email}`;
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(matchedMockUser));
    window.location.href = '/dashboard';
  };

  const handleAutoFill = async () => {
    const portal = portals.find(p => p.id === selectedPortal);
    if (portal) {
      setEmail(portal.defaultEmail);
      setPassword(portal.defaultPassword);
      
      setError('');
      setSuccessMessage('');
      setLoadingState(true);

      try {
        const result = await login(portal.defaultEmail, portal.defaultPassword);
        if (result.success) {
          navigate('/dashboard');
        } else {
          performManualOfflineSignIn(portal);
        }
      } catch {
        performManualOfflineSignIn(portal);
      } finally {
        setLoadingState(false);
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoadingState(true);

    const portal = portals.find(p => p.id === selectedPortal);
    if (!portal) {
      setError('Invalid portal selected.');
      setLoadingState(false);
      return;
    }

    // Enforce hard-coded credentials for the selected portal
    if (email.trim().toLowerCase() !== portal.defaultEmail.toLowerCase() || password !== portal.defaultPassword) {
      setError(`Invalid credentials. Please use the default credentials for ${portal.title}.`);
      setLoadingState(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        performManualOfflineSignIn(portal);
      }
    } catch {
      performManualOfflineSignIn(portal);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 flex flex-col justify-between">
      
      {/* Header - Simple clean header consistent with same theme */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-slate-900 font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
            CareConnect
          </Link>
          <Link to="/">
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.01] cursor-pointer">
              Back to Home
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex items-center justify-center py-12 px-6">
        <div className="max-w-lg w-full bg-white border border-slate-200/60 rounded-3xl shadow-sm p-10 space-y-8 animate-fadeInUp">
          
          {/* Header text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign in to CareConnect
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              Real-time hospital operations & resource pipeline console.
            </p>
          </div>

          {/* Role Tabs Switcher */}
          <div className="space-y-3">
            <label className="block text-center text-slate-400 text-[9px] font-bold uppercase tracking-wider">
              Select Designated Gateway
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {portals.map((portal) => (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => {
                    setSelectedPortal(portal.id);
                    setEmail('');
                    setPassword('');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-all text-center cursor-pointer ${
                    selectedPortal === portal.id
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {portal.id === 'Reception Staff' ? 'reception/opd' : portal.id}
                </button>
              ))}
            </div>
            
            {/* Description of active role */}
            <p className="text-slate-500 text-[11px] leading-normal text-center font-medium px-2 min-h-[34px]">
              {portals.find(p => p.id === selectedPortal)?.description}
            </p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 text-xxs px-4 py-3 rounded-xl border border-emerald-100 font-bold text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-xxs px-4 py-3 rounded-xl border border-red-100 font-bold text-center leading-relaxed">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/30"
                placeholder="name@hospital.com"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Account Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/30"
                placeholder="••••••••"
              />
            </div>

            {/* Form actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAutoFill}
                className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer flex justify-center items-center"
              >
                Auto-fill Demo
              </button>
              <button
                type="submit"
                disabled={loadingState}
                className="w-1/2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                {loadingState ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-[8.5px] font-bold uppercase tracking-wider">
          <div className="text-slate-900 font-extrabold text-xs tracking-tight">
            CareConnect
          </div>
          <p className="mt-2.5 md:mt-0">&copy; {new Date().getFullYear()} CareConnect. All rights registered.</p>
          <div className="flex space-x-6 mt-2.5 md:mt-0 text-slate-400">
            <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Login;
