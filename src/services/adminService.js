const USE_DUMMY_DATA = true;
const API_BASE = 'http://localhost:5000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Comprehensive dummy data
let allProperties = [
  { id: 'p1', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', property_type: 'Apartment', bedrooms: 3, bathrooms: 3, price_per_year: 4500000, state: 'Lagos', local_government: 'Eti-Osa', area: 'Lekki Phase 1', status: 'approved', views_count: 142, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p1/400/300' }], created_at: '2025-12-15T10:30:00Z' },
  { id: 'p2', property_name: 'Modern 2-Bedroom Flat in Ikeja GRA', property_type: 'Apartment', bedrooms: 2, bathrooms: 2, price_per_year: 2400000, state: 'Lagos', local_government: 'Ikeja', area: 'GRA Ikeja', status: 'approved', views_count: 89, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p2/400/300' }], created_at: '2025-11-20T14:00:00Z' },
  { id: 'p3', property_name: 'Spacious 4-Bedroom Duplex in Magodo', property_type: 'Duplex', bedrooms: 4, bathrooms: 4, price_per_year: 6000000, state: 'Lagos', local_government: 'Kosofe', area: 'Magodo GRA', status: 'pending', views_count: 0, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p3/400/300' }], created_at: '2026-01-28T09:15:00Z' },
  { id: 'p4', property_name: 'Executive Studio in Victoria Island', property_type: 'Studio', bedrooms: 1, bathrooms: 1, price_per_year: 3600000, state: 'Lagos', local_government: 'Eti-Osa', area: 'Victoria Island', status: 'approved', views_count: 215, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p4/400/300' }], created_at: '2025-10-05T16:45:00Z' },
  { id: 'p5', property_name: 'Cozy 2-Bedroom Bungalow in Surulere', property_type: 'Bungalow', bedrooms: 2, bathrooms: 1, price_per_year: 1200000, state: 'Lagos', local_government: 'Surulere', area: 'Adeniran Ogunsanya', status: 'rejected', views_count: 0, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p5/400/300' }], created_at: '2026-01-10T11:20:00Z' },
  { id: 'p6', property_name: 'Premium 5-Bedroom Penthouse in Ikoyi', property_type: 'Penthouse', bedrooms: 5, bathrooms: 5, price_per_year: 25000000, state: 'Lagos', local_government: 'Eti-Osa', area: 'Ikoyi', status: 'pending', views_count: 0, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p6/400/300' }], created_at: '2026-02-01T08:00:00Z' },
  { id: 'p7', property_name: '3-Bedroom Semi-Detached in Ajah', property_type: 'Semi-Detached', bedrooms: 3, bathrooms: 3, price_per_year: 3000000, state: 'Lagos', local_government: 'Eti-Osa', area: 'Ajah', status: 'approved', views_count: 67, landlord: { full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p7/400/300' }], created_at: '2025-12-01T12:00:00Z' },
  { id: 'p8', property_name: 'Modern 3-Bedroom Flat in Wuse 2', property_type: 'Apartment', bedrooms: 3, bathrooms: 2, price_per_year: 5000000, state: 'Abuja', local_government: 'Abuja Municipal', area: 'Wuse 2', status: 'approved', views_count: 98, landlord: { full_name: 'Alhaji Musa Ibrahim', email: 'landlord2@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p8/400/300' }], created_at: '2025-11-10T09:00:00Z' },
  { id: 'p9', property_name: 'Elegant 4-Bedroom Duplex in Maitama', property_type: 'Duplex', bedrooms: 4, bathrooms: 4, price_per_year: 12000000, state: 'Abuja', local_government: 'Abuja Municipal', area: 'Maitama', status: 'approved', views_count: 156, landlord: { full_name: 'Alhaji Musa Ibrahim', email: 'landlord2@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p9/400/300' }], created_at: '2025-10-20T11:30:00Z' },
  { id: 'p10', property_name: '2-Bedroom Apartment in Port Harcourt', property_type: 'Apartment', bedrooms: 2, bathrooms: 2, price_per_year: 1800000, state: 'Rivers', local_government: 'Port Harcourt', area: 'GRA Phase 2', status: 'approved', views_count: 45, landlord: { full_name: 'Mrs. Folake Adeyemi', email: 'landlord3@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p10/400/300' }], created_at: '2025-12-20T13:00:00Z' },
  { id: 'p11', property_name: 'Luxury Penthouse in Banana Island', property_type: 'Penthouse', bedrooms: 5, bathrooms: 6, price_per_year: 60000000, state: 'Lagos', local_government: 'Eti-Osa', area: 'Banana Island', status: 'approved', views_count: 320, landlord: { full_name: 'Dr. Olumide Fashola', email: 'landlord4@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p11/400/300' }], created_at: '2025-09-15T10:00:00Z' },
  { id: 'p12', property_name: 'Affordable Studio in Yaba', property_type: 'Studio', bedrooms: 1, bathrooms: 1, price_per_year: 800000, state: 'Lagos', local_government: 'Lagos Mainland', area: 'Yaba', status: 'approved', views_count: 78, landlord: { full_name: 'Engr. Chukwuemeka Obi', email: 'landlord5@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p12/400/300' }], created_at: '2025-11-05T15:00:00Z' },
  { id: 'p13', property_name: '3-Bedroom Bungalow in Ibadan', property_type: 'Bungalow', bedrooms: 3, bathrooms: 2, price_per_year: 600000, state: 'Oyo', local_government: 'Ibadan North', area: 'Bodija', status: 'pending', views_count: 0, landlord: { full_name: 'Mrs. Folake Adeyemi', email: 'landlord3@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p13/400/300' }], created_at: '2026-02-03T10:00:00Z' },
  { id: 'p14', property_name: 'Serviced Apartment in Garki', property_type: 'Apartment', bedrooms: 2, bathrooms: 2, price_per_year: 4000000, state: 'Abuja', local_government: 'Abuja Municipal', area: 'Garki', status: 'approved', views_count: 112, landlord: { full_name: 'Dr. Olumide Fashola', email: 'landlord4@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p14/400/300' }], created_at: '2025-10-25T14:00:00Z' },
  { id: 'p15', property_name: 'Detached Duplex in GRA Benin', property_type: 'Duplex', bedrooms: 4, bathrooms: 3, price_per_year: 2500000, state: 'Edo', local_government: 'Oredo', area: 'GRA Benin City', status: 'approved', views_count: 34, landlord: { full_name: 'Engr. Chukwuemeka Obi', email: 'landlord5@test.com' }, property_images: [{ image_url: 'https://picsum.photos/seed/p15/400/300' }], created_at: '2025-12-10T09:30:00Z' },
];

const allUsers = [
  { id: '1', full_name: 'Chief Adebayo Ogundimu', email: 'landlord1@test.com', phone: '+2348034521890', role: 'landlord', properties_count: 7, status: 'active', created_at: '2025-08-01T10:00:00Z' },
  { id: '2', full_name: 'Alhaji Musa Ibrahim', email: 'landlord2@test.com', phone: '+2348091234567', role: 'landlord', properties_count: 2, status: 'active', created_at: '2025-08-15T14:00:00Z' },
  { id: '3', full_name: 'Mrs. Folake Adeyemi', email: 'landlord3@test.com', phone: '+2348055678901', role: 'landlord', properties_count: 2, status: 'active', created_at: '2025-09-01T09:00:00Z' },
  { id: '4', full_name: 'Dr. Olumide Fashola', email: 'landlord4@test.com', phone: '+2348023456789', role: 'landlord', properties_count: 2, status: 'active', created_at: '2025-09-10T11:00:00Z' },
  { id: '5', full_name: 'Engr. Chukwuemeka Obi', email: 'landlord5@test.com', phone: '+2348067890123', role: 'landlord', properties_count: 2, status: 'active', created_at: '2025-09-20T16:00:00Z' },
  { id: '6', full_name: 'Adaeze Nwosu', email: 'adaeze@gmail.com', phone: '+2348012345678', role: 'tenant', properties_count: 0, status: 'active', created_at: '2025-10-05T10:00:00Z' },
  { id: '7', full_name: 'Babatunde Salami', email: 'baba.salami@yahoo.com', phone: '+2348098765432', role: 'tenant', properties_count: 0, status: 'active', created_at: '2025-10-10T12:00:00Z' },
  { id: '8', full_name: 'Grace Okoro', email: 'grace.okoro@gmail.com', phone: '+2348076543210', role: 'tenant', properties_count: 0, status: 'active', created_at: '2025-10-15T08:00:00Z' },
  { id: '9', full_name: 'Ibrahim Abdullahi', email: 'ibrahim.a@gmail.com', phone: '+2348034567890', role: 'tenant', properties_count: 0, status: 'active', created_at: '2025-11-01T14:00:00Z' },
  { id: '10', full_name: 'Chioma Eze', email: 'chioma.eze@outlook.com', phone: '+2348023456789', role: 'tenant', properties_count: 0, status: 'active', created_at: '2025-11-10T10:00:00Z' },
];

const allTransactions = [
  { id: 't1', tenant_name: 'Adaeze Nwosu', tenant_email: 'adaeze@gmail.com', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260120-001', date: '2026-01-20T14:30:00Z' },
  { id: 't2', tenant_name: 'Babatunde Salami', tenant_email: 'baba.salami@yahoo.com', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260118-002', date: '2026-01-18T10:15:00Z' },
  { id: 't3', tenant_name: 'Grace Okoro', tenant_email: 'grace.okoro@gmail.com', property_name: 'Executive Studio in Victoria Island', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260115-003', date: '2026-01-15T09:00:00Z' },
  { id: 't4', tenant_name: 'Ibrahim Abdullahi', tenant_email: 'ibrahim.a@gmail.com', property_name: 'Modern 2-Bedroom Flat in Ikeja GRA', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260112-004', date: '2026-01-12T16:45:00Z' },
  { id: 't5', tenant_name: 'Chioma Eze', tenant_email: 'chioma.eze@outlook.com', property_name: 'Executive Studio in Victoria Island', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260110-005', date: '2026-01-10T11:30:00Z' },
  { id: 't6', tenant_name: 'Oluwaseun Dada', tenant_email: 'seun.dada@gmail.com', property_name: '3-Bedroom Semi-Detached in Ajah', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260108-006', date: '2026-01-08T13:20:00Z' },
  { id: 't7', tenant_name: 'Fatima Bello', tenant_email: 'fatima.b@gmail.com', property_name: 'Luxury 3-Bedroom Apartment in Lekki Phase 1', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20260105-007', date: '2026-01-05T10:00:00Z' },
  { id: 't8', tenant_name: 'David Okonkwo', tenant_email: 'david.o@yahoo.com', property_name: 'Modern 2-Bedroom Flat in Ikeja GRA', landlord_name: 'Chief Adebayo Ogundimu', amount: 15000, status: 'successful', reference: 'DK-20251228-008', date: '2025-12-28T15:10:00Z' },
];

let connectionFee = 15000;

// Auth
export const adminLogin = async (email, password) => {
  await delay(800);
  if (email === 'admin@directkey.com' && password === 'Admin123!') {
    const admin = { id: 'admin1', email: 'admin@directkey.com', full_name: 'Admin User', role: 'admin' };
    return admin;
  }
  throw new Error('Invalid admin credentials');
};

// Properties
export const getAllProperties = async () => {
  if (USE_DUMMY_DATA) { await delay(600); return allProperties; }
  const res = await fetch(`${API_BASE}/admin/properties`);
  return res.json();
};

export const getPendingProperties = async () => {
  if (USE_DUMMY_DATA) { await delay(500); return allProperties.filter(p => p.status === 'pending'); }
  const res = await fetch(`${API_BASE}/admin/properties/pending`);
  return res.json();
};

export const approveProperty = async (id) => {
  if (USE_DUMMY_DATA) {
    await delay(600);
    const idx = allProperties.findIndex(p => p.id === id);
    if (idx !== -1) allProperties[idx].status = 'approved';
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/admin/properties/${id}/approve`, { method: 'PUT' });
  return res.json();
};

export const rejectProperty = async (id, reason) => {
  if (USE_DUMMY_DATA) {
    await delay(600);
    const idx = allProperties.findIndex(p => p.id === id);
    if (idx !== -1) { allProperties[idx].status = 'rejected'; allProperties[idx].rejection_reason = reason; }
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/admin/properties/${id}/reject`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
  return res.json();
};

// Users
export const getAllUsers = async () => {
  if (USE_DUMMY_DATA) { await delay(500); return allUsers; }
  const res = await fetch(`${API_BASE}/admin/users`);
  return res.json();
};

// Transactions
export const getAllTransactions = async () => {
  if (USE_DUMMY_DATA) { await delay(500); return allTransactions; }
  const res = await fetch(`${API_BASE}/admin/transactions`);
  return res.json();
};

// Stats
export const getStatistics = async () => {
  if (USE_DUMMY_DATA) {
    await delay(400);
    return {
      totalProperties: allProperties.length,
      approvedProperties: allProperties.filter(p => p.status === 'approved').length,
      pendingProperties: allProperties.filter(p => p.status === 'pending').length,
      rejectedProperties: allProperties.filter(p => p.status === 'rejected').length,
      totalUsers: allUsers.length,
      totalLandlords: allUsers.filter(u => u.role === 'landlord').length,
      totalTenants: allUsers.filter(u => u.role === 'tenant').length,
      totalTransactions: allTransactions.length,
      totalRevenue: allTransactions.reduce((sum, t) => sum + t.amount, 0),
      connectionFee,
    };
  }
  const res = await fetch(`${API_BASE}/admin/statistics`);
  return res.json();
};

// Settings
export const getConnectionFee = async () => {
  if (USE_DUMMY_DATA) { await delay(300); return { connection_fee: connectionFee }; }
  const res = await fetch(`${API_BASE}/settings/connection-fee`);
  return res.json();
};

export const updateConnectionFee = async (fee) => {
  if (USE_DUMMY_DATA) { await delay(600); connectionFee = parseInt(fee); return { success: true }; }
  const res = await fetch(`${API_BASE}/settings/connection-fee`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ connection_fee: fee }) });
  return res.json();
};
