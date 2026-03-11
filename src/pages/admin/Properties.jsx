import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiSearch, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { getAllProperties, deleteAdminProperty } from '../../services/adminService';
import toast from 'react-hot-toast';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

const statusConfig = {
  approved: { label: 'Approved', bg: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', bg: 'bg-yellow-100 text-yellow-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-700' },
};

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminProperty(deleteTarget.id);
      setProperties(prev => prev.filter(p => p.id !== deleteTarget.id));
      toast.success('Property deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = properties.filter(p => {
    const matchesSearch = !search || p.property_name.toLowerCase().includes(search.toLowerCase()) || p.area?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">All Properties</h1>
        <p className="text-gray-500 text-sm mt-1">{properties.length} properties on the platform</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent" />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['all', 'approved', 'pending', 'rejected'].map((key) => (
              <button key={key} onClick={() => setFilter(key)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-0 cursor-pointer whitespace-nowrap capitalize ${filter === key ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>
                {key} ({counts[key]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[...Array(5)].map((_, i) => <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-100 animate-pulse"><div className="w-14 h-10 bg-gray-200 rounded-lg" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Location</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Landlord</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price/Year</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={prop.property_images?.[0]?.image_url || 'https://picsum.photos/seed/default/100/80'} alt="" className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy-900 truncate max-w-[200px]">{prop.property_name}</p>
                          <p className="text-xs text-gray-500">{prop.property_type} - {prop.bedrooms}bd/{prop.bathrooms}ba</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600">{prop.area}</p>
                      <p className="text-xs text-gray-400">{prop.state}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-600">{prop.landlord?.full_name}</p>
                      <p className="text-xs text-gray-400">{prop.landlord?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-navy-900">{'\u20A6'}{formatPrice(prop.price_per_year)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[prop.status]?.bg || 'bg-gray-100 text-gray-700'}`}>
                        {statusConfig[prop.status]?.label || prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(prop)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                        title="Delete property"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FiHome className="text-3xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No properties found</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => !deleting && setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="text-xl text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">Delete Property</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteTarget.property_name}</strong>? All associated images and data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;
