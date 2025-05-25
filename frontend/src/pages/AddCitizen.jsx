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
    votedFor: ''
  });

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
          {[
            ['name', 'Name'],
            ['age', 'Age'],
            ['gender', 'Gender'],
            ['constituency', 'Constituency'],
            ['mandal', 'Mandal'],
            ['village', 'Village'],
            ['caste', 'Caste'],
            ['subcaste', 'Subcaste'],
            ['votedFor', 'Voted'],
          ].map(([key, label]) => {
            if (key === 'gender') {
              return (
                <div key={key}>
                  <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              );
            }

            return (
              <div key={key}>
                <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={`w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    key === 'constituency' || key === 'mandal' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  required
                  readOnly={key === 'constituency' || key === 'mandal'}
                />
              </div>
            );
          })}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add Citizen
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCitizen;
