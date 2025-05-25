import React, { useState } from 'react';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('MLA');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${CLIENT_API_ENDPOINT}/forgot-password`, { email, position });
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        >
          <option value="MLA">MLA</option>
          <option value="Volunteer">Volunteer</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
