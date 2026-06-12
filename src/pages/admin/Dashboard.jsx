import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCheckCircle, FiClock, FiXCircle, FiUsers, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { TbCurrencyNaira } from 'react-icons/tb';
import { getStatistics, getPendingProperties, getAllTransactions } from '../../services/adminService';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, pendingData, txData] = await Promise.all([
          getStatistics(),
          getPendingProperties(),
          getAllTransactions(),
        ]);
        setStats(statsData);
        setPending(pendingData);
        setRecentTx(txData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse"><div className="h-20" /></div>)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Properties', value: stats?.totalProperties || 0, icon: FiHome, color: 'bg-blue-50 text-blue-600', sub: `${stats?.approvedProperties || 0} approved` },
    { label: 'Pending Review', value: stats?.pendingProperties || 0, icon: FiClock, color: 'bg-yellow-50 text-yellow-600', sub: 'Awaiting approval' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'bg-purple-50 text-purple-600', sub: `${stats?.totalLandlords || 0} landlords, ${stats?.totalTenants || 0} tenants` },
    { label: 'Total Revenue', value: `\u20A6${formatPrice(stats?.totalRevenue || 0)}`, icon: TbCurrencyNaira, color: 'bg-green-50 text-green-600', sub: `${stats?.totalTransactions || 0} transactions` },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="text-lg" />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-navy-900">Pending Approvals</h2>
            <Link to="/pending" className="text-sm text-primary-500 hover:underline flex items-center gap-1 no-underline">
              View all <FiArrowRight className="text-xs" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="p-8 text-center">
              <FiCheckCircle className="text-3xl text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">All caught up! No pending approvals.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pending.slice(0, 4).map((prop) => (
                <div key={prop.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <img src={prop.property_images?.[0]?.image_url || 'https://picsum.photos/seed/default/100/80'} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-900 text-sm truncate">{prop.property_name}</p>
                    <p className="text-xs text-gray-500">{prop.landlord?.full_name} - {prop.area}, {prop.state}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0">Pending</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-navy-900">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-primary-500 hover:underline flex items-center gap-1 no-underline">
              View all <FiArrowRight className="text-xs" />
            </Link>
          </div>
          {recentTx.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No transactions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiTrendingUp className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-900 text-sm truncate">{tx.tenant_name}</p>
                    <p className="text-xs text-gray-500 truncate">{tx.property_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-green-600">{'\u20A6'}{formatPrice(tx.amount)}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
