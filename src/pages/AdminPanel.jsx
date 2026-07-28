import React, { useState, useEffect } from 'react';
import claimService from '../services/claimService';
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentClaims, setRecentClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats (available to admin & super-admin)
      const data = await claimService.getDashboardStats();
      setStats(data.stats);
      setRecentClaims(data.recentClaims);

      // Fetch users list (available to super-admin only)
      if (user.role === 'super-admin') {
        const usersData = await claimService.getAllUsers();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await claimService.updateUserRole(userId, { role: newRole });
        fetchAdminData();
      } catch (error) {
        alert('Failed to update role.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  const isSuperAdmin = user.role === 'super-admin';

  return (
    <div className="space-y-8 flex-grow">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Control Panel</h1>
        <p className="text-slate-500 mt-1">Monitor campus lost & found metrics and configure settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'stats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Overview & Metrics
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition ${
              activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            User Permissions
          </button>
        )}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Registered Users</span>
              <span className="text-3xl font-extrabold text-slate-900 block mt-2">{stats.totalUsers}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Active Lost Items</span>
              <span className="text-3xl font-extrabold text-slate-900 block mt-2">{stats.totalLost}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Active Found Items</span>
              <span className="text-3xl font-extrabold text-slate-900 block mt-2">{stats.totalFound}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Claimed / Resolved Items</span>
              <span className="text-3xl font-extrabold text-slate-900 block mt-2">{stats.totalClaimed}</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Claim Activity</h3>
            {recentClaims.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No recent claim activities reported.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Claimant</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {recentClaims.map((claim) => (
                      <tr key={claim._id} className="text-slate-700">
                        <td className="py-3 font-semibold text-slate-800">{claim.item?.title || 'Unknown'}</td>
                        <td className="py-3">{claim.claimant?.name} ({claim.claimant?.email})</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                            claim.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-slate-400">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Permissions Tab */}
      {activeTab === 'users' && isSuperAdmin && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Registered College Members</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">College ID</th>
                  <th className="pb-3">Current Role</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u._id} className="text-slate-700">
                    <td className="py-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="py-4">{u.email}</td>
                    <td className="py-4 font-mono text-xs">{u.collegeId}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        u.role === 'super-admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {u._id !== user._id && (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
