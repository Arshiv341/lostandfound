import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  const isFound = item.type === 'found';
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group">
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <span className="text-3xl mb-1">📦</span>
            <span className="text-xs">No image provided</span>
          </div>
        )}
        
        {/* Type Badge */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
          isFound 
            ? 'bg-emerald-500 text-white' 
            : 'bg-indigo-500 text-white'
        }`}>
          {item.type.toUpperCase()}
        </span>

        {/* Status Badge */}
        <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-white/90 backdrop-blur-sm ${
          item.status === 'active' ? 'text-blue-600' :
          item.status === 'claimed' ? 'text-green-600' : 'text-slate-600'
        }`}>
          {item.status.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          {item.category}
        </span>
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-indigo-600 transition">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        {/* Meta details */}
        <div className="border-t border-slate-50 pt-4 flex flex-col space-y-2">
          <div className="flex items-center text-xs text-slate-400 space-x-1">
            <span>📍</span>
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400 space-x-1">
            <span>📅</span>
            <span>{new Date(item.dateLostOrFound).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-5">
          <Link 
            to={`/items/${item._id}`} 
            className="w-full text-center block text-sm font-semibold py-2.5 px-4 rounded-xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/20 text-slate-600 hover:text-indigo-600 transition duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
