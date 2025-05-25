import React, { useState } from 'react';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MLAChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${CLIENT_API_ENDPOINT}/mlachangepassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success('Password updated successfully');
      setTimeout(() => navigate('/MLAHOME'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <div className="flex justify-between space-x-2">
            <button
              type="button"
              className="w-1/2 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={Loading}
            >
              {Loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MLAChangePassword;
