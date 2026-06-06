import { useState } from 'react';
import { useGlobalContext } from '../context/Context';

const Doctors = () => {
  const { user, doctors, registerUser, refreshData } = useGlobalContext();
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState('');
  
  // Registration Form State
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Doctor',
    department: 'General Medicine',
    specialization: '',
    assignedWard: 'General'
  });

  // Handle send message
  const handleSendMessage = () => {
    if (selectedDoctor && message.trim()) {
      alert(`Instruction sent to ${selectedDoctor.name}: "${message}"`);
      setMessage('');
    }
  };

  // Handle add new doctor/staff
  const handleAddDoctor = async () => {
    if (!newDoctor.name.trim() || !newDoctor.email.trim() || !newDoctor.password.trim()) {
      alert('Please fill in Name, Email, and Password');
      return;
    }
    
    if (newDoctor.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await registerUser({
        name: newDoctor.name,
        email: newDoctor.email,
        password: newDoctor.password,
        role: newDoctor.role,
        department: newDoctor.department,
        specialization: newDoctor.role === 'Doctor' ? newDoctor.specialization : undefined,
        assignedWard: newDoctor.role === 'Nurse' ? newDoctor.assignedWard : undefined
      });
      
      if (res.success) {
        alert(`${newDoctor.role} ${newDoctor.name} registered successfully!`);
        // Reset form
        setNewDoctor({
          name: '',
          email: '',
          password: '',
          role: 'Doctor',
          department: 'General Medicine',
          specialization: '',
          assignedWard: 'General'
        });
        if (refreshData) refreshData();
      } else {
        alert(res.message || 'Registration failed.');
      }
    } catch (err) {
      alert('An error occurred during registration.');
    }
  };

  // Stats calculations
  const totalDoctors = (doctors || []).filter(doc => doc.role === 'Doctor').length;
  const totalStaff = (doctors || []).filter(doc => doc.role !== 'Doctor').length;

  const filteredDoctors = (doctors || []).filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    (doctor.specialization && doctor.specialization.toLowerCase().includes(search.toLowerCase())) ||
    (doctor.department && doctor.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medical Practitioners</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{totalDoctors}</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Support & Other Staff</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{totalStaff}</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Rostered</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{(doctors || []).length}</h4>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Add/Edit and Communication */}
        <div className="space-y-6">
          
          {/* Add Form */}
          {user?.role === 'Management' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                Register New Staff
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Staff Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder-slate-400 bg-slate-50/50"
                    placeholder="Dr. Evelyn Smith"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Work Email</label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder-slate-400 bg-slate-50/50"
                    placeholder="evelyn@careconnect.com"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder-slate-400 bg-slate-50/50"
                    placeholder="•••••••• (Min 6 chars)"
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role / Designation</label>
                    <select
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                      value={newDoctor.role}
                      onChange={(e) => setNewDoctor(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Reception Staff">Reception</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                    <select
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                      value={newDoctor.department}
                      onChange={(e) => setNewDoctor(prev => ({ ...prev, department: e.target.value }))}
                    >
                      <option value="General Medicine">General Med</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Critical Care">Critical Care</option>
                      <option value="Emergency Care">Emergency</option>
                      <option value="Administration">Admin</option>
                    </select>
                  </div>
                </div>

                {newDoctor.role === 'Doctor' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Specialization</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder-slate-400 bg-slate-50/50"
                      placeholder="e.g. Cardiologist"
                      value={newDoctor.specialization}
                      onChange={(e) => setNewDoctor(prev => ({ ...prev, specialization: e.target.value }))}
                    />
                  </div>
                )}

                {newDoctor.role === 'Nurse' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Ward</label>
                    <select
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                      value={newDoctor.assignedWard}
                      onChange={(e) => setNewDoctor(prev => ({ ...prev, assignedWard: e.target.value }))}
                    >
                      <option value="General">General Ward</option>
                      <option value="ICU">ICU</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleAddDoctor}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Confirm Registration
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clinician Dispatcher Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              Duty Desk Dispatcher
            </h3>
            {selectedDoctor ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 text-xs">
                  <span className="font-semibold text-slate-700">Target:</span> {selectedDoctor.name}
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedDoctor.specialization || selectedDoctor.role}</p>
                </div>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  rows="3"
                  placeholder="Type dispatch messages or clinic instructions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={handleSendMessage}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Send Instruction
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-4">Select a staff member from the list to send a dispatch instruction.</p>
            )}
          </div>
        </div>

        {/* Right column: Registries List */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden lg:col-span-2 flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/20">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              Active Duty Roster
            </h3>
            
            {/* Search bar */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                placeholder="Search roster..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold text-[9px] uppercase tracking-wider bg-slate-50/25">
                  <th className="px-6 py-3.5">Practitioner Details</th>
                  <th className="px-6 py-3.5">Role / Designation</th>
                  <th className="px-6 py-3.5">Duty Hours</th>
                  <th className="px-6 py-3.5">Duty Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr
                    key={doc._id || doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`border-b border-slate-100 text-slate-600 hover:bg-slate-50/40 cursor-pointer ${
                      selectedDoctor?.id === doc.id || selectedDoctor?._id === doc._id ? 'bg-slate-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{doc.specialization || doc.department || 'Clinical Operations'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-655 font-semibold">
                      <span className="flex items-center">
                        {doc.role || 'Doctor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                      {doc.role === 'Doctor' ? '09:00 - 17:00' : '08:00 - 16:00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border bg-emerald-50/50 text-emerald-700 border-emerald-150">
                        On Duty
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 italic text-xs">No rostered staff match filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default Doctors;
