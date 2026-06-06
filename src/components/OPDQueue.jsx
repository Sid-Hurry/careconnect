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
    <div className="space-y-6">

      {/* OPD Dashboard Stats (Focus on operational metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-slate-800 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Active Tickets</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{waitingTokens.length + inProgressTokens.length}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Average Waiting Time</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{averageWaitTime} Mins</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Patients Served Today</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{completedTokensCount}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-red-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Bottleneck Alerts</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">
              {averageWaitTime > 30 ? '1 Active' : '0 Active'}
            </h4>
          </div>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section: Active Tokens & Queues */}
        <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-150 bg-slate-50/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {user.role === 'Doctor' ? 'My Doctor Patient Queue' : 'Active Hospital Queues'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/60">
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
                    <tr key={entry._id} className="text-slate-655 hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{entry.tokenNumber}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800">{entry.patient?.name}</p>
                          {entry.priority && (
                            <span className="bg-red-50 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-150 mt-1 inline-block">Priority</span>
                          )}
                        </div>
                      </td>
                      {user.role !== 'Doctor' && (
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                          {entry.doctor?.name} ({entry.doctor?.specialization})
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {entry.queueStatus === 'Waiting' 
                          ? new Date(entry.predictedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : entry.queueStatus === 'In Progress' 
                            ? 'Ongoing' 
                            : '--:--'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
                          entry.queueStatus === 'In Progress' 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : entry.queueStatus === 'Waiting' 
                              ? 'bg-slate-55 text-slate-700 border-slate-200 bg-slate-50' 
                              : entry.queueStatus === 'Completed'
                                ? 'bg-slate-100 text-slate-800 border-slate-200'
                                : 'bg-slate-100 text-slate-450 border-transparent'
                        }`}>{entry.queueStatus}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Only doctors can change consultation state of their queue */}
                        {user.role === 'Doctor' && entry.queueStatus === 'Waiting' && (
                          <button
                            onClick={() => updateTokenStatus(entry._id, 'In Progress')}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xxs font-semibold cursor-pointer"
                          >
                            Call Patient
                          </button>
                        )}
                        {user.role === 'Doctor' && entry.queueStatus === 'In Progress' && (
                          <div className="flex justify-end space-x-1.5">
                            <button
                              onClick={() => updateTokenStatus(entry._id, 'Completed')}
                              className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-[10px] font-semibold cursor-pointer border border-transparent"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateTokenStatus(entry._id, 'Cancelled')}
                              className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-semibold cursor-pointer"
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
            <div className="bg-white p-5 rounded-lg border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
                Generate OPD Token
              </h3>

              {successMsg && (
                <div className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-4 py-2.5 rounded mb-4 font-semibold">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleGenerateToken} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-850 focus:outline-none"
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Assigned Doctor</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-850 focus:outline-none"
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
                    className="w-3.5 h-3.5 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                    checked={priorityFlag}
                    onChange={(e) => setPriorityFlag(e.target.checked)}
                  />
                  <label htmlFor="priorityFlag" className="text-xxs font-bold text-slate-650 uppercase tracking-wider">
                    Mark as Priority Case
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Issue OPD Token
                </button>
              </form>
            </div>
          )}

          {/* Management specific: Queue Efficiency indicators */}
          {user.role === 'Management' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Queue Efficiency Metrics
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xxs font-bold text-slate-500 mb-1">
                    <span>Average Wait Duration</span>
                    <span className="font-bold text-slate-700">{averageWaitTime} Mins</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                    <div className="bg-slate-900 h-full" style={{ width: `${Math.min(100, (averageWaitTime/45)*100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xxs font-bold text-slate-500 mb-1">
                    <span>Peak Hour Jam Load</span>
                    <span className="font-bold text-slate-700">11:00 AM - 1:00 PM</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                    <div className="bg-slate-600 h-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xxs font-bold text-slate-500 mb-1">
                    <span>Avg Consultation Duration</span>
                    <span className="font-bold text-slate-700">10 Mins / Patient</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                    <div className="bg-slate-400 h-full" style={{ width: '35%' }}></div>
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
