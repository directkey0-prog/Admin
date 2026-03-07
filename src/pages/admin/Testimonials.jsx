import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/adminService';
import toast from 'react-hot-toast';

const emptyForm = { customer_name: '', customer_title: '', customer_location: '', testimonial_text: '', rating: 5 };

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ customer_name: t.customer_name, customer_title: t.customer_title, customer_location: t.customer_location || '', testimonial_text: t.testimonial_text, rating: t.rating }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.customer_name || !form.customer_title || !form.testimonial_text) {
      toast.error('Please fill all fields');
      return;
    }
    if (editing) {
      await updateTestimonial(editing.id, form);
      setTestimonials(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast.success('Testimonial updated');
    } else {
      const newT = await createTestimonial(form);
      setTestimonials(prev => [...prev, newT]);
      toast.success('Testimonial added');
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    await deleteTestimonial(id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast.success('Testimonial deleted');
  };

  const handleToggle = async (t) => {
    await updateTestimonial(t.id, { is_active: !t.is_active });
    setTestimonials(prev => prev.map(item => item.id === t.id ? { ...item, is_active: !item.is_active } : item));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer reviews shown on the homepage</p>
        </div>
        <button onClick={openNew} className="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border-0 cursor-pointer transition-all">
          <FiPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <FiStar className="text-4xl text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-navy-900 mb-2">No testimonials yet</h3>
          <p className="text-sm text-gray-500">Add testimonials to display on the homepage</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, index) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`bg-white rounded-2xl shadow-sm p-6 ${!t.is_active ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`text-sm ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(t)} className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${t.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{t.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 border-0 bg-transparent cursor-pointer"><FiEdit2 className="text-sm" /></button>
                  <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 border-0 bg-transparent cursor-pointer"><FiTrash2 className="text-sm" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.testimonial_text}"</p>
              <div>
                <p className="text-sm font-semibold text-navy-900">{t.customer_name}</p>
                <p className="text-xs text-gray-500">{t.customer_title}</p>
                {t.customer_location && <p className="text-xs text-primary-400 mt-0.5">{t.customer_location}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-navy-900">{editing ? 'Edit' : 'Add'} Testimonial</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center border-0 bg-transparent cursor-pointer"><FiX /></button>
              </div>
              <div className="space-y-4">
                <input type="text" value={form.customer_name} onChange={(e) => setForm(p => ({ ...p, customer_name: e.target.value }))} placeholder="Customer name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <input type="text" value={form.customer_title} onChange={(e) => setForm(p => ({ ...p, customer_title: e.target.value }))} placeholder="Title (e.g., Tenant, Landlord)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <input type="text" value={form.customer_location} onChange={(e) => setForm(p => ({ ...p, customer_location: e.target.value }))} placeholder="Location (e.g., Lekki, Lagos)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <textarea value={form.testimonial_text} onChange={(e) => setForm(p => ({ ...p, testimonial_text: e.target.value }))} rows={4} placeholder="Testimonial text..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))} className={`w-10 h-10 rounded-lg border-0 cursor-pointer flex items-center justify-center text-sm font-bold transition-all ${form.rating >= n ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleSave} className="w-full bg-primary-400 hover:bg-primary-500 text-white py-3 rounded-xl font-semibold text-sm border-0 cursor-pointer transition-all">{editing ? 'Update' : 'Add'} Testimonial</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;
