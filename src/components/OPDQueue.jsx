import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';

const OPDQueue = () => {
  const { 
    user, queue, patients, addToken, updateTokenStatus, getDoctorsList 
  } = useGlobalContext();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [priorityFlag, setPriorityFlag] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const doctors = getDoctorsList();

  // Handle Token Generation
  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedDoctorId) return;

    await addToken(selectedPatientId, selectedDoctorId, priorityFlag);
    setSuccessMsg('OPD Token generated successfully!');
    setSelectedPatientId('');
    setPriorityFlag(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Stats
  const totalTokens = queue.length;
  const waitingTokens = queue.filter(q => q.queueStatus === 'Waiting');
  const inProgressTokens = queue.filter(q => q.queueStatus === 'In Progress');
  const completedTokensCount = queue.filter(q => q.queueStatus === 'Completed').length;
  
  // Calculate average wait time (simulated wait time aggregate)
  const averageWaitTime = waitingTokens.length > 0 
    ? Math.round(waitingTokens.reduce((acc, q) => acc + q.estimatedWaitTime, 0) / waitingTokens.length) 
    : 10;

  // Filter queues based on role
  const getFilteredQueue = () => {
    if (user.role === 'Doctor') {
      const uId = user._id || user.id;
      return queue.filter(q => {
        const qDocId = q.doctor?._id || q.doctor?.id || q.doctor;
        return qDocId === uId;
      });
    }
    return queue;
  };

  const filteredQueue = getFilteredQueue();

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* OPD Dashboard Stats (Focus on operational metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Tickets</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{waitingTokens.length + inProgressTokens.length}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Waiting Time</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{averageWaitTime} Mins</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patients Served Today</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{completedTokensCount}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bottleneck Alerts</p>
            <h4 className={`text-2xl font-black mt-1.5 tracking-tight ${averageWaitTime > 30 ? 'text-red-650' : 'text-slate-900'}`}>
              {averageWaitTime > 30 ? '1 Active' : '0 Active'}
            </h4>
          </div>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section: Active Tokens & Queues */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-55">
            <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450">
              {user.role === 'Doctor' ? 'My Doctor Patient Queue' : 'Active Hospital Queues'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-55">
                  <th className="px-6 py-3.5">Token</th>
                  <th className="px-6 py-3.5">Patient Name</th>
                  {user.role !== 'Doctor' && <th className="px-6 py-3.5">Assigned Doctor</th>}
                  <th className="px-6 py-3.5">Est. Start Time</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 italic">No patients currently queued.</td>
                  </tr>
                ) : (
                  filteredQueue.map((entry) => (
                    <tr key={entry._id} className="text-slate-600 hover:bg-slate-55 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">{entry.tokenNumber}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800">{entry.patient?.name}</p>
                          {entry.priority && (
                            <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-100 mt-1 inline-block">Priority</span>
                          )}
                        </div>
                      </td>
                      {user.role !== 'Doctor' && (
                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                          {entry.doctor?.name} <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">{entry.doctor?.specialization}</span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {entry.queueStatus === 'Waiting' 
                          ? new Date(entry.predictedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : entry.queueStatus === 'In Progress' 
                            ? 'Ongoing' 
                            : '--:--'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                          entry.queueStatus === 'In Progress' 
                            ? 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50' 
                            : entry.queueStatus === 'Waiting' 
                              ? 'bg-slate-55 text-slate-605 border-slate-150' 
                              : entry.queueStatus === 'Completed'
                                ? 'bg-slate-100 text-slate-800 border-slate-200'
                                : 'bg-slate-100 text-slate-400 border-transparent'
                        }`}>{entry.queueStatus}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Only doctors can change consultation state of their queue */}
                        {user.role === 'Doctor' && entry.queueStatus === 'Waiting' && (
                          <button
                            onClick={() => updateTokenStatus(entry._id, 'In Progress')}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xxs font-bold cursor-pointer transition-all shadow-xxs"
                          >
                            Call Patient
                          </button>
                        )}
                        {user.role === 'Doctor' && entry.queueStatus === 'In Progress' && (
                          <div className="flex justify-end space-x-1.5">
                            <button
                              onClick={() => updateTokenStatus(entry._id, 'Completed')}
                              className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xxs font-bold cursor-pointer transition-all shadow-xxs"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateTokenStatus(entry._id, 'Cancelled')}
                              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xxs font-bold cursor-pointer transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section: Form for generation (Reception / MGMT only) */}
        <div className="space-y-6">
          {(user.role === 'Reception Staff' || user.role === 'Management') && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium">
              <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-450 mb-4">
                Generate OPD Token
              </h3>

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xxs px-4 py-2.5 rounded-xl mb-4 font-bold">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleGenerateToken} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Patient</label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    <option value="">-- Choose registered patient --</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Assigned Doctor</label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                  >
                    <option value="">-- Choose practitioner --</option>
                    {doctors.map(d => (
                      <option key={d._id || d.id} value={d._id || d.id}>{d.name} &bull; {d.specialization}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id="priorityFlag"
                    className="w-4 h-4 text-indigo-600 border-slate-200 rounded focus:ring-indigo-500/20"
                    checked={priorityFlag}
                    onChange={(e) => setPriorityFlag(e.target.checked)}
                  />
                  <label htmlFor="priorityFlag" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer">
                    Mark as Priority Case
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  Issue OPD Token
                </button>
              </form>
            </div>
          )}

          {/* Management specific: Queue Efficiency indicators */}
          {user.role === 'Management' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium space-y-4 animate-fadeIn">
              <h3 className="text-xxs font-bold uppercase tracking-wider text-slate-455">
                Queue Efficiency Metrics
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wider">
                    <span>Average Wait Duration</span>
                    <span className="font-bold text-slate-700">{averageWaitTime} Mins</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (averageWaitTime/45)*100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wider">
                    <span>Peak Hour Jam Load</span>
                    <span className="font-bold text-slate-700">11:00 AM - 1:00 PM</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wider">
                    <span>Avg Consultation Duration</span>
                    <span className="font-bold text-slate-700">10 Mins / Patient</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full transition-all duration-300" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default OPDQueue;

