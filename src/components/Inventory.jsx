import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';


const Inventory = () => {
  const { 
    user, inventory, requests, addInventory, updateInventoryStock, submitRequest, approveRequest 
  } = useGlobalContext();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Nurse consumable request form state
  const [reqItemName, setReqItemName] = useState('Nitrile Gloves (Box)');
  const [reqQty, setReqQty] = useState('');
  const [reqMsg, setReqMsg] = useState('');

  // Admin restock form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'Medicines',
    quantity: '',
    minimumStock: '20',
    expiryDate: ''
  });

  // Filter inventory items
  const filteredInventory = inventory.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit consumable request (Nurses)
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!reqItemName || !reqQty) return;

    await submitRequest(reqItemName, Number(reqQty));
    setReqMsg('Consumables request submitted to Management!');
    setReqQty('');
    setTimeout(() => setReqMsg(''), 4000);
  };

  // Add stock item (Management)
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.quantity || !newItem.expiryDate) return;

    await addInventory(newItem);
    setNewItem({
      itemName: '',
      category: 'Medicines',
      quantity: '',
      minimumStock: '20',
      expiryDate: ''
    });
    setShowAddForm(false);
  };

  // Restock a single item directly
  const handleRestockDirect = async (itemId, currentQty) => {
    const qtyInput = prompt("Enter additional quantity to add to stock:", "50");
    if (qtyInput === null) return;
    const addQty = Number(qtyInput);
    if (isNaN(addQty) || addQty <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    await updateInventoryStock(itemId, { quantity: currentQty + addQty });
  };

  // Quick stats
  const totalCount = inventory.length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.minimumStock).length;
  const medicinesCount = inventory.filter(i => i.category === 'Medicines').length;
  const consumablesCount = inventory.filter(i => i.category === 'Consumables').length;

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-slate-800 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock Items</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{totalCount}</h4>
        </div>

        <div className={`bg-white p-5 rounded-2xl border-l-4 ${lowStockCount > 0 ? 'border-l-red-500' : 'border-l-slate-300'} border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{lowStockCount}</h4>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Medicines</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{medicinesCount}</h4>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Consumables</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{consumablesCount}</h4>
        </div>
      </div>

      {/* Main split display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Management full inventory list */}
        {user.role === 'Management' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Inventory Registry</h3>
              
              {/* Add form toggler */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Add Inventory Item
              </button>
            </div>

            {/* Filter search bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  placeholder="Search item list by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider bg-slate-50/60">
                    <th className="px-5 py-3">Item Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">In Stock</th>
                    <th className="px-5 py-3">Min Level</th>
                    <th className="px-5 py-3">Expiry Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 italic text-xs">No stock records found.</td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const isLow = item.quantity <= item.minimumStock;
                      return (
                        <tr key={item._id} className="border-b border-slate-100 text-slate-650 hover:bg-slate-50/40">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center space-x-2">
                              {isLow && (
                                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-200 whitespace-nowrap">
                                  LOW STOCK
                                </span>
                              )}
                              <span className="font-bold text-slate-850 text-xs">{item.itemName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-semibold">{item.category}</td>
                          <td className={`px-5 py-3.5 text-xs font-bold ${isLow ? 'text-red-600' : 'text-slate-850'}`}>
                            {item.quantity}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500">{item.minimumStock}</td>
                          <td className="px-5 py-3.5 text-[11px] text-slate-555 text-slate-500 font-semibold">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleRestockDirect(item._id, item.quantity)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-all cursor-pointer"
                            >
                              Restock
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Nurse view: Ward Request log */}
        {user.role === 'Nurse' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">My Consumables Requests</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider bg-slate-50/60">
                    <th className="px-5 py-3">Requested Item</th>
                    <th className="px-5 py-3">Requested Qty</th>
                    <th className="px-5 py-3">Date Submitted</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 italic text-xs">No supply requests filed.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req._id} className="border-b border-slate-100 text-slate-650 hover:bg-slate-50/40">
                        <td className="px-5 py-3.5 font-bold text-slate-850 text-xs">{req.itemName}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold">{req.quantity}</td>
                        <td className="px-5 py-3.5 text-[11px] text-slate-500 font-semibold">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                            req.status === 'Approved' 
                              ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200/35' 
                              : req.status === 'Pending' 
                                ? 'bg-amber-50/50 text-amber-700 border-amber-200/35' 
                                : 'bg-red-50/50 text-red-600 border-red-200/35'
                          }`}>{req.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Right Section: Request workflow / Approvals */}
        <div className="space-y-6">
          
          {/* Nurse specific: Request submission */}
          {user.role === 'Nurse' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                Submit Consumables Drawing
              </h3>

              {reqMsg && (
                <div className="bg-emerald-50/50 text-emerald-700 text-xs px-3.5 py-2.5 rounded-lg mb-4 border border-emerald-200/30 font-semibold">
                  {reqMsg}
                </div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Item Name</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    value={reqItemName}
                    onChange={(e) => setReqItemName(e.target.value)}
                  >
                    <option value="Nitrile Gloves (Box)">Nitrile Gloves (Box)</option>
                    <option value="Surgical Masks (Box)">Surgical Masks (Box)</option>
                    <option value="Sterile Syringes 5ml">Sterile Syringes 5ml</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Quantity Required</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="e.g. 15"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Submit Supply Request
                </button>
              </form>
            </div>
          )}

          {/* Management specific: Approval requests grid */}
          {user.role === 'Management' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col h-full">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                Pending Ward Requests ({requests.filter(r => r.status === 'Pending').length})
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                {requests.filter(r => r.status === 'Pending').length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-8">No pending replenishment requests.</p>
                ) : (
                  requests.filter(r => r.status === 'Pending').map((req) => (
                    <div key={req._id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5 text-xs animate-fadeIn">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{req.itemName}</p>
                          <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Quantity: {req.quantity} units</p>
                        </div>
                        <span className="bg-slate-150 text-slate-650 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                          {req.requestedBy?.assignedWard || 'Ward'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="flex items-center">
                          {req.requestedBy?.name}
                        </span>
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={() => approveRequest(req._id, 'Approved')}
                          className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold flex items-center justify-center cursor-pointer text-xs"
                        >
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => approveRequest(req._id, 'Rejected')}
                          className="flex-1 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center justify-center cursor-pointer text-xs"
                        >
                          <span>Deny</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Admin specific: Add Inventory form */}
          {user.role === 'Management' && showAddForm && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                Add New Inventory Item
              </h3>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Item Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="e.g. Insulin Syringes"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="Medicines">Medicines</option>
                    <option value="Consumables">Consumables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Initial Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="100"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Minimum stock threshold</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="20"
                    value={newItem.minimumStock}
                    onChange={(e) => setNewItem({ ...newItem, minimumStock: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Create Stock Record
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Inventory;
