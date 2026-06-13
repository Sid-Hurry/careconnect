import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';

const Login = () => {
  // Portal selection state
  const [selectedPortal, setSelectedPortal] = useState(null); // null, 'Management', 'Doctor', 'Nurse', 'Reception Staff'
  
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  
  const { login, logout } = useGlobalContext();
  const navigate = useNavigate();

  const portals = [
    {
      id: 'Management',
      title: 'Management Console',
      description: 'Hospital analytics, administrative controls, and staff roster controls.',
      defaultEmail: 'admin@careconnect.com',
      defaultPassword: 'admin123',
      borderClass: 'border-l-4 border-l-slate-800'
    },
    {
      id: 'Doctor',
      title: 'Clinician Portal',
      description: 'Outpatient queue ticketing, vitals logs, and dispatch notifications.',
      defaultEmail: 'doctor@careconnect.com',
      defaultPassword: 'doctor123',
      borderClass: 'border-l-4 border-l-blue-500'
    },
    {
      id: 'Nurse',
      title: 'Ward Operations',
      description: 'Bed occupancy allocations, nursing duties, and consumables inventory drawing.',
      defaultEmail: 'nurse@careconnect.com',
      defaultPassword: 'nurse123',
      borderClass: 'border-l-4 border-l-emerald-500'
    },
    {
      id: 'Reception Staff',
      title: 'Intake & Reception',
      description: 'Patient queue ticketing, medical registration, and bed intake requests.',
      defaultEmail: 'reception@careconnect.com',
      defaultPassword: 'reception123',
      borderClass: 'border-l-4 border-l-orange-500'
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
    if (!selectedPortal) return;
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
      } catch (err) {
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
    } catch (err) {
      performManualOfflineSignIn(portal);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-55 font-sans p-4">
      <div className="bg-white border border-slate-100 rounded-3xl flex max-w-4xl w-full overflow-hidden shadow-premium flex-col md:flex-row animate-scaleUp">
        
        {/* Left Branding Section */}
        <div className="flex flex-col justify-between w-full md:w-1/2 bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
          {/* Subtle background glow pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center space-x-2 text-white font-bold text-sm relative z-10">
            <span className="w-4.5 h-4.5 bg-indigo-500 rounded-lg flex items-center justify-center text-[9px] text-white font-extrabold shadow-sm">C</span>
            <span className="tracking-tight">CareConnect</span>
          </div>

          <div className="my-10 md:my-auto space-y-6 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black leading-snug tracking-tight">
              Hospital Resource <br />
              <span className="text-indigo-400">Optimization Platform.</span>
            </h2>
            <p className="text-slate-400 text-xxs font-medium leading-relaxed max-w-sm">
              Real-time synchronization engine managing outpatient flow queues, bed occupancy distribution, admissions status, and emergency inventory tracking.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-slate-800/80 text-slate-350 px-3 py-1 rounded-full text-xxs border border-slate-700/60 font-semibold">OPD Queues</span>
              <span className="bg-slate-800/80 text-slate-350 px-3 py-1 rounded-full text-xxs border border-slate-700/60 font-semibold">Bed Allocation</span>
              <span className="bg-slate-800/80 text-slate-350 px-3 py-1 rounded-full text-xxs border border-slate-700/60 font-semibold">Admissions</span>
              <span className="bg-slate-800/80 text-slate-350 px-3 py-1 rounded-full text-xxs border border-slate-700/60 font-semibold">Stock Alerts</span>
            </div>
          </div>

          <div className="flex items-center text-[9px] text-slate-500 font-bold tracking-widest uppercase relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span> CareConnect Console
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white min-h-[500px]">
          
          {selectedPortal === null ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-left">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Staff Portal Gateways</h3>
                <p className="text-slate-400 text-xxs font-medium mt-1">Select your designated gateway to access the console</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portals.map((portal) => (
                  <button
                    key={portal.id}
                    onClick={() => {
                      setSelectedPortal(portal.id);
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    className={`p-4 bg-white hover:bg-slate-50/40 text-left rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-200 shadow-xxs hover:shadow-xs cursor-pointer flex flex-col justify-between h-36 group hover:scale-[1.01] active:scale-[0.99] ${portal.borderClass}`}
                  >
                    <div>
                      <h4 className="text-xxs font-bold uppercase tracking-wider text-slate-800">{portal.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed line-clamp-3 font-semibold">{portal.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 self-end mt-2 group-hover:translate-x-1 transition-transform">Enter &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-left">
                <button
                  onClick={() => setSelectedPortal(null)}
                  className="text-xxs font-bold text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center space-x-1 hover:underline cursor-pointer"
                >
                  <span>&larr;</span> <span>Back to Portals</span>
                </button>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {portals.find(p => p.id === selectedPortal)?.title}
                </h3>
                <p className="text-slate-450 text-xxs font-semibold uppercase tracking-wider mt-1">Sign in as {selectedPortal}</p>
              </div>

              {successMessage && (
                <div className="bg-emerald-50 text-emerald-700 text-xxs px-4 py-3 rounded-xl border border-emerald-100 font-bold">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-655 text-xxs px-4 py-3 rounded-xl border border-red-100 font-bold leading-relaxed">
                  {error}
                </div>
              )}

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
                    className="w-1/2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center cursor-pointer shadow-sm hover:shadow"
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
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;

