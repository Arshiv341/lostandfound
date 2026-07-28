import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <span className="text-7xl block mb-4">🔍</span>
      <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-500 mt-2 max-w-sm">The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition text-sm shadow">
        Back to Dashboard
      </Link>
    </div>
  );
}
