import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiMail, FiPhone, FiHome } from 'react-icons/fi';
import { getAllUsers } from '../../services/adminService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = users.filter(u =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    all: users.length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Landlords</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered landlords</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-navy-900">{counts.all}</p>
          <p className="text-xs text-gray-500">Total Landlords</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-navy-900">{users.filter(u => u.properties_count > 0).length}</p>
          <p className="text-xs text-gray-500">With Properties</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search landlords..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent" />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <button className="px-4 py-2 rounded-lg text-xs font-medium bg-white text-navy-900 shadow-sm border-0">
              All ({counts.all})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Landlord</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Properties</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary-500">{user.full_name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy-900">{user.full_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'landlord' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-sm text-gray-500"><FiHome className="text-xs" /> {user.properties_count}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FiUsers className="text-3xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No landlords found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
