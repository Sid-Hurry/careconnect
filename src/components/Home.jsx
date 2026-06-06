import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospitalSymbol, FaUserShield, FaChartLine, FaBoxes } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-lg">
            <FaHospitalSymbol className="text-xl text-blue-500" />
            <span className="tracking-tight">CareConnect</span>
          </div>
          <Link to="/login">
            <button className="px-5 py-2 border border-slate-350 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all">
              Staff Portal Login
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center max-w-4xl mx-auto">
        <span className="bg-slate-100 text-slate-800 text-xxs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 border border-slate-200">
          Hospital Resource Optimization Platform
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Synchronize Hospital Operations, <br className="hidden md:block" />
          Minimize Patient Wait Times.
        </h1>
        <p className="mt-6 text-sm text-slate-500 max-w-xl leading-relaxed">
          CareConnect optimizes patient flow queues, monitors real-time ICU/ER bed utilization, manages admissions lifecycles, alerts critical stock outages, and streamlines internal medical operations.
        </p>

        <div className="mt-10">
          <Link to="/login">
            <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
              Access CareConnect Console
            </button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-4 border border-slate-200">
              <FaChartLine className="text-sm" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Smart OPD Queuing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculates wait time estimations, consultation progression, and peak queue congestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-4 border border-slate-200">
              <FaUserShield className="text-sm" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">RBAC Wards Control</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tailored workspaces for Management, Doctors, Nurses, and Reception Staff.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-4 border border-slate-200">
              <FaBoxes className="text-sm" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Inventory Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track pharmacy and supply levels, generating alerts when stock falls below critical thresholds.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xxs font-medium uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} CareConnect. Dedicated Hospital Resource Optimization System.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-600 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;