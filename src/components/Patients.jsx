import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';

const Patients = () => {
  const { user, patients, addPatient, updateVitals } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Registration Form State
  const [showRegForm, setShowRegForm] = useState(false);
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
    <div className="space-y-6">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        
        {/* Search bar */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white transition-all bg-slate-50/20"
            placeholder="Search by ID, name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action button: Reception can register */}
        {(user?.role === 'Reception Staff' || user?.role === 'Management') && (
          <button
            onClick={() => setShowRegForm(!showRegForm)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <span>Intake Patient Registration</span>
          </button>
        )}
      </div>

      {/* Registration Form (Collapsible Card) */}
      {showRegForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs animate-fadeIn">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
            Patient Registration Intake Form
          </h3>

          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="James Watson"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Age</label>
              <input
                type="number"
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="45"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
              <select
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Phone</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="9876543210"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Residence Address</label>
              <input
                type="text"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="12 Baker St, New Delhi"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Medical History & Pre-existing Conditions (Comma separated)</label>
              <textarea
                rows="2"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Hypertension, Asthma, Diabetes"
                value={newPatient.medicalHistory}
                onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
              ></textarea>
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRegForm(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 text-slate-600 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Save Patient Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patients List Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-150">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Patients Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/60 text-[9px]">
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
                  <tr key={patient._id} className="text-slate-600 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-xs text-slate-700">{patient.patientId}</td>
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-bold text-slate-800">{patient.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">{patient.age} Y/O &bull; {patient.gender}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-750">{patient.phone}</td>
                    <td className="px-6 py-3">
                      {patient.currentVitals ? (
                        <div className="text-[10px] space-y-0.5 font-semibold text-slate-600">
                          <p className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-1.5"></span>
                            BP: <span className="font-bold ml-1 text-slate-700">{patient.currentVitals.bloodPressure}</span>
                          </p>
                          <p className="flex items-center">
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${patient.currentVitals.oxygenLevel < 92 ? 'bg-red-500 animate-pulse' : 'bg-slate-450'}`}></span>
                            O2: <span className={`font-bold ml-1 ${patient.currentVitals.oxygenLevel < 92 ? 'text-red-650' : 'text-slate-700'}`}>{patient.currentVitals.oxygenLevel}%</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xxs italic">Not recorded</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                          patient.medicalHistory.map((history, idx) => (
                            <span key={idx} className="bg-slate-100/60 text-slate-605 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200/50">
                              {history}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">No records</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {/* Nurses/Doctors can update vitals */}
                      {(user?.role === 'Nurse' || user?.role === 'Doctor' || user?.role === 'Management') && (
                        <button
                          onClick={() => openVitalsLog(patient)}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xxs font-bold transition-all inline-flex items-center cursor-pointer shadow-xs"
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
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-lg max-w-sm w-full animate-scaleUp">
            <div className="flex justify-between items-center mb-4 border-b border-slate-150 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
                Vitals: {vitalsPatient.name}
              </h3>
              <button onClick={() => setVitalsPatient(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleVitalsSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  value={vitalsData.bloodPressure}
                  onChange={(e) => setVitalsData({ ...vitalsData, bloodPressure: e.target.value })}
                  placeholder="120/80"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Heart Rate (bpm)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  value={vitalsData.heartRate}
                  onChange={(e) => setVitalsData({ ...vitalsData, heartRate: e.target.value })}
                  placeholder="75"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Body Temperature (&deg;F)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  value={vitalsData.temperature}
                  onChange={(e) => setVitalsData({ ...vitalsData, temperature: e.target.value })}
                  placeholder="98.6"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Oxygen Level (SpO2 %)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  value={vitalsData.oxygenLevel}
                  onChange={(e) => setVitalsData({ ...vitalsData, oxygenLevel: e.target.value })}
                  placeholder="98"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVitalsPatient(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
