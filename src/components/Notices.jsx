import React, { useState } from 'react';
import { useGlobalContext } from '../context/Context';


const Notices = () => {
  const { user, notices, addNotice } = useGlobalContext();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePostNotice = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    await addNotice({ title, description });
    setTitle('');
    setDescription('');
    setShowAddForm(false);
    setSuccessMsg('Announcement published to Notice Board successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-premium">
        <div className="space-y-0.5">
          <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider">Operational Bulletin</h3>
          <p className="text-xs font-bold text-slate-800">Notice announcements board for hospital workflow updates.</p>
        </div>

        {user.role === 'Management' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/10 transition-all cursor-pointer active:scale-95"
          >
            {showAddForm ? 'Cancel Publish' : 'Publish Announcement'}
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-3 rounded-2xl border border-emerald-100/40 font-bold animate-scaleUp">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {/* Notices Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Notices Board */}
        <div className="lg:col-span-2 space-y-4">
          {notices.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-premium text-slate-400 font-bold italic text-xs">
              No bulletin notices posted yet.
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium hover:scale-[1.005] hover:shadow-lg transition-all duration-300 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">
                    {notice.title}
                  </h4>
                  <span className="text-[10px] text-slate-450 font-bold bg-slate-55 border border-slate-100/60 px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-bold whitespace-pre-line">
                  {notice.description}
                </p>

                <div className="flex items-center text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-100">
                  <span>Posted By: <span className="text-slate-700 font-extrabold">{notice.postedBy?.name || 'Dr. Arthur Pendelton'}</span> ({notice.postedBy?.role || 'Management'})</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notice creation Form */}
        <div className="space-y-6">
          {showAddForm && user.role === 'Management' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium animate-scaleUp">
              <h3 className="text-xxs font-bold text-slate-450 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                New Announcement
              </h3>

              <form onSubmit={handlePostNotice} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Notice Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="e.g. Critical stock replenishments scheduled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description / Bulletin Details</label>
                  <textarea
                    required
                    rows="5"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-55 text-slate-805 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                    placeholder="Type details of notice bulletin here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer text-center"
                  >
                    Publish Announcement
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-slate-55 border border-slate-100 p-5 rounded-3xl text-xxs text-slate-500 leading-relaxed font-bold space-y-2.5">
            <p className="font-extrabold text-[11px] text-slate-750 uppercase tracking-wider mb-1">Notice Guidelines:</p>
            <p>&bull; Only Management staff are authorized to post announcements.</p>
            <p>&bull; Notices are propagated immediately to all nurse/doctor/reception terminal boards.</p>
            <p>&bull; Do not include patient sensitive records or private health data on the notice bulletin.</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Notices;

