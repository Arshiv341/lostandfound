import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';
import claimService from '../services/claimService';
import { useAuth } from '../hooks/useAuth';

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim Form state
  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [claimSubmitLoading, setClaimSubmitLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Status resolve state
  const [notes, setNotes] = useState('');
  const [resolvingClaimId, setResolvingClaimId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalAction, setModalAction] = useState('approved'); // approved / rejected

  const fetchItemAndClaims = async () => {
    setLoading(true);
    try {
      const itemData = await itemService.getItemById(id);
      setItem(itemData);

      // If reporter is the logged in user or admin, fetch claims
      if (itemData.reporter._id === user._id || user.role === 'admin' || user.role === 'super-admin') {
        const claimsData = await claimService.getItemClaims(id);
        setClaims(claimsData);
      }
    } catch (err) {
      setError('Item not found or unauthorized to view.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemAndClaims();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimSubmitLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('itemId', id);
    formData.append('proofOfOwnership', proofText);
    if (proofImage) {
      formData.append('proofImage', proofImage);
    }

    try {
      await claimService.createClaim(formData);
      setClaimSuccess(true);
      fetchItemAndClaims();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setClaimSubmitLoading(false);
    }
  };

  const handleClaimAction = async () => {
    try {
      await claimService.updateClaimStatus(resolvingClaimId, {
        status: modalAction,
        adminNotes: notes
      });
      setShowStatusModal(false);
      setNotes('');
      fetchItemAndClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve claim.');
    }
  };

  const handleDeleteItem = async () => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      try {
        await itemService.deleteItem(id);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete item.');
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

  if (error || !item) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center max-w-xl mx-auto my-8">
        <span className="text-5xl block mb-4">⚠️</span>
        <h2 className="text-xl font-bold text-slate-800">Error</h2>
        <p className="text-slate-500 mt-2 text-sm">{error || 'Item not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm">
          Go Back
        </button>
      </div>
    );
  }

  const isReporter = item.reporter._id === user._id;
  const isClaimable = item.type === 'found' && item.status === 'active' && !isReporter;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Item Info section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {item.imageUrl && (
            <div className="w-full aspect-[16/9] bg-slate-50 relative overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                item.type === 'found' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {item.type}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                {item.category}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                item.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {item.status}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">📍 {item.location}</span>
                <span className="flex items-center gap-1">📅 {new Date(item.dateLostOrFound).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-950 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>

            {/* AI Tags display */}
            {item.aiTags && item.aiTags.length > 0 && (
              <div className="border-t border-slate-50 pt-6">
                <h3 className="text-sm font-semibold text-slate-950 uppercase tracking-wider mb-3">AI Tag Annotations</h3>
                <div className="flex flex-wrap gap-2">
                  {item.aiTags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50/50 border border-indigo-100/50 text-indigo-600 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delete button for reporter */}
            {(isReporter || user.role === 'admin' || user.role === 'super-admin') && (
              <div className="border-t border-slate-50 pt-6 flex justify-end">
                <button
                  onClick={handleDeleteItem}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Claims listings for posters */}
        {isReporter && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Submitted Claims ({claims.length})</h2>
            {claims.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No claims have been submitted for this item yet.</p>
            ) : (
              <div className="space-y-6">
                {claims.map((claim) => (
                  <div key={claim._id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{claim.claimant.name}</span>
                        <span className="text-xs text-slate-400">({claim.claimant.collegeId})</span>
                      </div>
                      <p className="text-xs text-slate-500 whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-100">
                        {claim.proofOfOwnership}
                      </p>
                      {claim.proofImageUrl && (
                        <div className="w-24 aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                          <a href={claim.proofImageUrl} target="_blank" rel="noreferrer">
                            <img src={claim.proofImageUrl} alt="Proof" className="w-full h-full object-cover" />
                          </a>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">
                        Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="sm:text-right space-y-2 shrink-0">
                      {claim.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setResolvingClaimId(claim._id); setModalAction('approved'); setShowStatusModal(true); }}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { setResolvingClaimId(claim._id); setModalAction('rejected'); setShowStatusModal(true); }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {claim.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Claim Form / Reporter Sidebar */}
      <div className="lg:col-span-1">
        {isClaimable && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6 sticky top-24">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Claim this item</h2>
              <p className="text-xs text-slate-400 mt-1">Provide clear proof of ownership to verify identity.</p>
            </div>

            {claimSuccess ? (
              <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-5 rounded-2xl text-center">
                <span className="text-3xl block mb-2">🎉</span>
                <h4 className="font-bold">Claim Submitted!</h4>
                <p className="text-xs text-green-600/90 mt-1">
                  The reporter has been notified. You will receive an alert once updated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ownership Proof</label>
                  <textarea
                    required
                    rows={4}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="Describe markings, serial numbers, password pin locks, invoice purchase details..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Image Proof (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofImage(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={claimSubmitLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow transition disabled:opacity-50"
                >
                  {claimSubmitLoading ? 'Submitting Claim...' : 'Submit Claim'}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4 mt-6">
          <h3 className="text-sm font-bold text-slate-900">Reporter Contact Information</h3>
          <div className="space-y-2 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Posted by:</span> {item.reporter.name}
            </div>
            {isReporter || user.role === 'admin' || user.role === 'super-admin' || item.status === 'claimed' ? (
              <>
                <div>
                  <span className="font-semibold text-slate-700">Email:</span> {item.reporter.email}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Phone:</span> {item.reporter.phoneNumber || 'Not provided'}
                </div>
              </>
            ) : (
              <p className="text-[10px] text-slate-400 italic mt-2 border-t border-slate-50 pt-2">
                🔒 Full contact details are hidden until claims are validated.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Claim Action Modal (Approve/Reject dialog) */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Claim {modalAction.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Provide notes/instructions (e.g. pickup details or rejection reason) for the student.
              </p>
            </div>

            <div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please collect the item from security desk Block C, room 203."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-xs"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowStatusModal(false); setNotes(''); }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimAction}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition ${
                  modalAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
