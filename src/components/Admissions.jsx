import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';


const Admissions = () => {
  const { 
    user, admissions, patients, beds, addAdmission, dischargePatient, getDoctorsList 
  } = useGlobalContext();

  const [showAddForm, setShowAddForm] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [admissionReason, setAdmissionReason] = useState('');
  const [wardType, setWardType] = useState('General');
  const [successMsg, setSuccessMsg] = useState('');

  const doctors = getDoctorsList();

  const handleAddAdmission = async (e) => {
    e.preventDefault();
    if (!patientId || !admissionReason) return;

    const res = await addAdmission({
      patientId,
      doctorId: doctorId || user._id || user.id,
      admissionReason,
      wardType
    });

    setSuccessMsg(
      res.bed 
        ? `Patient admitted immediately to Bed ${res.bed.bedNumber} (${res.bed.wardType})!` 
        : `Admission requested. No bed available in ${wardType}. Request added to Pending List.`
    );
    setPatientId('');
    setAdmissionReason('');
    setShowAddForm(false);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleDischarge = async (id) => {
    if (window.confirm('Confirm patient discharge and bed release?')) {
      await dischargePatient(id);
    }
  };

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-slate-800 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admitted Patients</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {admissions.filter(a => a.status === 'Admitted').length}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Placement</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {admissions.filter(a => a.status === 'Pending').length}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discharges Today</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {admissions.filter(a => a.status === 'Discharged').length}
            </h4>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className={`px-4 py-2.5 rounded border font-semibold text-xs ${
          successMsg.includes('Admitted') 
            ? 'bg-slate-50 border-slate-200 text-slate-900' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {successMsg}
        </div>
      )}

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Admissions list */}
        <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Admissions Ledger</h3>
            
            {/* Create Admission Request button (Reception / Doctor / MGMT) */}
            {user.role !== 'Nurse' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                New Admission Request
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/60">
                  <th className="px-6 py-3.5">Patient</th>
                  <th className="px-6 py-3.5">Assigned Bed</th>
                  <th className="px-6 py-3.5">Admission Reason</th>
                  <th className="px-6 py-3.5">Admit Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 italic">No patient admission records found.</td>
                  </tr>
                ) : (
                  admissions.map((entry) => (
                    <tr key={entry._id} className="text-slate-650 hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-bold text-slate-800">
                        <div>
                          <p>{entry.patient?.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono font-bold uppercase">{entry.patient?.patientId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xxs font-semibold text-slate-700">
                        {entry.bed ? (
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                            {entry.bed.bedNumber} ({entry.bed.wardType})
                          </span>
                        ) : (
                          <span className="text-red-650 font-bold italic">Unallocated</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-xxs max-w-xs truncate">{entry.admissionReason}</td>
                      <td className="px-6 py-3 text-xxs text-slate-550 font-semibold">
                        {new Date(entry.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          entry.status === 'Admitted' 
                            ? 'bg-slate-100 text-slate-800 border-slate-200' 
                            : entry.status === 'Pending' 
                              ? 'bg-slate-50 text-slate-600 border-slate-200' 
                              : 'bg-slate-100 text-slate-450 border-transparent'
                        }`}>{entry.status}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        {entry.status === 'Admitted' && (
                          <button
                            onClick={() => handleDischarge(entry._id)}
                            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xxs font-bold transition-all cursor-pointer"
                          >
                            Process Discharge
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

        {/* Admission Request Form */}
        <div className="space-y-6">
          {showAddForm && (
            <div className="bg-white p-5 rounded-lg border border-slate-200/80 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center">
                Admission Intake Request
              </h3>

              <form onSubmit={handleAddAdmission} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-850 focus:outline-none"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  >
                    <option value="">-- Choose registered patient --</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Requesting Clinician</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-850 focus:outline-none"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                  >
                    <option value="">-- Choose doctor --</option>
                    {doctors.map(d => (
                      <option key={d._id || d.id} value={d._id || d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Target Ward Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-850 focus:outline-none"
                    value={wardType}
                    onChange={(e) => setWardType(e.target.value)}
                  >
                    <option value="General">General Ward</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency">Emergency Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Clinical Indication for Admission</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-800 focus:outline-none"
                    placeholder="Describe clinical reason for inpatient placement..."
                    value={admissionReason}
                    onChange={(e) => setAdmissionReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Auto-Allocate & Admit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Admission guidelines */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              Admission Placement Logic
            </h3>
            <div className="space-y-3 text-xxs text-slate-500 leading-relaxed font-semibold">
              <p>The system features an automated, rule-based bed reservation check during intake requests:</p>
              <div className="pl-3 space-y-2 text-slate-650 font-bold border-l-2 border-slate-900">
                <p>&bull; Target ward matching checks available open beds</p>
                <p>&bull; Direct bed status locking avoids race-conditions</p>
                <p>&bull; Auto-triggers alert logs on ward saturation (exceeding 90% load)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Admissions;
