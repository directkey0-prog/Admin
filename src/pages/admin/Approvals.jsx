import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle, FiXCircle, FiHome, FiMapPin, FiUser,
  FiEye, FiX, FiChevronLeft, FiChevronRight, FiPhone, FiMail,
} from 'react-icons/fi';
import { getPendingProperties, approveProperty, rejectProperty } from '../../services/adminService';
import { getTypeDisplay } from '../../utils/propertyTypes';
import toast from 'react-hot-toast';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

/* ─────────── Detail Modal ─────────── */
const DetailModal = ({ property: prop, onClose, onApprove, onReject, processing }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const images = prop.property_images || [];
  const isLand = prop.property_category === 'land';
  const isShortlet = prop.property_category === 'shortlet';
  const isEventHall = prop.property_category === 'event_hall';
  const isOfficeSpace = prop.property_category === 'office_space';
  const typeDisplay = getTypeDisplay(prop);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <span className="text-xs font-semibold text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full">
              {typeDisplay}
            </span>
            <h2 className="text-lg font-bold text-navy-900 mt-1">{prop.property_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center border-0 cursor-pointer text-gray-500 transition-colors flex-shrink-0"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img
                src={images[imgIndex]?.image_url}
                alt={`Image ${imgIndex + 1}`}
                className="w-full h-80 object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center border-0 cursor-pointer transition-colors"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center border-0 cursor-pointer transition-colors"
                  >
                    <FiChevronRight />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                {imgIndex + 1} / {images.length}
              </div>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${i === imgIndex ? 'border-primary-400' : 'border-transparent'}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Price & Key Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-primary-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-0.5">
                {isEventHall ? 'Per Hour' : isShortlet ? 'Per Night' : isLand ? 'Asking Price' : 'Annual Rent'}
              </p>
              <p className="font-bold text-navy-900 text-sm">
                {'\u20A6'}{formatPrice(
                  isEventHall ? prop.price_per_hour :
                  isShortlet ? prop.price_per_night :
                  prop.price_per_year
                )}
              </p>
            </div>
            {isEventHall && (
              <div className="bg-gray-50 rounded-xl p-3 text-center col-span-2">
                <p className="text-xs text-gray-500 mb-0.5">Capacity</p>
                <p className="font-bold text-navy-900 text-sm">{prop.capacity} guests</p>
              </div>
            )}
            {!isLand && !isEventHall && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">{isOfficeSpace ? 'Rooms' : 'Bedrooms'}</p>
                <p className="font-bold text-navy-900 text-sm">{prop.bedrooms}</p>
              </div>
            )}
            {!isLand && !isEventHall && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">Bathrooms</p>
                <p className="font-bold text-navy-900 text-sm">{prop.bathrooms}</p>
              </div>
            )}
            {isLand && prop.land_area && (
              <div className="bg-gray-50 rounded-xl p-3 text-center col-span-2">
                <p className="text-xs text-gray-500 mb-0.5">Land Size</p>
                <p className="font-bold text-navy-900 text-sm">{prop.land_area} {prop.land_unit || 'sqm'}</p>
              </div>
            )}
            {isShortlet && prop.min_nights > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">Min. Nights</p>
                <p className="font-bold text-navy-900 text-sm">{prop.min_nights}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold text-navy-900 text-sm mb-2 flex items-center gap-2">
              <FiMapPin className="text-primary-400" /> Location
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
              {prop.area}, {prop.local_government}, {prop.state}
            </p>
          </div>

          {/* Description */}
          {prop.description && (
            <div>
              <h3 className="font-semibold text-navy-900 text-sm mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">{prop.description}</p>
            </div>
          )}

          {/* Amenities */}
          {!isLand && !isOfficeSpace && prop.amenities && prop.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold text-navy-900 text-sm mb-2">{isEventHall ? 'Event Hall Facilities' : 'Amenities'}</h3>
              <div className="flex flex-wrap gap-2">
                {prop.amenities.map((a) => (
                  <span key={a} className="text-xs bg-primary-50 text-primary-600 font-medium px-3 py-1.5 rounded-lg border border-primary-100">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Landlord Info */}
          <div className="bg-navy-50 rounded-xl p-4">
            <h3 className="font-semibold text-navy-900 text-sm mb-3 flex items-center gap-2">
              <FiUser className="text-navy-500" /> Landlord Information
            </h3>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-navy-900">{prop.landlord?.full_name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FiMail className="text-gray-400 flex-shrink-0" /> {prop.landlord?.email}
              </p>
              {prop.landlord?.phone && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FiPhone className="text-gray-400 flex-shrink-0" /> {prop.landlord.phone}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Submitted {new Date(prop.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={() => onApprove(prop.id)}
            disabled={!!processing}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-semibold transition-all border-0 cursor-pointer disabled:opacity-50"
          >
            <FiCheckCircle /> {processing === prop.id ? 'Approving...' : 'Approve Property'}
          </button>
          <button
            onClick={() => onReject(prop.id)}
            disabled={!!processing}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <FiXCircle /> Reject
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────── Main Page ─────────── */
const Approvals = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(null);
  const [detailProperty, setDetailProperty] = useState(null);

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
      setDetailProperty(null);
      toast.success('Property approved');
    } catch (err) {
      toast.error('Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const openReject = (id) => {
    setDetailProperty(null);
    setRejectModal(id);
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
                        <span className="bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{getTypeDisplay(prop)}</span>
                        <h3 className="font-bold text-navy-900 mt-2">{prop.property_name}</h3>
                      </div>
                      <p className="text-lg font-bold text-navy-900 flex-shrink-0">
                        {'\u20A6'}{formatPrice(
                          prop.property_category === 'shortlet' ? prop.price_per_night :
                          prop.property_category === 'event_hall' ? prop.price_per_hour :
                          prop.price_per_year
                        )}
                        <span className="text-xs font-normal text-gray-500">
                          {prop.property_category === 'shortlet' ? '/night' : prop.property_category === 'event_hall' ? '/hr' : '/yr'}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><FiMapPin className="text-primary-400" /> {prop.area}, {prop.state}</span>
                      <span className="flex items-center gap-1"><FiUser /> {prop.landlord?.full_name}</span>
                      {prop.property_category !== 'land' && prop.property_category !== 'event_hall' && (
                        <span className="flex items-center gap-1">
                          <FiHome />
                          {prop.property_category === 'office_space'
                            ? `${prop.bedrooms} rooms / ${prop.bathrooms} bath`
                            : `${prop.bedrooms} bed / ${prop.bathrooms} bath`}
                        </span>
                      )}
                      {prop.property_category === 'land' && prop.land_area && (
                        <span className="flex items-center gap-1"><FiHome /> {prop.land_area} {prop.land_unit || 'sqm'}</span>
                      )}
                      {prop.property_category === 'event_hall' && prop.capacity && (
                        <span className="flex items-center gap-1"><FiHome /> {prop.capacity} guests</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-4">Submitted {new Date(prop.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setDetailProperty(prop)}
                        className="inline-flex items-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer"
                      >
                        <FiEye /> View Details
                      </button>
                      <button
                        onClick={() => handleApprove(prop.id)}
                        disabled={processing === prop.id}
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer disabled:opacity-50"
                      >
                        <FiCheckCircle /> {processing === prop.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => openReject(prop.id)}
                        disabled={processing === prop.id}
                        className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
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

      {/* Detail Modal */}
      <AnimatePresence>
        {detailProperty && (
          <DetailModal
            property={detailProperty}
            onClose={() => setDetailProperty(null)}
            onApprove={handleApprove}
            onReject={openReject}
            processing={processing}
          />
        )}
      </AnimatePresence>

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
