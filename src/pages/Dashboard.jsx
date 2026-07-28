import React, { useState, useEffect } from 'react';
import itemService from '../services/itemService';
import ItemCard from '../components/items/ItemCard';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getItems({
        search,
        type,
        category,
        location,
        page,
        limit: 12
      });
      setItems(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleReset = () => {
    setSearch('');
    setType('');
    setCategory('');
    setLocation('');
    setPage(1);
  };

  return (
    <div className="space-y-8 flex-grow flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">College Lost & Found</h1>
          <p className="text-slate-500 mt-1">Search, report, and claim lost or found items on campus.</p>
        </div>
      </div>

      {/* Filters form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <input
              type="text"
              placeholder="Search by keywords, tags (e.g. keys, phone)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
          </div>

          <div>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
            >
              <option value="">All Types (Lost/Found)</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl transition text-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-2xl transition text-sm"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Extended filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-50 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-xs"
            >
              <option value="">All Categories</option>
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Campus Location</label>
            <input
              type="text"
              placeholder="e.g. Block C, Library"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-xs"
            />
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center max-w-xl mx-auto my-8">
          <span className="text-5xl block mb-4">📭</span>
          <h2 className="text-xl font-bold text-slate-800">No items found</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Try adjusting your keywords, category tags, or submit a new post.
          </p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12 pt-6 border-t border-slate-100">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
