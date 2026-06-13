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
    <div className="space-y-6 animate-fadeIn">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock Items</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{totalCount}</h4>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">{lowStockCount}</h4>
            {lowStockCount > 0 && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md animate-pulse">Critical</span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Medicines</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{medicinesCount}</h4>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Consumables</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{consumablesCount}</h4>
        </div>
      </div>

      {/* Main split display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Management full inventory list */}
        {user.role === 'Management' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <div className="space-y-0.5">
                <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider">Inventory Registry</h3>
                <p className="text-xs font-bold text-slate-800">Track and manage hospital medicine and ward supplies</p>
              </div>
              
              {/* Add form toggler */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-600/10 active:scale-95"
              >
                {showAddForm ? 'Close Intake Form' : 'Add Stock Item'}
              </button>
            </div>

            {/* Filter search bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-55">
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 bg-white"
                placeholder="Search inventory registry by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-55">
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Item Name</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Category</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">In Stock</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Min Level</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Expiry Date</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400 italic font-bold text-xs">No stock records found matching your search.</td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const isLow = item.quantity <= item.minimumStock;
                      return (
                        <tr key={item._id} className="text-slate-650 hover:bg-slate-55 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-800 text-xs">{item.itemName}</span>
                              {isLow && (
                                <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-100/40 whitespace-nowrap animate-pulse">
                                  LOW STOCK
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xxs font-bold text-slate-500">{item.category}</td>
                          <td className={`px-6 py-4 text-xs font-black ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-xxs text-slate-450 font-bold">{item.minimumStock}</td>
                          <td className="px-6 py-4 text-xxs text-slate-450 font-bold">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRestockDirect(item._id, item.quantity)}
                              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-755 rounded-xl text-xxs font-bold transition-all cursor-pointer shadow-xxs active:scale-95"
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
          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
              <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider">My Consumables Requests</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-55">
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Requested Item</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Requested Qty</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Date Submitted</th>
                    <th className="px-6 py-3.5 text-xxs tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400 italic font-bold">No supply requests filed.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req._id} className="text-slate-650 hover:bg-slate-55 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 text-xs">{req.itemName}</td>
                        <td className="px-6 py-4 text-xxs font-bold text-slate-705">{req.quantity}</td>
                        <td className="px-6 py-4 text-xxs text-slate-450 font-bold">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            req.status === 'Approved' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100/40' 
                              : req.status === 'Pending' 
                                ? 'bg-amber-50 text-amber-700 border-amber-100/40 animate-pulse' 
                                : 'bg-rose-50 text-rose-700 border-rose-100/40'
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
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium">
              <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Submit Consumables Drawing
              </h3>

              {reqMsg && (
                <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2.5 rounded-2xl mb-4 border border-emerald-100/40 font-bold animate-scaleUp">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{reqMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    value={reqItemName}
                    onChange={(e) => setReqItemName(e.target.value)}
                  >
                    <option value="Nitrile Gloves (Box)">Nitrile Gloves (Box)</option>
                    <option value="Surgical Masks (Box)">Surgical Masks (Box)</option>
                    <option value="Sterile Syringes 5ml">Sterile Syringes 5ml</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity Required</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="e.g. 15"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-indigo-600/10 active:scale-95"
                >
                  Submit Supply Request
                </button>
              </form>
            </div>
          )}

          {/* Management specific: Approval requests grid */}
          {user.role === 'Management' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col h-full">
              <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Pending Ward Requests ({requests.filter(r => r.status === 'Pending').length})
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
                {requests.filter(r => r.status === 'Pending').length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-8 font-bold">No pending requests.</p>
                ) : (
                  requests.filter(r => r.status === 'Pending').map((req) => (
                    <div key={req._id} className="p-4 bg-slate-55 rounded-2xl border border-slate-100/50 space-y-3 text-xs animate-fadeIn">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{req.itemName}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5">Quantity: {req.quantity} units</p>
                        </div>
                        <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-100/40 uppercase tracking-wider">
                          {req.requestedBy?.assignedWard || 'Ward'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                        <span className="truncate max-w-[100px]">By: {req.requestedBy?.name}</span>
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={() => approveRequest(req._id, 'Approved')}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all cursor-pointer text-xxs shadow-sm shadow-indigo-600/10 active:scale-95"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => approveRequest(req._id, 'Rejected')}
                          className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xxs active:scale-95"
                        >
                          Deny
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
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium animate-scaleUp">
              <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Add New Inventory Item
              </h3>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="e.g. Insulin Syringes"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Category</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="Medicines">Medicines</option>
                    <option value="Consumables">Consumables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Initial Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="100"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Minimum stock threshold</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="20"
                    value={newItem.minimumStock}
                    onChange={(e) => setNewItem({ ...newItem, minimumStock: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Expiry Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-indigo-600/10 active:scale-95"
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

