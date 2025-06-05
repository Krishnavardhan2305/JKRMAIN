import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import constituencyData from '../data/constituencies.json';
import mandalsJson from '../data/mandals.json';
import { ADMIN_API_ENDPOINT, CLIENT_API_ENDPOINT } from '../utils/constant';

const AddClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    constituency: '',
    mandal: '',
    Password: '',
    Mobile: '',
    Email: '',
    PoliticalParty: '',
  });

  const [availableMandals, setAvailableMandals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update mandals when constituency changes
  useEffect(() => {
    if (formData.constituency && Array.isArray(mandalsJson)) {
      // Flatten all constituencies from all districts
      const allConstituencies = mandalsJson.flatMap((district) => district.Constituencies || []);
      const match = allConstituencies.find((item) => item.Name.trim() === formData.constituency.trim());
      setAvailableMandals(match ? match.Mandals : []);
      setFormData((prev) => ({ ...prev, mandal: '' }));
    } else {
      setAvailableMandals([]);
      setFormData((prev) => ({ ...prev, mandal: '' }));
    }
  }, [formData.constituency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
+      await axios.post(`${ADMIN_API_ENDPOINT}/addclients`, formData, {
        withCredentials: true,
      });
      toast.success('Client added successfully!');
      navigate('/adminHome');
    } catch (err) {
      toast.error('Failed to add client.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-2xl text-black">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Add New Client</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />

          <InputField type="number" label="Age" name="age" value={formData.age} onChange={handleChange} />

          <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />

          {/* Constituency */}
          <SelectField
            label="Constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
            options={constituencyData.map((c) => c.ac_name.trim())}
          />

          {/* Mandal */}
          <SelectField
            label="Mandal"
            name="mandal"
            value={formData.mandal}
            onChange={handleChange}
            options={availableMandals}
            disabled={!formData.constituency}
          />

          {/* Password */}
          <InputField type="password" label="Password" name="Password" value={formData.Password} onChange={handleChange} />

          {/* Mobile */}
          <InputField type="tel" label="Mobile" name="Mobile" value={formData.Mobile} onChange={handleChange} />

          {/* Email */}
          <InputField type="email" label="Email" name="Email" value={formData.Email} onChange={handleChange} />

          {/* Political Party */}
          <InputField label="Political Party" name="PoliticalParty" value={formData.PoliticalParty} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300"
          >
            {loading ? 'Adding...' : 'Add Client'}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled = false }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={`${opt}-${idx}`} value={opt}>{opt}</option> 
      ))}
    </select>
  </div>
);

export default AddClient;
