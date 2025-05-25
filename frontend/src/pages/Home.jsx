import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import toast from 'react-hot-toast';

// 🔥 import Redux stuff
import { useDispatch } from 'react-redux';
import { setclient } from '../redux/ClientSlice'

const Home = () => {
  const [mlaLogin, setMlaLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [Loading, setLoading] = useState(false);

  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
    position: 'MLA',
  });

  useEffect(() => {
    setFormdata((prev) => ({
      ...prev,
      position: mlaLogin ? 'MLA' : 'Volunteer',
    }));
  }, [mlaLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${CLIENT_API_ENDPOINT}/clientLogin`, formdata, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      dispatch(setclient(response.data));

      toast.success("Login Successful!");

      setTimeout(() => {
        if (formdata.position === 'MLA') {
          navigate('/MLAHOME');
        } else {
          navigate('/VOLUNTEERHOME');
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setFormdata({
        email: '',
        password: '',
        position: mlaLogin ? 'MLA' : 'Volunteer',
      });
    }
  };

  const toggleLogin = () => {
    setMlaLogin(!mlaLogin);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="mb-6">
        <button
          onClick={toggleLogin}
          className="bg-white/10 text-white px-6 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition duration-300"
        >
          Switch to {mlaLogin ? "Volunteer" : "MLA"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md text-white p-10 rounded-xl w-full max-w-md shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          {mlaLogin ? "MLA Login" : "Volunteer Login"}
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
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-bold text-blue-300 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50"
          disabled={Loading}
        >
          {Loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Home;
