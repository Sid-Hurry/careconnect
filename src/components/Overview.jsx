import { useGlobalContext } from '../context/Context';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Link } from 'react-router-dom';

const Overview = () => {
  const { 
    user, patients, queue, beds, admissions, inventory, alerts, notices, requests
  } = useGlobalContext();

  // Common stats computations
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  
  const waitingPatients = queue.filter(q => q.queueStatus === 'Waiting').length;
  const activeAdmissions = admissions.filter(a => a.status === 'Admitted').length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.minimumStock).length;
  const activeAlerts = alerts.filter(a => !a.resolved);
  


  // Shared component - Notice Card
  const NoticesPanel = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Notice Bulletin
        </h3>
        <Link to="/notices" className="text-xxs font-bold text-slate-500 hover:text-slate-900 hover:underline">View All &rarr;</Link>
      </div>
      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[280px] pr-1">
        {notices.length === 0 ? (
          <p className="text-slate-400 text-xs italic py-12 text-center">No notices posted recently.</p>
        ) : (
          notices.slice(0, 3).map((notice) => (
            <div key={notice._id} className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-all duration-200">
              <h4 className="text-xs font-bold text-slate-800">{notice.title}</h4>
              <p className="text-xxs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">{notice.description}</p>
              <div className="flex justify-between text-[9px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
                <span>By {notice.postedBy?.name || 'Admin'}</span>
                <span>{new Date(notice.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ==========================================
  // 1. MANAGEMENT VIEW
  // ==========================================
  const renderManagementView = () => {
    const icuBeds = beds.filter(b => b.wardType === 'ICU');
    const erBeds = beds.filter(b => b.wardType === 'Emergency');
    const genBeds = beds.filter(b => b.wardType === 'General');

    const bedChartData = [
      { name: 'ICU', Occupied: icuBeds.filter(b => b.status === 'Occupied').length, Available: icuBeds.filter(b => b.status === 'Available').length },
      { name: 'Emergency', Occupied: erBeds.filter(b => b.status === 'Occupied').length, Available: erBeds.filter(b => b.status === 'Available').length },
      { name: 'General', Occupied: genBeds.filter(b => b.status === 'Occupied').length, Available: genBeds.filter(b => b.status === 'Available').length }
    ];

    const criticalMeds = inventory.filter(i => i.quantity <= i.minimumStock);

    return (
      <div className="space-y-6">
        
        {/* Core Operational Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patients Waiting</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{waitingPatients}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Admissions</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{activeAdmissions}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Beds</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{availableBeds} <span className="text-xs font-semibold text-slate-400">({occupancyRate}% Full)</span></h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{lowStockItems}</h4>
            </div>
          </div>
        </div>

        {/* Charts and Data tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bed Occupancy Trends Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-6">
              Ward Bed Allocations
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bedChartData} barSize={36} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={10} fontWeight={600} />
                  <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={10} fontWeight={600} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', opacity: 0.5 }} 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', 
                      fontSize: '11px',
                      fontFamily: 'sans-serif',
                      padding: '10px 14px'
                    }} 
                  />
                  <Bar dataKey="Occupied" stackId="a" fill="#1e293b" radius={[0, 0, 4, 4]} name="Occupied Beds" />
                  <Bar dataKey="Available" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Available Beds" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Alerts Center */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Alerts Center ({activeAlerts.length})
              </h3>
              <Link to="/alerts" className="text-xxs font-bold text-slate-500 hover:text-slate-900 transition-colors">Manage &rarr;</Link>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] pr-1">
              {activeAlerts.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-12">No active operations alerts.</p>
              ) : (
                activeAlerts.slice(0, 4).map((alert) => (
                  <div 
                    key={alert._id} 
                    className={`p-3.5 rounded-xl border text-[11px] flex items-start space-x-3 transition-colors ${
                      alert.severity === 'Critical' 
                        ? 'bg-red-50/35 border-red-100/70 text-slate-800' 
                        : alert.severity === 'High' 
                          ? 'bg-amber-50/35 border-amber-100/70 text-slate-800' 
                          : 'bg-slate-50/50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold leading-normal text-slate-800">{alert.title}</p>
                      <div className="flex justify-between items-center mt-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className={`px-1.5 py-0.5 rounded ${alert.severity === 'Critical' ? 'bg-red-100/50 text-red-700' : alert.severity === 'High' ? 'bg-amber-100/50 text-amber-700' : 'bg-slate-100 text-slate-655'}`}>{alert.severity}</span>
                        <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Low Stock items */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-5">
              Critical Stock Depletions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-3">
                    <th className="pb-3">Item Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">In Stock</th>
                    <th className="pb-3">Par Level</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criticalMeds.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-400 italic">All stocks are above par levels.</td>
                    </tr>
                  ) : (
                    criticalMeds.slice(0, 3).map((item) => (
                      <tr key={item._id} className="text-slate-650 hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 font-semibold text-slate-800">{item.itemName}</td>
                        <td className="py-3 text-slate-500 font-medium">{item.category}</td>
                        <td className="py-3 font-bold text-red-600">{item.quantity}</td>
                        <td className="py-3 text-slate-500">{item.minimumStock}</td>
                        <td className="py-3 text-right">
                          <Link to="/inventory" className="font-bold text-slate-900 hover:text-slate-850 hover:underline">Replenish &rarr;</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <NoticesPanel />
        </div>

      </div>
    );
  };

  // ==========================================
  // 2. DOCTOR VIEW
  // ==========================================
  const renderDoctorView = () => {
    const myQueue = queue.filter(q => {
      const qDocId = q.doctor?._id || q.doctor?.id || q.doctor;
      return qDocId === user.id || qDocId === user._id;
    });
    
    const activeToken = myQueue.find(q => q.queueStatus === 'In Progress');
    const pendingConsultations = myQueue.filter(q => q.queueStatus === 'Waiting');
    const doctorAdmissionsCount = admissions.filter(a => {
      const aDocId = a.doctor?._id || a.doctor?.id || a.doctor;
      return (aDocId === user.id || aDocId === user._id) && a.status === 'Admitted';
    }).length;

    return (
      <div className="space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Consultation</p>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeToken ? activeToken.tokenNumber : 'None'}
              </h4>
              <p className="text-xxs text-slate-500 mt-1 truncate">{activeToken ? `Patient: ${activeToken.patient?.name}` : 'No active consult'}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue Waiting</p>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{pendingConsultations.length}</h4>
              <p className="text-xxs text-slate-500 mt-1">Est. delay: {pendingConsultations.length * 10} mins</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Admitted Patients</p>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{doctorAdmissionsCount}</h4>
              <p className="text-xxs text-slate-500 mt-1">Ward rounds pending</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Patient Alerts</p>
            <div>
              <h4 className="text-2xl font-extrabold text-red-600 tracking-tight">
                {alerts.filter(a => a.type === 'Admission Alert').length}
              </h4>
              <p className="text-xxs text-slate-500 mt-1">Check critical vitals</p>
            </div>
          </div>
        </div>

        {/* OPD Consultation Queue list & Notice Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                My Patient Queue ({myQueue.filter(q => q.queueStatus !== 'Completed' && q.queueStatus !== 'Cancelled').length})
              </h3>
              <Link to="/opd-queue" className="text-xxs font-bold text-slate-500 hover:text-slate-900 hover:underline">Enter Queue Panel</Link>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-3">
                    <th className="pb-3">Token</th>
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Vitals Check</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myQueue.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-400 italic">No patients currently queued for you.</td>
                    </tr>
                  ) : (
                    myQueue.slice(0, 4).map((entry) => (
                      <tr key={entry._id} className="text-slate-650 hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 font-semibold text-slate-800">{entry.tokenNumber}</td>
                        <td className="py-3 font-bold text-slate-800">{entry.patient?.name}</td>
                        <td className="py-3 text-xxs">
                          {entry.patient?.currentVitals ? (
                            <span className="text-slate-500">BP: {entry.patient.currentVitals.bloodPressure} | O2: {entry.patient.currentVitals.oxygenLevel}%</span>
                          ) : (
                            <span className="text-slate-400">Pending vitals</span>
                          )}
                        </td>
                        <td className="py-3">
                          {entry.priority ? (
                            <span className="bg-red-50 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-150">Critical</span>
                          ) : (
                            <span className="text-slate-450">Routine</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                            entry.queueStatus === 'In Progress' 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : entry.queueStatus === 'Waiting' 
                                ? 'bg-slate-50 text-slate-700 border-slate-200' 
                                : 'bg-slate-100 text-slate-450 border-transparent'
                          }`}>{entry.queueStatus}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <NoticesPanel />
        </div>
      </div>
    );
  };

  // ==========================================
  // 3. NURSE VIEW
  // ==========================================
  const renderNurseView = () => {
    const assignedWard = user.assignedWard || 'ICU';
    
    // Filter beds by nurse's assigned ward
    const wardBeds = beds.filter(b => b.wardType === assignedWard);
    const wardOccupiedCount = wardBeds.filter(b => b.status === 'Occupied').length;
    const wardAvailableCount = wardBeds.length - wardOccupiedCount;

    // Filter consumable requests submitted by this nurse
    const myRequests = requests.filter(r => {
      const rBy = r.requestedBy?._id || r.requestedBy?.id || r.requestedBy;
      const uId = user._id || user.id;
      return rBy === uId;
    });

    return (
      <div className="space-y-6">
        
        {/* Core Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Ward</p>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{assignedWard}</h4>
              <p className="text-xxs text-slate-500 mt-1">Ward floor rounds checklist</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beds Occupied</p>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{wardOccupiedCount} <span className="text-sm font-semibold text-slate-400">/ {wardBeds.length}</span></h4>
              <p className="text-xxs text-slate-500 mt-1">{wardAvailableCount} open beds available</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Pending Requests</p>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {myRequests.filter(r => r.status === 'Pending').length}
              </h4>
              <p className="text-xxs text-slate-500 mt-1">Consumables drawing</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between h-28">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ward Alerts</p>
            <div>
              <h4 className="text-2xl font-extrabold text-red-650 tracking-tight">
                {alerts.filter(a => a.type === 'Bed Alert' || a.type === 'Inventory Alert').length}
              </h4>
              <p className="text-xxs text-slate-500 mt-1">Action required</p>
            </div>
          </div>
        </div>

        {/* Beds and Requests layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ward Bed grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {assignedWard} Beds Occupancy Matrix
              </h3>
              <Link to="/beds" className="text-xxs font-bold text-slate-500 hover:text-slate-900 hover:underline">Open Wards</Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {wardBeds.map(bed => (
                <div 
                  key={bed._id}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-sm ${
                    bed.status === 'Occupied' 
                      ? 'border-red-200 bg-red-50/15' 
                      : 'border-slate-200 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800">{bed.bedNumber}</span>
                  <span className={`text-[9px] font-bold uppercase mt-0.5 ${bed.status === 'Occupied' ? 'text-red-650' : 'text-emerald-700'}`}>{bed.status}</span>
                </div>
              ))}
              {wardBeds.length === 0 && (
                <p className="col-span-full py-4 text-center text-slate-400 text-xs italic">No beds configured for ward {assignedWard}</p>
              )}
            </div>
          </div>

          <NoticesPanel />
        </div>
      </div>
    );
  };

  // ==========================================
  // 4. RECEPTION VIEW
  // ==========================================
  const renderReceptionView = () => {
    // Basic stats
    const todayRegCount = patients.length; 
    const totalActiveTokens = queue.filter(q => q.queueStatus === 'Waiting' || q.queueStatus === 'In Progress').length;
    const pendingAdmissionsCount = admissions.filter(a => a.status === 'Pending').length;

    return (
      <div className="space-y-6">
        
        {/* Core Reception Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registrations Today</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{todayRegCount}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Queue Tokens</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{totalActiveTokens}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Admissions</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{pendingAdmissionsCount}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beds Available</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{availableBeds} <span className="text-xs font-semibold text-slate-400">/ {totalBeds}</span></h4>
            </div>
          </div>
        </div>

        {/* Quick links & notice panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-5">
              Reception Desk Shortcuts
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/patients" state={{ openRegForm: true }} className="p-5 border border-slate-200/60 rounded-xl hover:bg-slate-50/50 hover:shadow-xs transition-all flex flex-col justify-between group">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">Patient Registration Intake</h4>
                  <p className="text-xxs text-slate-500 mt-1.5 leading-relaxed font-medium">Register new patient records, phone numbers, addresses, and initial medical history files.</p>
                </div>
                <span className="text-xxs font-bold text-slate-900 mt-4 inline-flex items-center">Open Intake Form &rarr;</span>
              </Link>

              <Link to="/opd-queue" className="p-5 border border-slate-200/60 rounded-xl hover:bg-slate-50/50 hover:shadow-xs transition-all flex flex-col justify-between group">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">Generate OPD Queue Tokens</h4>
                  <p className="text-xxs text-slate-500 mt-1.5 leading-relaxed font-medium">Assign patients to doctor waiting lists, apply urgency check flags, and estimate start times.</p>
                </div>
                <span className="text-xxs font-bold text-slate-900 mt-4 inline-flex items-center">Go to Queue Panel &rarr;</span>
              </Link>
            </div>
          </div>

          <NoticesPanel />
        </div>

      </div>
    );
  };

  // Switch dashboards based on active role
  const getOverviewScreen = () => {
    switch (user?.role) {
      case 'Management':
        return renderManagementView();
      case 'Doctor':
        return renderDoctorView();
      case 'Nurse':
        return renderNurseView();
      case 'Reception Staff':
        return renderReceptionView();
      default:
        return (
          <div className="bg-white p-6 text-center rounded-lg border border-slate-200">
            <p className="text-slate-500 text-xs italic">User role details could not be parsed. Access restricted.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Dashboard View */}
      {getOverviewScreen()}
    </div>
  );
};

export default Overview;
