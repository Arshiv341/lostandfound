import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import claimService from '../services/claimService';

export default function ClaimsManager() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await claimService.getMyClaims();
        setClaims(data);
      } catch (error) {
        console.error('Error fetching my claims:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 flex-grow">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Claims</h1>
        <p className="text-slate-500 mt-1">Track the status of your claims for found properties.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
          <span className="text-5xl block mb-4">📝</span>
          <h2 className="text-xl font-bold text-slate-800">No claims submitted</h2>
          <p className="text-slate-500 mt-2 text-sm">
            When you submit ownership proof for found items, they will appear here.
          </p>
          <Link to="/dashboard" className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm">
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-4">
                <div>
                  <span className="text-xs text-slate-400">Claimed Item</span>
                  <h3 className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition">
                    <Link to={`/items/${claim.item._id}`}>{claim.item.title}</Link>
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    claim.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {claim.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Submitted Proof</h4>
                  <p className="text-xs text-slate-500 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line leading-relaxed">
                    {claim.proofOfOwnership}
                  </p>
                  {claim.proofImageUrl && (
                    <div className="w-20 aspect-square rounded-xl overflow-hidden border border-slate-100 mt-2">
                      <a href={claim.proofImageUrl} target="_blank" rel="noreferrer">
                        <img src={claim.proofImageUrl} alt="Proof image" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Resolution Notes</h4>
                  {claim.adminNotes ? (
                    <p className={`text-xs p-4 rounded-2xl border leading-relaxed ${
                      claim.status === 'approved' ? 'bg-green-50/30 border-green-100 text-green-700' : 'bg-rose-50/30 border-rose-100 text-rose-700'
                    }`}>
                      {claim.adminNotes}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Pending review by the item reporter or campus security.
                    </p>
                  )}
                  {claim.status === 'approved' && (
                    <div className="text-[10px] text-emerald-600 bg-emerald-50/50 px-3 py-2 rounded-xl border border-emerald-100/50 font-medium">
                      💡 Please bring your College ID to room 203 Block C security for retrieval verification.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
