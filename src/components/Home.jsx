import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import healthTechImg from '../assets/HealthTech.jpg';
import image2Img from '../assets/image 2.jpg';

// Screenshots
import ssOverview from '../assets/ss2/Screenshot 2026-06-13 181254.png';
import ssPatients from '../assets/ss2/Screenshot 2026-06-13 181401.png';
import ssOPDQueue from '../assets/ss2/Screenshot 2026-06-13 181444.png';
import ssBeds from '../assets/ss2/Screenshot 2026-06-13 181533.png';
import ssAdmissions from '../assets/ss2/Screenshot 2026-06-13 181620.png';
import ssInventory from '../assets/ss2/Screenshot 2026-06-13 181705.png';
import ssAlerts from '../assets/ss2/Screenshot 2026-06-13 181755.png';
import ssNotices from '../assets/ss2/Screenshot 2026-06-13 181926.png';


const screenshotImages = [
  ssOverview,
  ssPatients,
  ssOPDQueue,
  ssBeds,
  ssAdmissions,
  ssInventory,
  ssAlerts,
  ssNotices,
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + screenshotImages.length) % screenshotImages.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % screenshotImages.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans relative">
      
      {/* Hero Section Container (Covers Header + Hero content) */}
      <div 
        className="relative min-h-screen flex flex-col justify-between bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${healthTechImg})` }}
      >
        {/* Dark overlay to cover the background image and make white text highly legible */}
        <div className="absolute inset-0 bg-slate-950/60 z-10" />

        {/* Header */}
        <header className="relative z-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Brand Logo - Enlarged and high visibility */}
            <Link to="/" className="text-white font-extrabold text-xl sm:text-2xl tracking-tight hover:opacity-90 transition-opacity">
              CareConnect
            </Link>

            {/* Nav Links: About, Features, Contact */}
            <div className="hidden md:flex items-center space-x-10">
              <Link to="/About" className="text-white hover:text-slate-200 text-sm font-bold tracking-wide transition-colors">
                About
              </Link>
              <a href="#features" className="text-white hover:text-slate-200 text-sm font-bold tracking-wide transition-colors">
                Features
              </a>
              <Link to="/contact" className="text-white hover:text-slate-200 text-sm font-bold tracking-wide transition-colors">
                Contact
              </Link>
            </div>

            {/* CTA Portal Login - Highly visible white button */}
            <Link to="/login">
              <button className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer">
                Login
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto w-full py-20 animate-fadeInUp">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-sm">
            Transforming Hospital Operations <br className="hidden md:block" />
            Through Intelligent Resource Management
          </h1>
          
          {/* Subtext */}
          <p className="mt-8 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-semibold drop-shadow-sm">
            CareConnect stabilizes patient throughput, coordinates real-time ER/ICU bed utilization, handles full admissions lifecycles, and triggers urgent inventory outage alerts across the clinical network.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-slate-50 text-slate-950 text-sm font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                Staff Portal Login
              </button>
            </Link>
            <a href="#pipeline" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 bg-slate-900/50 hover:bg-slate-900/80 text-white text-sm font-extrabold rounded-xl border border-white/40 transition-all backdrop-blur-md hover:scale-[1.02] cursor-pointer shadow-md">
                Patient Pipeline
              </button>
            </a>
          </div>
        </main>
        
        {/* Spacer at the bottom to balance layout */}
        <div className="h-8 relative z-20" />
      </div>

      {/* Roadmap Section: How it Works */}
      <section id="pipeline" className="py-16 max-w-7xl mx-auto px-6 border-t border-slate-100 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Patient Journey Pipeline
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed font-normal">
            A synchronized, transparent clinical workflow coordinating every stage from admission to discharge.
          </p>
        </div>

        <div className="relative">
          {/* Curved healthtech green line connecting the steps (ECG/Heartbeat style) */}
          <svg 
            className="hidden lg:block absolute top-[48px] left-[7.14%] right-[7.14%] h-[60px] -translate-y-1/2 -z-10 overflow-visible" 
            fill="none" 
            viewBox="0 0 600 100"
            preserveAspectRatio="none"
          >
            <path 
              d="M 0 50 Q 50 10 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50" 
              stroke="#10b981" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Steps Grid: 7 steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-6">
            
            {/* Step 1 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                01
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Registration
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Intake staff logs patient details, credentials, and medical reasons for check-in.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                02
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Queue Assignment
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Automated triage allocates patients to relevant waiting lines and consulting rooms.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                03
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Consultation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Attending clinicians conduct examinations, diagnose symptoms, and log prescriptions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                04
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Admission Request
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Clinicians trigger ward admission requests for cases requiring active monitoring.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                05
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Bed Allocation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                CareConnect tracks ward occupancy and assigns an available bed in real-time.
              </p>
            </div>

            {/* Step 6 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                06
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Treatment
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Nurses administer care plans, log patient vitals, and update supply checklists.
              </p>
            </div>

            {/* Step 7 */}
            <div className="relative text-center flex flex-col items-center justify-start group py-6 px-2">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm mb-4 z-10 relative group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/50 transition-all duration-300">
                07
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">
                Discharge
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Intake desk logs discharge protocols and vacates beds back to the network.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Product Capability Showcase Section (Full screen background) */}
      <section className="w-full bg-slate-50/50 border-t border-slate-100 py-16 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Product value points */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight text-center">
              Real-time Clinical Synchronization
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
              CareConnect integrates all operational facets of your healthcare facility into a single, cohesive operating console, eliminating silos and coordinating responses.
            </p>
            <div className="space-y-4 pt-2">
              <div className="border-l-2 border-indigo-500 pl-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Outpatient Flow Balancing</h4>
                <p className="text-xxs text-slate-500 mt-1 font-semibold leading-relaxed">
                  Predicts check-in delays and automatically re-routes patient ticks based on active consultant pacing.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Automated Consumables Logs</h4>
                <p className="text-xxs text-slate-500 mt-1 font-semibold leading-relaxed">
                  Draws ward stock automatically from dispensary lists, avoiding clinical bottlenecks and shortages.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Secure Network Sync</h4>
                <p className="text-xxs text-slate-500 mt-1 font-semibold leading-relaxed">
                  Real-time database sync across nursing desks, clinician consoles, and management accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Image Showcase */}
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[50px] rounded-3xl pointer-events-none" />
            <div className="relative bg-white border border-slate-200/80 p-2 rounded-2xl shadow-xs">
              <img 
                src={image2Img} 
                alt="CareConnect Advanced Clinical Synchronization Hub" 
                className="w-full h-auto object-cover rounded-xl shadow-xxs border border-slate-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section (Clean white background with green accents) */}
      <section id="features" className="py-16 max-w-7xl mx-auto px-6 border-t border-slate-100 bg-white text-left">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Engineered for absolute operational alignment.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed font-normal">
            Specialized management consoles built to streamline medical workflows, reduce clinical backlogs, and prevent resource outages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/85 hover:border-emerald-500/25 border-t-4 border-t-slate-100 hover:border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[210px] cursor-pointer shadow-sm hover:shadow-md group">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">Smart OPD Queuing</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Optimizes patient flows by monitoring consulting progression metrics, tracking check-in backlogs, and predicting consultant wait durations.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/85 hover:border-emerald-500/25 border-t-4 border-t-slate-100 hover:border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[210px] cursor-pointer shadow-sm hover:shadow-md group">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">Bed Allocation & Control</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Real-time bed utilization mapping across ICU, emergency, and general wards. Prevent placement conflicts and monitor discharge schedules.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/85 hover:border-emerald-500/25 border-t-4 border-t-slate-100 hover:border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[210px] cursor-pointer shadow-sm hover:shadow-md group">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">Admissions Lifecycle</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Digitizes the patient intake flow from registration and room transfer to discharge protocols, maintaining secure historical telemetry.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/85 hover:border-emerald-500/25 border-t-4 border-t-slate-100 hover:border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[210px] cursor-pointer shadow-sm hover:shadow-md group">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">Inventory Outage Alerts</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Monitors pharmaceutical and emergency supplies. Automatically triggers high-priority notifications when supply levels cross safety thresholds.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/85 hover:border-emerald-500/25 border-t-4 border-t-slate-100 hover:border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[210px] cursor-pointer shadow-sm hover:shadow-md group">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">Role-Based Access</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Custom views and action permissions optimized individually for administrators, attending doctors, ward nurses, and intake coordinators.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/85 hover:border-emerald-500/25 border-t-4 border-t-slate-100 hover:border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[210px] cursor-pointer shadow-sm hover:shadow-md group">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors duration-300">Broadcast Center</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Facilitates direct, internal broadcast logging for staff shift bulletins, system messages, and critical hospital status changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Console Preview Hub (Screenshot Library) */}
      <section className="w-full bg-slate-50/50 border-t border-slate-100 py-16 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Inside the Operating Console
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              A real-time glance at the high-fidelity management desks and live databases running CareConnect.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto w-full group">
            {/* Carousel Main Container with standard borders/shadow and overflow protection */}
            <div className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 bg-slate-50 aspect-[16/10]">
              
              {/* Slider Track (Horizontal sliding transition) */}
              <div 
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
              >
                {screenshotImages.map((img, idx) => (
                  <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center aspect-[16/10] bg-slate-50">
                    <img
                      src={img}
                      alt={`CareConnect Operational Console Screenshot ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
              
              {/* Left Arrow Option */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/45 hover:bg-emerald-600/95 text-white flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer shadow-sm hover:scale-[1.03] z-10"
                aria-label="Previous Console Screenshot"
              >
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow Option */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/45 hover:bg-emerald-600/95 text-white flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer shadow-sm hover:scale-[1.03] z-10"
                aria-label="Next Console Screenshot"
              >
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Slider Indicators (dots only, numbers removed) */}
            <div className="flex justify-center items-center gap-1.5 mt-6">
              {screenshotImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? 'w-5 bg-emerald-500' : 'w-1.5 bg-slate-300 hover:bg-slate-450'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-50 border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-[8.5px] font-bold uppercase tracking-wider">
          <div className="text-slate-850 font-extrabold text-xs tracking-tight">
            CareConnect
          </div>
          <p className="mt-2.5 md:mt-0">&copy; {new Date().getFullYear()} CareConnect. All rights registered.</p>
          <div className="flex space-x-6 mt-2.5 md:mt-0 text-slate-400">
            <Link to="/contact" className="hover:text-slate-600 transition-colors">Contact Us</Link>
            <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;