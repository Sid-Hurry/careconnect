import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';
import { FaHospitalSymbol, FaNetworkWired, FaCheckCircle, FaExchangeAlt, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const HospitalNetwork = () => {
  const { network } = useGlobalContext();
  const [transferState, setTransferState] = useState({
    hospitalId: null,
    bedType: 'ICU',
    submitting: false,
    success: false
  });

  const triggerTransferRequest = (hospitalId) => {
    setTransferState({
      hospitalId,
      bedType: 'ICU',
      submitting: false,
      success: false
    });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setTransferState(prev => ({ ...prev, submitting: true }));
    setTimeout(() => {
      setTransferState(prev => ({ ...prev, submitting: false, success: true }));
      setTimeout(() => {
        setTransferState({ hospitalId: null, bedType: 'ICU', submitting: false, success: false });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">

      {/* Top Banner introducing the city wide sharing model */}
      <div className="bg-slate-900 p-5 rounded-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-5 border border-slate-950">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <FaNetworkWired />
            <span>City-wide Integration Node</span>
          </div>
          <h2 className="text-lg font-black tracking-tight">Gurugram Emergency ICU Bed Network</h2>
          <p className="text-slate-350 text-xxs leading-relaxed font-medium">
            In times of critical ward occupancy (such as ICU bed exhaustion), the CareConnect network registry visualizes live general and intensive bed metrics at partner institutions to coordinate emergency patient transfers.
          </p>
        </div>
        <div className="shrink-0 flex items-center space-x-2 bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700 text-xxs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Synced (4 Nodes active)</span>
        </div>
      </div>

      {/* Hospital registries grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {network.map(hospital => {
          const isFull = hospital.emergencyCapacity === 'Full';
          const isHigh = hospital.emergencyCapacity === 'High';
          return (
            <div 
              key={hospital._id}
              className={`bg-white rounded-lg p-5 border transition-all flex flex-col justify-between ${
                isFull 
                  ? 'border-red-200 border-t-4 border-t-red-500' 
                  : isHigh 
                    ? 'border-slate-200 border-t-4 border-t-amber-500' 
                    : 'border-slate-200 border-t-4 border-t-slate-755'
              }`}
            >
              <div className="space-y-4">
                {/* Hospital Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850 flex items-center">
                      <FaHospitalSymbol className="mr-2 text-slate-500" />
                      {hospital.hospitalName}
                    </h3>
                    <p className="text-xxs text-slate-450 flex items-center font-semibold uppercase tracking-wider">
                      <FaMapMarkerAlt className="mr-1 text-slate-450" />
                      {hospital.location}
                    </p>
                  </div>
                  
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                    isFull 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : isHigh 
                        ? 'bg-slate-50 text-slate-700 border-slate-250' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    Load: {hospital.emergencyCapacity}
                  </span>
                </div>

                {/* Beds metrics split */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-3 rounded border border-slate-200/50 text-center">
                  <div>
                    <h4 className="text-base font-bold text-slate-850">{hospital.availableICUBeds}</h4>
                    <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">ICU Beds</p>
                  </div>
                  <div className="border-x border-slate-200">
                    <h4 className="text-base font-bold text-slate-855">{hospital.availableBeds}</h4>
                    <p className="text-[9px] text-slate-455 font-bold uppercase tracking-wider mt-0.5">Gen Beds</p>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-850">{hospital.totalBeds}</h4>
                    <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">Total Cap</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3 mt-6 border-t border-slate-100 pt-4">
                <button
                  disabled={hospital.availableICUBeds === 0}
                  onClick={() => triggerTransferRequest(hospital)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <FaExchangeAlt />
                  <span>Transfer Request</span>
                </button>
                <button
                  onClick={() => alert(`Calling ${hospital.hospitalName} Coordinator Desk at +91 98888 77777`)}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center"
                >
                  <FaPhoneAlt />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Request Overlay */}
      {transferState.hospitalId && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xl max-w-sm w-full animate-scaleUp">
            
            {transferState.success ? (
              <div className="text-center py-6 space-y-3">
                <FaCheckCircle className="text-4xl text-slate-850 mx-auto" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-850">Transfer Request Submitted</h4>
                <p className="text-xxs text-slate-500 leading-relaxed">
                  Patient ICU dispatch request logged in Gurugram regional database. Syncing with {transferState.hospitalId.hospitalName}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 border-b border-slate-150 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850 flex items-center">
                    <FaExchangeAlt className="mr-2 text-slate-500" />
                    Patient Transfer Coordinator
                  </h3>
                  <button 
                    onClick={() => setTransferState({ hospitalId: null, bedType: 'ICU', submitting: false, success: false })} 
                    className="text-slate-400 hover:text-slate-650 font-bold text-lg"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  <div className="text-xxs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                    <p className="font-bold uppercase tracking-wider text-[9px] text-slate-450">Destination Node</p>
                    <p className="font-bold text-slate-800 mt-1">{transferState.hospitalId.hospitalName}</p>
                    <p className="mt-0.5 font-medium opacity-80">{transferState.hospitalId.location}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Requested Bed Type</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 text-slate-850 focus:outline-none"
                      value={transferState.bedType}
                      onChange={(e) => setTransferState(prev => ({ ...prev, bedType: e.target.value }))}
                    >
                      <option value="ICU">Emergency ICU (Available: {transferState.hospitalId.availableICUBeds})</option>
                      <option value="General">General Inpatient (Available: {transferState.hospitalId.availableBeds})</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setTransferState({ hospitalId: null, bedType: 'ICU', submitting: false, success: false })}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={transferState.submitting}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {transferState.submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Routing Dispatch...</span>
                        </>
                      ) : (
                        <span>Send Dispatch Request</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalNetwork;
