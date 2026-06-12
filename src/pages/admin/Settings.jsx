import { useEffect, useState } from 'react';
import { FiSave, FiInfo, FiLock } from 'react-icons/fi';
import { TbCurrencyNaira } from 'react-icons/tb';
import { getConnectionFee, updateConnectionFee, changeAdminPassword } from '../../services/adminService';
import toast from 'react-hot-toast';

const formatPrice = (amount) => new Intl.NumberFormat('en-NG').format(amount);

const Settings = () => {
  const [fee, setFee] = useState('');
  const [currentFee, setCurrentFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', new_password: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getConnectionFee();
        const feeValue = data?.connection_fee || 15000;
        setCurrentFee(parseInt(feeValue));
        setFee(String(feeValue));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const newFee = parseInt(fee);
    if (!newFee || newFee <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setSaving(true);
    try {
      await updateConnectionFee(newFee);
      setCurrentFee(newFee);
      toast.success('Connection fee updated successfully');
    } catch (err) {
      toast.error('Failed to update fee');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.new_password || !pwForm.confirm) { toast.error('Please fill in all fields'); return; }
    if (pwForm.new_password !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.new_password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      await changeAdminPassword(pwForm.current, pwForm.new_password);
      toast.success('Password updated successfully');
      setPwForm({ current: '', new_password: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[...Array(2)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse"><div className="h-32" /></div>)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage platform settings</p>
      </div>

      {/* Digital Key Fee */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <TbCurrencyNaira className="text-primary-500 text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-navy-900">Digital Key Fee</h2>
            <p className="text-xs text-gray-500">The fee tenants pay to unlock landlord contact details</p>
          </div>
        </div>

        <div className="bg-navy-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Current Fee</p>
          <p className="text-3xl font-bold text-navy-900">{'\u20A6'}{formatPrice(currentFee)}</p>
        </div>

        <form onSubmit={handleUpdate}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Digital Key Fee ({'\u20A6'})</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="15000"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer disabled:opacity-60"
            >
              <FiSave /> {saving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>

        <div className="flex items-start gap-2 mt-4 bg-blue-50 rounded-xl p-3">
          <FiInfo className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">Changes to the Digital Key fee will apply to all new transactions. Existing connections are not affected.</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
            <FiLock className="text-navy-600 text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-navy-900">Change Password</h2>
            <p className="text-xs text-gray-500">Update your admin login password</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input type="password" value={pwForm.current} onChange={(e) => setPwForm(p => ({ ...p, current: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input type="password" value={pwForm.new_password} onChange={(e) => setPwForm(p => ({ ...p, new_password: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm(p => ({ ...p, confirm: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <button type="submit" disabled={savingPw} className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all border-0 cursor-pointer disabled:opacity-60">
            <FiLock /> {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Platform Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-navy-900 mb-4">Platform Information</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Platform Name</span>
            <span className="text-sm font-medium text-navy-900">DirectKey</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Version</span>
            <span className="text-sm font-medium text-navy-900">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Admin Email</span>
            <span className="text-sm font-medium text-navy-900">directkey0@gmail.com</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Payment Provider</span>
            <span className="text-sm font-medium text-navy-900">Paystack</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Database</span>
            <span className="text-sm font-medium text-navy-900">Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
