import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { TbCurrencyNaira } from 'react-icons/tb';
import { getAllTransactions } from '../../services/adminService';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

const formatCompact = (amount) => {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return formatPrice(amount);
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = transactions.filter(t => {
    if (!search) return true;
    const s = search.toLowerCase();
    return t.tenant_name.toLowerCase().includes(s) || t.property_name.toLowerCase().includes(s) || t.reference.toLowerCase().includes(s);
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">{transactions.length} total transactions</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-navy-900 truncate">{'\u20A6'}{formatCompact(totalRevenue)}</p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-navy-900">{transactions.length}</p>
          <p className="text-xs text-gray-500">Total Payments</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-navy-900 truncate">{'\u20A6'}{formatCompact(transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0)}</p>
          <p className="text-xs text-gray-500">Average Payment</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tenant, property, or reference..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reference</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tenant</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Property</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-navy-900">{tx.reference}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-navy-900">{tx.tenant_name}</p>
                      <p className="text-xs text-gray-500">{tx.tenant_email}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">{tx.property_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-green-600">{'\u20A6'}{formatPrice(tx.amount)}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'successful' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <TbCurrencyNaira className="text-3xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No transactions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;
