import React, { useState } from 'react';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';
import toast from 'react-hot-toast';


const AccountSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('changePassword');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        setLoading(true);
        setResponseMessage('');
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        try {
            const response = await fetch(
                `${AUTH_ENDPOINTS.changePassword}?token=${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        oldPassword,
                        newPassword,
                    }),
                }
            );

            const result = await response.text();
            if (response.ok) {
                toast.success(result);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordStrength('');
            } else {
                toast.error(result);
            }
        } catch (error) {
            toast.error('Error occurred while changing password.');
        }
        setLoading(false);
    };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'changePassword'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'changePassword' && (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                const val = e.target.value;
                setNewPassword(val);
                if (val.length < 6) {
                  setPasswordStrength('Weak');
                } else if (/[A-Z]/.test(val) && /[0-9]/.test(val) && /[!@#$%^&*]/.test(val)) {
                  setPasswordStrength('Strong');
                } else {
                  setPasswordStrength('Moderate');
                }
              }}
              className="mt-1 block w-full px-4 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {newPassword && (
              <p className={`text-sm mt-1 ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                Strength: {passwordStrength}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
          {responseMessage && (
            <p className="text-sm mt-2 text-gray-600">{responseMessage}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default AccountSettings;
