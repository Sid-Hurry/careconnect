import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';

const Beds = () => {
  const { user, beds, patients, updateBed } = useGlobalContext();
  const [selectedWard, setSelectedWard] = useState('All');
  
  // Bed allocation modal
  const [allocatingBed, setAllocatingBed] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  // Restrict wards based on Nurse permissions
  const getWardsList = () => {
    if (user.role === 'Nurse') {
      return [user.assignedWard || 'ICU'];
    }
    return ['All', 'ICU', 'Emergency', 'General'];
  };

  const wards = getWardsList();
  
  // Set default ward for Nurse if not 'All'
  React.useEffect(() => {
    if (user.role === 'Nurse') {
      setSelectedWard(user.assignedWard || 'ICU');
    }
  }, [user]);

  // Filter beds
  const filteredBeds = beds.filter(bed => {
    if (user.role === 'Nurse') {
      return bed.wardType === user.assignedWard;
    }
    if (selectedWard === 'All') return true;
    return bed.wardType === selectedWard;
  });

  // Calculate stats for filtered set
  const totalCount = filteredBeds.length;
  const occupiedCount = filteredBeds.filter(b => b.status === 'Occupied').length;
  const availableCount = totalCount - occupiedCount;
  const occupancyPercent = totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0;

  // Handle allocation submission
  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!allocatingBed) return;

    if (selectedPatientId) {
      await updateBed(allocatingBed._id, 'Occupied', selectedPatientId);
    } else {
      await updateBed(allocatingBed._id, 'Available', null);
    }
    
    setAllocatingBed(null);
    setSelectedPatientId('');
  };

  // Trigger release directly
  const handleRelease = async (bedId) => {
    if (window.confirm('Are you sure you want to release this bed?')) {
      await updateBed(bedId, 'Available', null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Ward details header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Role and ward indicators */}
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {user.role === 'Nurse' ? `Ward Beds: ${user.assignedWard}` : 'Hospital Bed Utilization'}
          </h3>
          <p className="text-xs text-slate-500">
            {user.role === 'Nurse' 
              ? `Authorized nurse view for ward: ${user.assignedWard}` 
              : 'Complete hospital layout overview'}
          </p>
        </div>

        {/* Filters: Management and Reception select wards */}
        {user.role !== 'Nurse' && (
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto overflow-x-auto">
            {wards.map(w => (
              <button
                key={w}
                onClick={() => setSelectedWard(w)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-all shrink-0 cursor-pointer ${
                  selectedWard === w 
                    ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {w} Ward
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ward stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Beds monitored</p>
          <h4 className="text-xl font-bold text-slate-900 mt-1">{totalCount}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Occupied Beds</p>
          <h4 className="text-xl font-bold text-slate-900 mt-1">{occupiedCount}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Available Beds</p>
          <h4 className="text-xl font-bold text-slate-900 mt-1">{availableCount}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Occupancy Load</p>
          <div className="flex items-center space-x-2 mt-1">
            <h4 className="text-xl font-bold text-slate-900">{occupancyPercent}%</h4>
            <span className={`w-2 h-2 rounded-full ${
              occupancyPercent >= 90 
                ? 'bg-red-500 animate-ping' 
                : occupancyPercent >= 75 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
            }`}></span>
          </div>
        </div>
      </div>

      {/* Bed occupancy grid */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredBeds.map(bed => {
            const isOccupied = bed.status === 'Occupied';
            return (
              <div
                key={bed._id}
                onClick={() => {
                  if (!isOccupied && (user.role === 'Nurse' || user.role === 'Management' || user.role === 'Reception Staff')) {
                    setAllocatingBed(bed);
                  }
                }}
                className={`p-3 rounded border flex flex-col justify-between items-center text-center cursor-pointer min-h-[120px] transition-all group ${
                  isOccupied 
                    ? 'border-l-4 border-l-red-500 border-slate-200 bg-slate-50/20 hover:bg-slate-50/40' 
                    : 'border-l-4 border-l-emerald-500 border-slate-200 bg-white hover:bg-slate-50/20'
                }`}
              >
                <div className="flex justify-between items-center w-full text-[9px] uppercase font-bold tracking-wider opacity-60">
                  <span>{bed.wardType}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                </div>

                <div className="my-auto text-center py-2">
                  <span className={`text-sm font-extrabold block tracking-tight ${isOccupied ? 'text-slate-900' : 'text-slate-700'}`}>{bed.bedNumber}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1 ${isOccupied ? 'text-red-600' : 'text-emerald-600'}`}>{bed.status}</span>
                </div>

                {isOccupied ? (
                  <div className="w-full">
                    <p className="text-[10px] font-semibold truncate text-slate-700">{bed.patient?.name}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRelease(bed._id);
                      }}
                      className="mt-0.5 text-[9px] font-bold text-slate-500 hover:text-red-650 hover:underline cursor-pointer"
                      title="Release this bed allocation"
                    >
                      Release Bed
                    </button>
                  </div>
                ) : (
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-800">Allocate &rarr;</span>
                )}
              </div>
            );
          })}
          
          {filteredBeds.length === 0 && (
            <p className="col-span-full py-12 text-center text-slate-455 italic text-xs">No beds matching ward filters.</p>
          )}
        </div>
      </div>

      {/* Bed allocation modal overlay */}
      {allocatingBed && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 border border-slate-200 max-w-sm w-full shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Allocate Bed: {allocatingBed.bedNumber} ({allocatingBed.wardType})
              </h3>
              <button onClick={() => setAllocatingBed(null)} className="text-slate-400 hover:text-slate-600 font-semibold text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Select Patient for Bed Assignment</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">-- Choose registered patient --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAllocatingBed(null)}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Beds;
