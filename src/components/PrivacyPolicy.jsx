import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-slate-900 font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
            CareConnect
          </Link>
          <Link to="/">
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              Back to Home
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-8">
          Last Updated: June 13, 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              1. Scope & Commitment
            </h2>
            <p>
              CareConnect is dedicated to protecting the privacy of healthcare staff, clinicians, and administrative users. This policy outlines how we handle operational logs, system metadata, and access credentials within the CareConnect Hospital Resource Optimization Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              2. Data Protection Standards (HIPAA Compliance)
            </h2>
            <p>
              We adhere strictly to hospital privacy standards and regulatory guidelines. All patient journey records, admissions telemetry, bed occupancy metrics, and pharmacy logs are encrypted both in transit and at rest. CareConnect does not sell or distribute clinical telemetry to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              3. Role-Based Metadata Collection
            </h2>
            <p>
              To run the clinical synchronization system, we collect minimal operational information, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500 font-medium">
              <li>Role permissions (Management, Doctor, Nurse, Intake Staff)</li>
              <li>Operational audit logs (prescriptions logged, bed status updates, check-ins)</li>
              <li>Technical device logs for console error reporting</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              4. Cookies and Local Storage
            </h2>
            <p>
              We utilize local web storage and secure session tokens solely to verify user identity, maintain active portal logins, and store offline database changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              5. Support and Contact
            </h2>
            <p>
              For inquiries regarding database security, data removal, or system integration compliance, please contact our support team at{' '}
              <a href="mailto:security@careconnect.com" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors">
                security@careconnect.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-[9px] font-bold uppercase tracking-wider">
        <p>&copy; {new Date().getFullYear()} CareConnect. Dedicated Security Systems.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
