import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiHome, FiMapPin, FiUser } from 'react-icons/fi';
import { getPendingProperties, approveProperty, rejectProperty } from '../../services/adminService';
import toast from 'react-hot-toast';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

const Approvals = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPendingProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await approveProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property approved');
    } catch (err) {
      toast.error('Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please provide a reason'); return; }
    setProcessing(rejectModal);
    try {
      await rejectProperty(rejectModal, rejectReason);
      setProperties(prev => prev.filter(p => p.id !== rejectModal));
      toast.success('Property rejected');
      setRejectModal(null);
      setRejectReason('');
    } catch (err) {
      toast.error('Failed to reject');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Pending Approvals</h1>
        <p className="text-gray-500 text-sm mt-1">{properties.length} properties awaiting review</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-40 h-28 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-2xl text-green-500" />
          </div>
          <h3 className="font-bold text-navy-900 mb-2">All caught up!</h3>
          <p className="text-gray-500 text-sm">There are no properties pending review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {properties.map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-56 h-44 md:h-auto flex-shrink-0">
                    <img src={prop.property_images?.[0]?.image_url || 'https://picsum.photos/seed/default/400/300'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{prop.property_type}</span>
                        <h3 className="font-bold text-navy-900 mt-2">{prop.property_name}</h3>
                      </div>
                      <p className="text-lg font-bold text-navy-900 flex-shrink-0">{'\u20A6'}{formatPrice(prop.price_per_year)}<span className="text-xs font-normal text-gray-500">/yr</span></p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><FiMapPin className="text-primary-400" /> {prop.area}, {prop.state}</span>
                      <span className="flex items-center gap-1"><FiUser /> {prop.landlord?.full_name}</span>
                      <span className="flex items-center gap-1"><FiHome /> {prop.bedrooms} bed / {prop.bathrooms} bath</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">Submitted {new Date(prop.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(prop.id)}
                        disabled={processing === prop.id}
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer disabled:opacity-50"
                      >
                        <FiCheckCircle /> {processing === prop.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => setRejectModal(prop.id)}
                        disabled={processing === prop.id}
                        className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                      >
                        <FiXCircle /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { if (!processing) { setRejectModal(null); setRejectReason(''); } }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiXCircle className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 text-center mb-2">Reject Property</h3>
              <p className="text-sm text-gray-500 text-center mb-4">The landlord will be notified with your reason.</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => { setRejectModal(null); setRejectReason(''); }} disabled={processing} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer disabled:opacity-50">Cancel</button>
                <button onClick={handleReject} disabled={processing} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white border-0 cursor-pointer disabled:opacity-50">{processing ? 'Rejecting...' : 'Reject'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Approvals;
