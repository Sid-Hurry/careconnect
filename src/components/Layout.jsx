import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import { 
  MdDashboard, MdQueue, MdOutlineBed, MdChecklist, 
  MdNotificationImportant, MdAnnouncement, MdDomain, 
  MdSettings, MdOutlineHistory, MdPeople, MdMenu, MdClose, MdExitToApp
} from 'react-icons/md';
import { FaUserMd, FaPrescriptionBottleAlt, FaExchangeAlt, FaHospitalAlt, FaNetworkWired } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, alerts, logout, isOfflineMode } = useGlobalContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    // Return child content which will trigger redirect to login or show login
    return <>{children}</>;
  }

  // Handle Logout
  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Define Links based on Role
  const getNavLinks = () => {
    switch (user.role) {
      case 'Management':
        return [
          { name: 'Overview', path: '/dashboard', icon: MdDashboard },
          { name: 'Queue Analytics', path: '/opd-queue', icon: MdQueue },
          { name: 'Bed Management', path: '/beds', icon: MdOutlineBed },
          { name: 'Admissions', path: '/admissions', icon: MdChecklist },
          { name: 'Inventory', path: '/inventory', icon: FaPrescriptionBottleAlt },
          { name: 'Alerts', path: '/alerts', icon: MdNotificationImportant, badge: alerts.length },
          { name: 'Notices', path: '/notices', icon: MdAnnouncement },
        ];
      case 'Doctor':
        return [
          { name: 'Overview', path: '/dashboard', icon: MdDashboard },
          { name: 'My Queue', path: '/opd-queue', icon: MdQueue },
          { name: 'Patients', path: '/patients', icon: MdPeople },
          { name: 'Admissions', path: '/admissions', icon: MdChecklist },
          { name: 'Notices', path: '/notices', icon: MdAnnouncement },
        ];
      case 'Nurse':
        return [
          { name: 'Overview', path: '/dashboard', icon: MdDashboard },
          { name: 'Ward Patients', path: '/patients', icon: MdPeople },
          { name: 'Ward Beds', path: '/beds', icon: MdOutlineBed },
          { name: 'Consumable Requests', path: '/inventory', icon: FaPrescriptionBottleAlt },
          { name: 'Notices', path: '/notices', icon: MdAnnouncement },
        ];
      case 'Reception Staff':
        return [
          { name: 'Overview', path: '/dashboard', icon: MdDashboard },
          { name: 'Patient Intake', path: '/patients', icon: MdPeople },
          { name: 'Queue Manager', path: '/opd-queue', icon: MdQueue },
          { name: 'Admissions Desk', path: '/admissions', icon: MdChecklist },
          { name: 'Notices', path: '/notices', icon: MdAnnouncement },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* Top Banner for Offline Fallback Mode */}
      {isOfflineMode && (
        <div className="bg-slate-950 text-slate-200 text-xxs font-medium py-1.5 px-4 text-center select-none flex items-center justify-center space-x-2 border-b border-slate-800 lg:pl-64">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Offline Demo Mode active (Simulated database context)</span>
        </div>
      )}

      <div className="flex flex-1 relative">
        
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 z-20">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-lg">
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">C</span>
              <span className="tracking-tight">CareConnect</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border-l-2 ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 border-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge > 0 && (
                    <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info Block */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/40">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {user.name.split(' ').pop().charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-550 hover:text-slate-900 rounded-lg text-xxs font-semibold border border-slate-200 transition-all cursor-pointer"
            >
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-900/25 backdrop-blur-xs z-40 transition-opacity" onClick={() => setIsMobileOpen(false)}>
            <div className="w-64 bg-white h-full flex flex-col border-r border-slate-250" onClick={(e) => e.stopPropagation()}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
                  <span className="w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">C</span>
                  <span>CareConnect</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-slate-650">
                  <MdClose className="text-xl" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border-l-2 ${
                        isActive 
                          ? 'bg-slate-100 text-slate-900 border-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.badge > 0 && (
                        <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-100 bg-slate-50/40">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.split(' ').pop().charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center py-1.5 px-3 bg-white text-slate-550 hover:text-slate-900 rounded-lg text-xxs font-semibold border border-slate-200 transition-all cursor-pointer"
                >
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center">
              <button onClick={() => setIsMobileOpen(true)} className="lg:hidden mr-4 text-slate-500 hover:text-slate-700">
                <MdMenu className="text-xl" />
              </button>
              <div className="flex items-center space-x-3">
                <h1 className="text-sm font-bold text-slate-900">
                  {location.pathname === '/dashboard' && 'Dashboard Overview'}
                  {location.pathname === '/opd-queue' && 'Smart OPD Queue'}
                  {location.pathname === '/patients' && 'Patients Management'}
                  {location.pathname === '/admissions' && 'Admissions Portal'}
                  {location.pathname === '/beds' && 'Bed Availability'}
                  {location.pathname === '/inventory' && 'Inventory Management'}
                  {location.pathname === '/alerts' && 'Alert Center'}
                  {location.pathname === '/notices' && 'Notice Board'}
                  {location.pathname === '/settings' && 'User Settings'}
                </h1>
              </div>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications / Alerts Indicator */}
              {alerts.length > 0 && (
                <Link to={user.role === 'Management' ? '/alerts' : '#'} className="text-[10px] font-bold text-slate-900 hover:underline uppercase tracking-wider flex items-center space-x-1.5 bg-slate-100/80 px-2 py-1 rounded border border-slate-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span>Alert Center ({alerts.length})</span>
                </Link>
              )}
              
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Quick Profile */}
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[9px] text-slate-450 font-medium">{user.department}</p>
                </div>
                <div className="w-8 h-8 rounded border border-slate-200/80 flex items-center justify-center font-bold text-slate-750 text-xs">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
};

export default Layout;
