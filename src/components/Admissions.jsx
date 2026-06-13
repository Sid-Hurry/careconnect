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
    <div className="space-y-6 animate-fadeIn">

      {/* Header Section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider">Inpatient Admissions</h3>
          <p className="text-xs font-bold text-slate-800">Manage patient ward intake, auto-bed allocation, and discharge records</p>
        </div>
        
        {/* Create Admission Request button (Reception / Doctor / MGMT) */}
        {user.role !== 'Nurse' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95"
          >
            {showAddForm ? 'Cancel Request' : 'New Admission Request'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admitted Patients</p>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">
              {admissions.filter(a => a.status === 'Admitted').length}
            </h4>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Placement</p>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">
              {admissions.filter(a => a.status === 'Pending').length}
            </h4>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              admissions.filter(a => a.status === 'Pending').length > 0
                ? 'text-amber-600 bg-amber-50 animate-pulse'
                : 'text-slate-400 bg-slate-50'
            }`}>Queue</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discharges Today</p>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">
              {admissions.filter(a => a.status === 'Discharged').length}
            </h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Completed</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className={`px-4 py-3 rounded-2xl border font-bold text-xs shadow-xxs transition-all duration-300 animate-scaleUp ${
          successMsg.includes('admitted') || successMsg.includes('immediately')
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-amber-50 border-amber-100 text-amber-800'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Admissions list */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450">Admissions Ledger</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-55">
                  <th className="px-6 py-3.5 text-xxs tracking-widest">Patient</th>
                  <th className="px-6 py-3.5 text-xxs tracking-widest">Assigned Bed</th>
                  <th className="px-6 py-3.5 text-xxs tracking-widest">Admission Reason</th>
                  <th className="px-6 py-3.5 text-xxs tracking-widest">Admit Date</th>
                  <th className="px-6 py-3.5 text-xxs tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-xxs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {admissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 italic font-bold">No patient admission records found.</td>
                  </tr>
                ) : (
                  admissions.map((entry) => (
                    <tr key={entry._id} className="text-slate-650 hover:bg-slate-55 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <div>
                          <p className="font-bold text-xs">{entry.patient?.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono tracking-wider font-bold mt-0.5">{entry.patient?.patientId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {entry.bed ? (
                          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100/40 text-[10px] font-bold">
                            {entry.bed.bedNumber} ({entry.bed.wardType})
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100/40 text-[10px] font-bold italic">Unallocated</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xxs font-medium max-w-xs truncate text-slate-600">{entry.admissionReason}</td>
                      <td className="px-6 py-4 text-xxs text-slate-450 font-bold">
                        {new Date(entry.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          entry.status === 'Admitted' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100/40' 
                            : entry.status === 'Pending' 
                              ? 'bg-amber-50 text-amber-700 border-amber-100/40 animate-pulse' 
                              : 'bg-slate-100 text-slate-500 border-transparent'
                        }`}>{entry.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {entry.status === 'Admitted' && (
                          <button
                            onClick={() => handleDischarge(entry._id)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xxs font-bold transition-all cursor-pointer shadow-xxs active:scale-95"
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

        {/* Admission Request Form & Info */}
        <div className="space-y-6">
          {showAddForm && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium animate-scaleUp">
              <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450 mb-4 pb-2 border-b border-slate-100">
                Admission Intake Request
              </h3>

              <form onSubmit={handleAddAdmission} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Patient</label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Requesting Clinician</label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Target Ward Type</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    value={wardType}
                    onChange={(e) => setWardType(e.target.value)}
                  >
                    <option value="General">General Ward</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency">Emergency Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Indication for Admission</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="Describe clinical reason for inpatient placement..."
                    value={admissionReason}
                    onChange={(e) => setAdmissionReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-95 text-center"
                  >
                    Auto-Allocate & Admit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Admission guidelines */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium space-y-4">
            <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450 flex items-center">
              Admission Placement Logic
            </h3>
            <div className="space-y-3 text-xxs text-slate-500 leading-relaxed font-bold">
              <p>The system features an automated, rule-based bed reservation check during intake requests:</p>
              <div className="pl-3.5 space-y-2 text-slate-650 font-bold border-l-2 border-indigo-600">
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

