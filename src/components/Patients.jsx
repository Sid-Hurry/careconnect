import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import { MdPersonAdd, MdClose } from 'react-icons/md';

const Patients = () => {
  const { user, patients, addPatient, updateVitals } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  
  // Registration Form State
  const [showRegForm, setShowRegForm] = useState(location.state?.openRegForm || false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    medicalHistory: ''
  });

  // Vitals Update Modal State
  const [vitalsPatient, setVitalsPatient] = useState(null);
  const [vitalsData, setVitalsData] = useState({
    bloodPressure: '120/80',
    heartRate: '75',
    temperature: '98.6',
    oxygenLevel: '98'
  });

  // Handle register submission
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age || !newPatient.phone) return;

    await addPatient(newPatient);
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      medicalHistory: ''
    });
    setShowRegForm(false);
  };

  // Open vitals log
  const openVitalsLog = (patient) => {
    setVitalsPatient(patient);
    if (patient.currentVitals) {
      setVitalsData({
        bloodPressure: patient.currentVitals.bloodPressure || '120/80',
        heartRate: String(patient.currentVitals.heartRate || 75),
        temperature: String(patient.currentVitals.temperature || 98.6),
        oxygenLevel: String(patient.currentVitals.oxygenLevel || 98)
      });
    }
  };

  // Handle vitals save
  const handleVitalsSave = async (e) => {
    e.preventDefault();
    if (!vitalsPatient) return;

    await updateVitals(vitalsPatient._id, vitalsData);
    setVitalsPatient(null);
  };

  // Filter patients list
  const filteredPatients = (patients || []).filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-premium">
        
        {/* Search bar */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-slate-50/30 transition-all"
            placeholder="Search by ID, name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(user?.role === 'Reception Staff' || user?.role === 'Management') && (
          <button
            onClick={() => setShowRegForm(!showRegForm)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            {showRegForm ? <MdClose className="text-sm" /> : <MdPersonAdd className="text-sm" />}
            <span>{showRegForm ? 'Close Intake Form' : 'Intake Patient Registration'}</span>
          </button>
        )}
      </div>

      {/* Registration Form (Collapsible Card) */}
      {showRegForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium animate-fadeIn">
          <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450 mb-5">
            Patient Registration Intake Form
          </h3>

          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                placeholder="James Watson"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
              <input
                type="number"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                placeholder="45"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
              <select
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Phone</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                placeholder="9876543210"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Residence Address</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                placeholder="12 Baker St, New Delhi"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Medical History & Pre-existing Conditions (Comma separated)</label>
              <textarea
                rows="2"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                placeholder="Hypertension, Asthma, Diabetes"
                value={newPatient.medicalHistory}
                onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
              ></textarea>
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={() => setShowRegForm(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Save Patient Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patients List Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450">Patients Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50 text-[9px]">
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Name / Age / Gender</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">Current Vitals</th>
                <th className="px-6 py-3.5">Medical History</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">No patients match this criteria.</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient._id} className="text-slate-600 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-slate-700">{patient.patientId}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{patient.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{patient.age} Y/O &bull; {patient.gender}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{patient.phone}</td>
                    <td className="px-6 py-4">
                      {patient.currentVitals ? (
                        <div className="text-[10px] space-y-0.5 font-bold text-slate-500">
                          <p className="flex items-center">
                            <span className="w-1 h-1 rounded-full bg-slate-400 mr-1.5"></span>
                            BP: <span className="font-bold text-slate-700 ml-0.5">{patient.currentVitals.bloodPressure}</span>
                          </p>
                          <p className="flex items-center">
                            <span className={`w-1 h-1 rounded-full mr-1.5 ${patient.currentVitals.oxygenLevel < 92 ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            O2: <span className={`font-bold ml-0.5 ${patient.currentVitals.oxygenLevel < 92 ? 'text-red-650' : 'text-slate-700'}`}>{patient.currentVitals.oxygenLevel}%</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xxs italic">Not recorded</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                          patient.medicalHistory.map((history, idx) => (
                            <span key={idx} className="bg-indigo-50/70 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-100/50">
                              {history}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">No records</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Nurses/Doctors can update vitals */}
                      {(user?.role === 'Nurse' || user?.role === 'Doctor' || user?.role === 'Management') && (
                        <button
                          onClick={() => openVitalsLog(patient)}
                          className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xxs font-bold transition-all inline-flex items-center cursor-pointer shadow-xxs"
                        >
                          Update Vitals
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vitals update Modal Overlay */}
      {vitalsPatient && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium max-w-sm w-full animate-scaleUp">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450">
                Vitals: {vitalsPatient.name}
              </h3>
              <button onClick={() => setVitalsPatient(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleVitalsSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                  value={vitalsData.bloodPressure}
                  onChange={(e) => setVitalsData({ ...vitalsData, bloodPressure: e.target.value })}
                  placeholder="120/80"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Heart Rate (bpm)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                  value={vitalsData.heartRate}
                  onChange={(e) => setVitalsData({ ...vitalsData, heartRate: e.target.value })}
                  placeholder="75"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Body Temperature (&deg;F)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                  value={vitalsData.temperature}
                  onChange={(e) => setVitalsData({ ...vitalsData, temperature: e.target.value })}
                  placeholder="98.6"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Oxygen Level (SpO2 %)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                  value={vitalsData.oxygenLevel}
                  onChange={(e) => setVitalsData({ ...vitalsData, oxygenLevel: e.target.value })}
                  placeholder="98"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVitalsPatient(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  Save Readings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Patients;
