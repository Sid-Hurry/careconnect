import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col justify-between">
      
      {/* Header - Transparent matching landing style */}
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
      <main className="flex-1 w-full py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 space-y-12 animate-fadeInUp">
          
          {/* Main Title and Intro */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Designing the Future of <br /> Clinical Operations
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              CareConnect is built to eliminate clinical friction, synchronize hospital resource pipelines, and optimize care pathways for medical teams worldwide.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Core Story */}
          <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            <p>
              Healthcare environments are highly dynamic, yet clinical software has historically remained isolated in technical silos. CareConnect was built to bridge nursing desks, attending doctor consoles, and management dashboards.
            </p>
            <p>
              By replacing paper-bound bottlenecks with secure, automated telemetry, we ensure that clinical coordinators can focus entirely on delivering life-saving treatments and providing optimal patient care.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Pillars List (Simple list, not a complex grid) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Operational Focus
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Outpatient Triage Pacing</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Calculating queue dynamics, peak congestion periods, and consultant wait times in real time to stabilize patient arrival volumes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Bed Utilization</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Providing a centralized map of ward occupancies to avoid allocation placement conflicts and prepare beds back for triage queues.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Proactive Supply Warnings</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Tracking ward consumables, prescriptions, and pharmaceutical stocks automatically to prevent critical clinical inventory shortages.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Refined Footer */}
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

export default About;