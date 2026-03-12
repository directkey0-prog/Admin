import { useRef, useState } from 'react';
import { FiUpload, FiX, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MAX_FILES = 10;
const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const UPLOAD_URL = `${import.meta.env.VITE_BACKEND_URL}/api/upload`;

const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.urls;
};

// Each image object: { id, status: 'uploading'|'done'|'error', preview, url, name }

const ImageUploader = ({ images = [], onChange }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(`${file.name}: Only JPG, PNG, and WebP allowed`);
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`${file.name}: Must be under ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const addFiles = async (files) => {
    const remaining = MAX_FILES - images.length;
    if (remaining <= 0) { toast.error(`Maximum ${MAX_FILES} images allowed`); return; }
    const validFiles = Array.from(files).filter(validateFile).slice(0, remaining);
    if (validFiles.length === 0) return;

    // Add all immediately with uploading status and blob previews
    const pending = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      status: 'uploading',
      preview: URL.createObjectURL(file),
      url: null,
      name: file.name,
    }));
    onChange([...images, ...pending]);

    try {
      const urls = await uploadFiles(validFiles);
      onChange(prev => prev.map((img) => {
        const idx = pending.findIndex(p => p.id === img.id);
        if (idx === -1) return img;
        const url = urls[idx];
        return url ? { ...img, status: 'done', url } : { ...img, status: 'error' };
      }));
    } catch {
      toast.error('Image upload failed');
      onChange(prev => prev.map((img) =>
        pending.some(p => p.id === img.id) ? { ...img, status: 'error' } : img
      ));
    }
  };

  const removeImage = (id) => {
    const img = images.find(i => i.id === id);
    if (img?.preview?.startsWith('blob:')) URL.revokeObjectURL(img.preview);
    onChange(images.filter(i => i.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <FiUpload className="text-3xl text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700">
          Drag & drop images here, or <span className="text-primary-500">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG, WebP · Max {MAX_SIZE_MB}MB each · Up to {MAX_FILES} images
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">{images.length} / {MAX_FILES} images</p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {images.map((img, i) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-gray-100">
              <img
                src={img.url || img.preview}
                alt={img.name || `Image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {img.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
              {img.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                  <FiAlertCircle className="text-white text-xl" />
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="text-xs" />
              </button>
              {i === 0 && img.status === 'done' && (
                <span className="absolute bottom-2 left-2 bg-navy-900/80 text-white text-xs px-2 py-0.5 rounded">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
