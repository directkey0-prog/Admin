import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiEye, FiSearch, FiX } from 'react-icons/fi';
import { getMessages, markMessageAsRead, deleteMessage } from '../../services/adminService';
import toast from 'react-hot-toast';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleMarkRead = async (id) => {
    await markMessageAsRead(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    toast.success('Marked as read');
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success('Message deleted');
  };

  const filtered = messages.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse shadow-sm">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <FiMail className="text-4xl text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-navy-900 mb-2">No messages</h3>
          <p className="text-sm text-gray-500">Messages from users will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer ${!msg.is_read ? 'border-l-4 border-l-primary-400' : ''}`}
              onClick={() => { setSelected(msg); if (!msg.is_read) handleMarkRead(msg.id); }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!msg.is_read ? 'bg-primary-50' : 'bg-gray-100'}`}>
                    <span className={`text-sm font-bold ${!msg.is_read ? 'text-primary-500' : 'text-gray-500'}`}>{msg.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${!msg.is_read ? 'font-bold text-navy-900' : 'font-medium text-gray-700'}`}>{msg.name}</p>
                      <span className="text-xs text-gray-400">{msg.email}</span>
                    </div>
                    <p className="text-sm font-medium text-navy-800 mt-0.5">{msg.subject}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{msg.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 border-0 bg-transparent cursor-pointer">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-navy-900">{selected.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1">From: {selected.name} ({selected.email})</p>
                  {selected.phone && <p className="text-sm text-gray-500">Phone: {selected.phone}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(selected.created_at).toLocaleString('en-NG')}</p>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center border-0 bg-transparent cursor-pointer">
                  <FiX className="text-gray-500" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.message}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;
