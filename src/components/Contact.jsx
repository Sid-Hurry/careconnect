import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 flex flex-col justify-between">
      
      {/* Header */}
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
      <main className="flex-1 w-full flex items-center justify-center py-16 sm:py-24 px-6">
        <div className="max-w-lg w-full bg-white border border-slate-200/60 rounded-3xl shadow-sm p-10 space-y-8 animate-fadeInUp">
          
          {/* Header text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              Send a message to the CareConnect team.
            </p>
          </div>

          {submitted && (
            <div className="bg-emerald-50 text-emerald-700 text-xs px-4 py-3.5 rounded-xl border border-emerald-100 font-bold animate-fadeIn text-center">
              Thank you! Your message has been sent successfully. A representative will contact you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/30"
                placeholder="John Doe"
              />
            </div>

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
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/30"
                placeholder="Integration inquiry, demo request, etc."
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/30 resize-none"
                placeholder="How can we help optimize your clinical operations?"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Message'
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

export default Contact;
