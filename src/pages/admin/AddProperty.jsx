import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import { createAdminProperty } from '../../services/adminService';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';
import { ADMIN_CATEGORIES, APARTMENT_SUB_TYPES, getTypeDisplay } from '../../utils/propertyTypes';

const allAmenities = [
  '24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'Fitted Kitchen',
  'Swimming Pool', 'Gym', 'Internet', 'Furnished', 'Elevator', 'BQ', 'Garden',
  'Security Gate', 'Gated Community', 'Concierge', 'Smart Home', 'CCTV', 'Generator',
];
const eventHallAmenities = [
  'AC', 'Sound System', 'Projector/Screen', 'Stage', 'Generator', 'Parking Space',
  'Security', 'Wi-Fi', 'LED Lighting', 'Tables & Chairs', 'Catering', 'Changing Room',
  'CCTV', 'Outdoor Space', 'Bar Area',
];

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [form, setForm] = useState({
    property_name: '',
    description: '',
    property_category: '',
    apartment_sub_type: '',
    bedrooms: '',
    bathrooms: '',
    price_per_year: '',
    price_per_night: '',
    min_nights: '1',
    price_per_hour: '',
    capacity: '',
    land_area: '',
    land_unit: 'sqm',
    state: '',
    local_government: '',
    area: '',
    amenities: [],
  });
  const [locationData, setLocationData] = useState({ states: [], lgas: [] });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const isLand = form.property_category === 'land';
  const isShortlet = form.property_category === 'shortlet';
  const isEventHall = form.property_category === 'event_hall';
  const isOfficeSpace = form.property_category === 'office_space';
  const isApartment = form.property_category === 'apartment_type';

  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await fetch(`${API_BASE}/locations/states`);
        const data = await res.json();
        setLocationData(prev => ({ ...prev, states: Array.isArray(data) ? data : [] }));
      } catch {
        setLocationData(prev => ({ ...prev, states: ['Lagos', 'Abuja', 'Rivers', 'Oyo', 'Kano', 'Delta', 'Edo', 'Ogun', 'Enugu', 'Kaduna', 'Imo', 'Anambra', 'Cross River', 'Akwa Ibom', 'Kwara', 'Osun', 'Ekiti', 'Ondo', 'Benue', 'Plateau', 'Nassarawa', 'Niger', 'Kogi', 'Sokoto', 'Kebbi', 'Zamfara', 'Katsina', 'Jigawa', 'Yobe', 'Borno', 'Adamawa', 'Gombe', 'Bauchi', 'Taraba', 'Ebonyi', 'Abia', 'Bayelsa'] }));
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (form.state) {
      const loadLGAs = async () => {
        try {
          const res = await fetch(`${API_BASE}/locations/lgas/${encodeURIComponent(form.state)}`);
          const data = await res.json();
          setLocationData(prev => ({ ...prev, lgas: Array.isArray(data) ? data : [] }));
        } catch {
          setLocationData(prev => ({ ...prev, lgas: [] }));
        }
      };
      loadLGAs();
      setForm(prev => ({ ...prev, local_government: '', area: '' }));
    } else {
      setLocationData(prev => ({ ...prev, lgas: [] }));
    }
  }, [form.state]);

  const updateField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'property_category') next.apartment_sub_type = '';
      return next;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.property_name.trim()) errs.property_name = 'Required';
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.property_category) errs.property_category = 'Required';
    if (isApartment && !form.apartment_sub_type) errs.apartment_sub_type = 'Required';
    if (!isLand && !isEventHall && !form.bedrooms) errs.bedrooms = 'Required';
    if (!isLand && !isEventHall && !form.bathrooms) errs.bathrooms = 'Required';
    if (isEventHall) {
      if (!form.price_per_hour || parseInt(form.price_per_hour) <= 0) errs.price_per_hour = 'Enter a valid hourly rate';
      if (!form.capacity || parseInt(form.capacity) <= 0) errs.capacity = 'Enter a valid capacity';
    } else if (isShortlet) {
      if (!form.price_per_night || parseInt(form.price_per_night) <= 0) errs.price_per_night = 'Enter a valid nightly rate';
    } else {
      if (!form.price_per_year || parseInt(form.price_per_year) <= 0) errs.price_per_year = 'Enter a valid price';
    }
    if (isLand && (!form.land_area || parseFloat(form.land_area) <= 0)) errs.land_area = 'Enter a valid land size';
    if (!form.state) errs.state = 'Required';
    if (!form.local_government) errs.local_government = 'Required';
    if (!form.area.trim()) errs.area = 'Required';
    const doneImages = uploadedImages.filter(img => img.status === 'done');
    if (doneImages.length === 0) errs.images = 'At least one image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      setTimeout(() => document.querySelector('.border-red-300')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const anyUploading = uploadedImages.some(img => img.status === 'uploading');
    if (anyUploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }
    setShowConfirm(false);
    setLoading(true);
    try {
      const doneImages = uploadedImages.filter(img => img.status === 'done').map(img => img.url);
      const imageList = doneImages.length > 0
        ? doneImages
        : [`https://picsum.photos/seed/${Date.now()}/800/600`];

      const payload = {
        ...form,
        property_category: form.property_category,
        apartment_sub_type: isApartment ? form.apartment_sub_type : null,
        bedrooms: (isLand || isEventHall) ? 0 : parseInt(form.bedrooms),
        bathrooms: (isLand || isEventHall) ? 0 : parseInt(form.bathrooms),
        price_per_year: (isShortlet || isEventHall) ? 0 : parseInt(form.price_per_year),
        price_per_night: isShortlet ? parseInt(form.price_per_night) : 0,
        price_per_hour: isEventHall ? parseInt(form.price_per_hour) : 0,
        capacity: isEventHall ? parseInt(form.capacity) : 0,
        min_nights: isShortlet ? parseInt(form.min_nights) : 0,
        land_area: isLand ? parseFloat(form.land_area) : null,
        land_unit: isLand ? form.land_unit : null,
        amenities: (isLand || isOfficeSpace) ? [] : form.amenities,
        images: imageList,
        status: 'approved',
        added_by: 'admin',
      };

      await createAdminProperty(payload);
      toast.success('Property added and published successfully!');
      navigate('/properties');
    } catch (err) {
      toast.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const categoryLabel = ADMIN_CATEGORIES.find(c => c.value === form.property_category)?.label || form.property_category;

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Add Property</h1>
        <p className="text-gray-500 text-sm mt-1">
          Properties added here are auto-approved and go live immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Name *</label>
              <input
                type="text"
                value={form.property_name}
                onChange={(e) => updateField('property_name', e.target.value)}
                placeholder="e.g., Luxury Shortlet Apartment in Lekki"
                className={inputClass('property_name')}
              />
              {errors.property_name && <p className="text-xs text-red-500 mt-1">{errors.property_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                placeholder="Describe the property, features, and surroundings..."
                className={inputClass('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select value={form.property_category} onChange={(e) => updateField('property_category', e.target.value)} className={inputClass('property_category')}>
                <option value="">Select category</option>
                {ADMIN_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.property_category && <p className="text-xs text-red-500 mt-1">{errors.property_category}</p>}
            </div>

            {isApartment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment Type *</label>
                <select value={form.apartment_sub_type} onChange={(e) => updateField('apartment_sub_type', e.target.value)} className={inputClass('apartment_sub_type')}>
                  <option value="">Select apartment type</option>
                  {APARTMENT_SUB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {errors.apartment_sub_type && <p className="text-xs text-red-500 mt-1">{errors.apartment_sub_type}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Pricing</h2>
          {isEventHall ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Per Hour ({'\u20A6'}) *</label>
                <input type="number" value={form.price_per_hour} onChange={(e) => updateField('price_per_hour', e.target.value)} placeholder="e.g., 150000" min="0" className={inputClass('price_per_hour')} />
                {errors.price_per_hour && <p className="text-xs text-red-500 mt-1">{errors.price_per_hour}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity (guests) *</label>
                <input type="number" value={form.capacity} onChange={(e) => updateField('capacity', e.target.value)} placeholder="e.g., 500" min="1" className={inputClass('capacity')} />
                {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
              </div>
            </div>
          ) : isShortlet ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per Night ({'\u20A6'}) *</label>
                <input type="number" value={form.price_per_night} onChange={(e) => updateField('price_per_night', e.target.value)} placeholder="e.g., 45000" min="0" className={inputClass('price_per_night')} />
                {errors.price_per_night && <p className="text-xs text-red-500 mt-1">{errors.price_per_night}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Nights</label>
                <input type="number" value={form.min_nights} onChange={(e) => updateField('min_nights', e.target.value)} placeholder="1" min="1" className={inputClass('min_nights')} />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isLand ? 'Asking Price' : 'Annual Rent'} ({'\u20A6'}) *
              </label>
              <input type="number" value={form.price_per_year} onChange={(e) => updateField('price_per_year', e.target.value)} placeholder={isLand ? 'e.g., 25000000' : 'e.g., 3600000'} min="0" className={inputClass('price_per_year')} />
              {errors.price_per_year && <p className="text-xs text-red-500 mt-1">{errors.price_per_year}</p>}
            </div>
          )}
          {isLand && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Size *</label>
              <div className="flex gap-2">
                <input type="number" value={form.land_area} onChange={(e) => updateField('land_area', e.target.value)} placeholder="e.g., 500" min="0" className={`flex-1 ${inputClass('land_area')}`} />
                <select value={form.land_unit} onChange={(e) => updateField('land_unit', e.target.value)} className="w-32 px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="sqm">sqm</option>
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="plots">Plots</option>
                </select>
              </div>
              {errors.land_area && <p className="text-xs text-red-500 mt-1">{errors.land_area}</p>}
            </div>
          )}
        </div>

        {/* Property Details — not for Land or Event Hall */}
        {!isLand && !isEventHall && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-navy-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isOfficeSpace ? 'Number of Rooms *' : 'Bedrooms *'}
                </label>
                <select value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} className={inputClass('bedrooms')}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.bedrooms && <p className="text-xs text-red-500 mt-1">{errors.bedrooms}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms *</label>
                <select value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} className={inputClass('bathrooms')}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.bathrooms && <p className="text-xs text-red-500 mt-1">{errors.bathrooms}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Location</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                <select value={form.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass('state')}>
                  <option value="">Select state</option>
                  {locationData.states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LGA *</label>
                <select value={form.local_government} onChange={(e) => updateField('local_government', e.target.value)} disabled={!form.state} className={inputClass('local_government')}>
                  <option value="">Select LGA</option>
                  {locationData.lgas.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.local_government && <p className="text-xs text-red-500 mt-1">{errors.local_government}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Area / Neighbourhood *</label>
              <textarea
                value={form.area}
                onChange={(e) => updateField('area', e.target.value)}
                rows={2}
                maxLength={200}
                placeholder="e.g., Lekki Phase 1, Ikeja GRA, Victoria Island..."
                className={inputClass('area')}
              />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
            </div>
          </div>
        </div>

        {/* Amenities — not for Land or Office Space */}
        {!isLand && !isOfficeSpace && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-navy-900 mb-4">{isEventHall ? 'Event Hall Facilities' : 'Amenities'}</h2>
            <div className="flex flex-wrap gap-2">
              {(isEventHall ? eventHallAmenities : allAmenities).map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                    form.amenities.includes(amenity)
                      ? 'bg-primary-400 text-white border-primary-400'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-400'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        <div className={`bg-white rounded-2xl shadow-sm p-6 ${errors.images ? 'ring-1 ring-red-300' : ''}`}>
          <h2 className="font-bold text-navy-900 mb-1">Property Images *</h2>
          <p className="text-xs text-gray-500 mb-4">Upload at least one photo of the property.</p>
          <ImageUploader images={uploadedImages} onChange={(imgs) => { setUploadedImages(imgs); if (errors.images) setErrors(prev => ({ ...prev, images: '' })); }} />
          {errors.images && <p className="text-xs text-red-500 mt-2">{errors.images}</p>}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition-all border-0 cursor-pointer text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FiCheck />
              Publish Property
            </>
          )}
        </motion.button>
      </form>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="text-primary-400 text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">Confirm & Publish</h3>
                  <p className="text-xs text-gray-500">This will go live immediately</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-navy-900 text-right max-w-[60%]">{form.property_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-navy-900">{categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-navy-900">{form.area}, {form.state}</span>
                </div>
                {!isShortlet && !isEventHall && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isLand ? 'Asking Price' : 'Annual Rent'}</span>
                    <span className="font-medium text-navy-900">{'\u20A6'}{Number(form.price_per_year).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white cursor-pointer transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-primary-400 hover:bg-primary-500 text-white border-0 cursor-pointer transition-all"
                >
                  Yes, Publish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProperty;
