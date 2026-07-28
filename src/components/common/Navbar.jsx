import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
                🔍
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Lost&Found
              </span>
            </Link>
            <div className="hidden sm:flex sm:space-x-8 ml-10">
              <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">
                Dashboard
              </Link>
              <Link to="/report" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">
                Report Item
              </Link>
              {user && (
                <Link to="/my-claims" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">
                  My Claims
                </Link>
              )}
              {user && (user.role === 'admin' || user.role === 'super-admin') && (
                <Link to="/admin" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100/80 transition relative"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                        {unreadCount > 0 && <span className="text-xs text-rose-500 font-medium">{unreadCount} unread</span>}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-sm">No notifications yet.</div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                markAsRead(notif._id);
                                if (notif.relatedItem) {
                                  navigate(`/items/${notif.relatedItem._id || notif.relatedItem}`);
                                  setNotifOpen(false);
                                }
                              }}
                              className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition ${!notif.isRead ? 'bg-indigo-50/20' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block ${
                                  notif.type === 'ai_match' ? 'bg-purple-100 text-purple-700' :
                                  notif.type === 'claim_status' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {notif.type === 'ai_match' ? 'AI Match' : notif.type === 'claim_status' ? 'Claim Alert' : 'Alert'}
                                </span>
                                <span className="text-[10px] text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100/80 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline-block text-sm font-medium text-slate-700">{user.name}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 text-xs border-b border-slate-50">
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">Dashboard</Link>
                      <Link to="/report" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">Report Item</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-rose-50/50 transition">Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
