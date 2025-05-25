import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddCitizen = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    constituency: '',
    mandal: '',
    village: '',
    caste: '',
    subcaste: '',
    votedFor: '',
  });
  const [Loading,setLoading]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/volunteerData`, {
          withCredentials: true,
        });

        const { constituency, mandal } = response.data;

        setFormData((prev) => ({
          ...prev,
          constituency: constituency || '',
          mandal: mandal || '',
        }));
      } catch (error) {
        console.error('Error fetching volunteer info:', error);
      }
    };

    fetchVolunteerData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${CLIENT_API_ENDPOINT}/addCitizen`, formData, {
        withCredentials: true,
      });
      toast.success('Citizen added successfully!');
      navigate('/VOLUNTEERHOME');
    } catch (error) {
      console.error('Error adding citizen:', error);
      toast.error('Failed to add citizen.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Add New Citizen</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Constituency (read-only) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Constituency</label>
            <input
              type="text"
              name="constituency"
              value={formData.constituency}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Mandal (read-only) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mandal</label>
            <input
              type="text"
              name="mandal"
              value={formData.mandal}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Village</label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Caste */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Caste</label>
            <input
              type="text"
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subcaste */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Subcaste</label>
            <input
              type="text"
              name="subcaste"
              value={formData.subcaste}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Voted For */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Voted For</label>
            <input
              type="text"
              name="votedFor"
              value={formData.votedFor}
              onChange={handleChange}
              required
              placeholder="e.g. Party Name or Independent"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            disabled={Loading}
          >
            {
              Loading?"Adding":"Add Citizen"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCitizen;
