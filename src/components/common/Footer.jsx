import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <span className="text-white font-bold text-lg">🔍 Lost&Found Portal</span>
          <p className="text-xs text-slate-500 mt-1">College Portal - Simplify claiming & reporting of lost properties.</p>
        </div>
        <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} College Lost & Found Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}
