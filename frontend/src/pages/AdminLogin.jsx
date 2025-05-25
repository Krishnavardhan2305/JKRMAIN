import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_ENDPOINT } from '../utils/constant';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice.js'


const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    email: "",
    password: ""
  });
  const dispatch=useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${ADMIN_API_ENDPOINT}/login`, formdata, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Login Success");

        dispatch(setUser(response.data.user)); 

        navigate('/adminHome');
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-900 via-purple-900 to-indigo-900 px-4">
  <form
    onSubmit={handleSubmit}
    className="bg-white/10 backdrop-blur-md shadow-2xl rounded-xl p-10 w-full max-w-md text-white border border-white/20"
  >
    <h2 className="text-4xl font-bold text-center mb-8 drop-shadow-md">
      Admin Login
    </h2>

    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2">Email</label>
      <div className="flex items-center bg-white/20 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300">
        <FaEnvelope className="text-white/80 mr-2" />
        <input
          type="email"
          name="email"
          value={formdata.email}
          onChange={handleChange}
          className="bg-transparent w-full text-white placeholder-white/60 focus:outline-none"
          required
          placeholder="Enter your email"
        />
      </div>
    </div>

    {/* Password Input */}
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2">Password</label>
      <div className="flex items-center bg-white/20 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300">
        <FaLock className="text-white/80 mr-2" />
        <input
          type="password"
          name="password"
          value={formdata.password}
          onChange={handleChange}
          className="bg-transparent w-full text-white placeholder-white/60 focus:outline-none"
          required
          placeholder="Enter your password"
        />
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
</div>

  );
};

export default AdminLogin;
