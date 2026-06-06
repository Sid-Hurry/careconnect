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
    <div className="space-y-6">

      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">Operational Bulletin</h3>
          <p className="text-xs text-slate-500 font-medium">Notice announcements board for hospital workflow updates.</p>
        </div>

        {user.role === 'Management' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-600 text-xs px-4 py-3 rounded-xl border border-emerald-100 font-semibold">
          {successMsg}
        </div>
      )}

      {/* Notices Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Notices Board */}
        <div className="lg:col-span-2 space-y-4">
          {notices.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-100 text-slate-400 italic">
              No bulletin notices posted yet.
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-slate-800 flex items-center">
                    {notice.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {notice.description}
                </p>

                <div className="flex items-center text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
                  <span>Posted By: <span className="text-slate-500 font-bold">{notice.postedBy?.name || 'Dr. Arthur Pendelton'}</span> ({notice.postedBy?.role || 'Management'})</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notice creation Form */}
        <div className="space-y-6">
          {showAddForm && user.role === 'Management' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fadeIn">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
                New Announcement
              </h3>

              <form onSubmit={handlePostNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notice Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Critical stock replenishments scheduled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description / Bulletin Details</label>
                  <textarea
                    required
                    rows="5"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type details of notice bulletin here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publish to Notice Board
                </button>
              </form>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-xs text-slate-500 leading-relaxed font-medium space-y-2">
            <p className="font-bold text-slate-700 uppercase tracking-wider mb-1">Notice Guidelines:</p>
            <p>1. Only Management staff are authorized to post announcements.</p>
            <p>2. Notices are propagated immediately to all nurse/doctor/reception terminal boards.</p>
            <p>3. Do not include patient sensitive records or private health data on the notice bulletin.</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Notices;
