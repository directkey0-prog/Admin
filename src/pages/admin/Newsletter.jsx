import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiTrash2, FiDownload, FiSearch } from 'react-icons/fi';
import { getSubscribers, removeSubscriber } from '../../services/adminService';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSubscribers();
        setSubscribers(data);
      } catch (err) {
        console.error('Failed to load subscribers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleRemove = async (id) => {
    await removeSubscriber(id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    toast.success('Subscriber removed');
  };

  const handleExport = () => {
    const csv = 'Email,Subscribed Date\n' + subscribers.map(s => `${s.email},${new Date(s.subscribed_at).toLocaleDateString()}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const filtered = subscribers.filter(s => !search || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Newsletter</h1>
          <p className="text-gray-500 text-sm mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleExport} disabled={subscribers.length === 0} className="bg-navy-800 hover:bg-navy-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border-0 cursor-pointer transition-all disabled:opacity-50">
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <FiSend className="text-4xl text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-navy-900 mb-2">No subscribers</h3>
          <p className="text-sm text-gray-500">Newsletter subscribers will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 p-4">Email</th>
                <th className="text-left text-xs font-medium text-gray-500 p-4">Subscribed</th>
                <th className="text-left text-xs font-medium text-gray-500 p-4">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, index) => (
                <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm text-navy-900 font-medium">{sub.email}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(sub.subscribed_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${sub.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{sub.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleRemove(sub.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 border-0 bg-transparent cursor-pointer ml-auto"><FiTrash2 className="text-sm" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
