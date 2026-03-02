import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { createAdminProperty } from '../../services/adminService';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';

const ALL_TYPES = ['Apartment', 'Duplex', 'Bungalow', 'Semi-Detached', 'Penthouse', 'Studio', 'Land', 'Shortlet'];
const allAmenities = [
  '24hr Security', 'Parking Space', 'Water Supply', 'Electricity', 'Fitted Kitchen',
  'Swimming Pool', 'Gym', 'Internet', 'Furnished', 'Elevator', 'BQ', 'Garden',
  'Security Gate', 'Gated Community', 'Concierge', 'Smart Home', 'CCTV', 'Generator',
];

const API_BASE = 'http://localhost:5000/api';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [form, setForm] = useState({
    property_name: '',
    description: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    price_per_year: '',
    price_per_night: '',
    min_nights: '1',
    state: '',
    local_government: '',
    area: '',
    amenities: [],
  });
  const [locationData, setLocationData] = useState({ states: [], lgas: [] });
  const [errors, setErrors] = useState({});

  const isLand = form.property_type === 'Land';
  const isShortlet = form.property_type === 'Shortlet';

  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await fetch(`${API_BASE}/locations/states`);
        const data = await res.json();
        setLocationData(prev => ({ ...prev, states: Array.isArray(data) ? data : [] }));
      } catch {
        // fallback: major states
        setLocationData(prev => ({ ...prev, states: ['Lagos', 'Abuja', 'Rivers', 'Oyo', 'Kano', 'Delta', 'Edo', 'Ogun', 'Enugu', 'Kaduna', 'Imo', 'Anambra', 'Cross River', 'Akwa Ibom', 'Kwara', 'Osun', 'Ekiti', 'Ondo', 'Benue', 'Plateau', 'Nassarawa', 'Niger', 'Kogi', 'Sokoto', 'Kebbi', 'Zamfara', 'Katsina', 'Jigawa', 'Yobe', 'Borno', 'Adamawa', 'Gombe', 'Bauchi', 'Taraba', 'Ebonyi', 'Abia', 'Bayelsa'] }));
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (form.state) {
      const loadLGAs = async () => {
        try {
          const res = await fetch(`${API_BASE}/locations/lgas?state=${encodeURIComponent(form.state)}`);
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
    setForm(prev => ({ ...prev, [field]: value }));
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
    if (!form.property_type) errs.property_type = 'Required';
    if (!isLand && !form.bedrooms) errs.bedrooms = 'Required';
    if (!isLand && !form.bathrooms) errs.bathrooms = 'Required';
    if (isShortlet) {
      if (!form.price_per_night || parseInt(form.price_per_night) <= 0) errs.price_per_night = 'Enter a valid nightly rate';
    } else {
      if (!form.price_per_year || parseInt(form.price_per_year) <= 0) errs.price_per_year = 'Enter a valid price';
    }
    if (!form.state) errs.state = 'Required';
    if (!form.local_government) errs.local_government = 'Required';
    if (!form.area.trim()) errs.area = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const imageList = uploadedImages.length > 0
        ? uploadedImages.map(img => img.preview || img.image_url)
        : [`https://picsum.photos/seed/${Date.now()}/800/600`];

      const payload = {
        ...form,
        bedrooms: isLand ? 0 : parseInt(form.bedrooms),
        bathrooms: isLand ? 0 : parseInt(form.bathrooms),
        price_per_year: isShortlet ? 0 : parseInt(form.price_per_year),
        price_per_night: isShortlet ? parseInt(form.price_per_night) : 0,
        min_nights: isShortlet ? parseInt(form.min_nights) : 0,
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

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Add Property</h1>
        <p className="text-gray-500 text-sm mt-1">
          Properties added here are auto-approved and go live immediately. Use this to add shortlets and featured listings.
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
              <select value={form.property_type} onChange={(e) => updateField('property_type', e.target.value)} className={inputClass('property_type')}>
                <option value="">Select type</option>
                {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.property_type && <p className="text-xs text-red-500 mt-1">{errors.property_type}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-4">Pricing</h2>
          {isShortlet ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per Night ({'\u20A6'}) *</label>
                <input
                  type="number"
                  value={form.price_per_night}
                  onChange={(e) => updateField('price_per_night', e.target.value)}
                  placeholder="e.g., 45000"
                  min="0"
                  className={inputClass('price_per_night')}
                />
                {errors.price_per_night && <p className="text-xs text-red-500 mt-1">{errors.price_per_night}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Nights</label>
                <input
                  type="number"
                  value={form.min_nights}
                  onChange={(e) => updateField('min_nights', e.target.value)}
                  placeholder="1"
                  min="1"
                  className={inputClass('min_nights')}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isLand ? 'Asking Price' : 'Annual Rent'} ({'\u20A6'}) *
              </label>
              <input
                type="number"
                value={form.price_per_year}
                onChange={(e) => updateField('price_per_year', e.target.value)}
                placeholder={isLand ? 'e.g., 25000000' : 'e.g., 3600000'}
                min="0"
                className={inputClass('price_per_year')}
              />
              {errors.price_per_year && <p className="text-xs text-red-500 mt-1">{errors.price_per_year}</p>}
            </div>
          )}
        </div>

        {/* Property Details — not for Land */}
        {!isLand && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-navy-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms *</label>
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

        {/* Amenities — not for Land */}
        {!isLand && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-navy-900 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map(amenity => (
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-navy-900 mb-1">Property Images</h2>
          <p className="text-xs text-gray-500 mb-4">Upload photos of the property. Leave empty to use a placeholder image.</p>
          <ImageUploader images={uploadedImages} onChange={setUploadedImages} />
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
    </div>
  );
};

export default AddProperty;
