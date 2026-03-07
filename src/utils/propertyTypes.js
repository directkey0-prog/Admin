export const APARTMENT_SUB_TYPES = [
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'semi_detached', label: 'Semi-Detached' },
  { value: 'detached', label: 'Detached House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'terrace', label: 'Terrace' },
  { value: 'mansion', label: 'Mansion' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio Apartment' },
  { value: 'self_contain', label: 'Self-Contain' },
];

export const ADMIN_CATEGORIES = [
  { value: 'apartment_type', label: 'Apartment Type' },
  { value: 'land', label: 'Land' },
  { value: 'shortlet', label: 'Shortlet' },
  { value: 'event_hall', label: 'Event Hall' },
  { value: 'office_space', label: 'Office Space' },
];

export const CATEGORY_LABELS = {
  apartment_type: 'Apartment',
  land: 'Land',
  shortlet: 'Shortlet',
  event_hall: 'Event Hall',
  office_space: 'Office Space',
};

export const getTypeDisplay = (property) => {
  if (property.property_category === 'apartment_type' && property.apartment_sub_type) {
    return APARTMENT_SUB_TYPES.find((t) => t.value === property.apartment_sub_type)?.label || 'Apartment';
  }
  return CATEGORY_LABELS[property.property_category] || property.property_category || '';
};
