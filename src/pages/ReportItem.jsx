import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';

export default function ReportItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lost');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [dateLostOrFound, setDateLostOrFound] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Max size is 5MB.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('dateLostOrFound', dateLostOrFound);
    if (image) {
      formData.append('image', image);
    }

    try {
      await itemService.createItem(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report Item</h1>
        <p className="text-slate-500 mt-1">Provide accurate details to trigger the AI-powered matching algorithm.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 13, Black Leather Wallet"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Post Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('lost')}
                  className={`py-3 rounded-2xl border text-sm font-bold transition ${
                    type === 'lost'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setType('found')}
                  className={`py-3 rounded-2xl border text-sm font-bold transition ${
                    type === 'found'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  I Found Something
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, size, brands, contents, or unique identifiers..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Keys">Keys</option>
                <option value="Books">Books</option>
                <option value="Cards">Cards & ID</option>
                <option value="Clothing">Clothing</option>
                <option value="Bags">Bags & Backpacks</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Campus Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block C Library, Ground floor"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date Lost or Found</label>
              <input
                type="date"
                required
                value={dateLostOrFound}
                onChange={(e) => setDateLostOrFound(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Image</label>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition">
              {imagePreview ? (
                <div className="relative w-40 aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-1.5 right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow"
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl text-indigo-500">
                  📸
                </div>
              )}

              <div className="text-center sm:text-left">
                <span className="relative cursor-pointer bg-white rounded-xl border border-slate-200 py-2.5 px-4 inline-block font-semibold text-slate-700 hover:border-indigo-500 transition text-sm">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </span>
                <p className="text-xs text-slate-400 mt-2">JPEG, PNG, WEBP up to 5MB.</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition duration-200 text-sm"
            >
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-4 px-6 rounded-2xl transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
