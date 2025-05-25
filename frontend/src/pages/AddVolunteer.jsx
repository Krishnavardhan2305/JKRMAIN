import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import mandalData from '../data/Mandals.json';

const AddVolunteer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mandals, setMandals] = useState([]);
  const [formdata, setFormdata] = useState({
    name: '',
    age: '',
    mandal: '',
    mobile: '',
    email: '',
    constituency: '',
  });

  useEffect(() => {
    const fetchMLADetails = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/mladata`, {
          withCredentials: true,
        });

        const mlaConstituency = response.data?.constituency || '';
        setFormdata((prev) => ({ ...prev, constituency: mlaConstituency }));

        const found = mandalData.flatMap(d => d.Constituencies)
          .find(c => c.Name.toLowerCase() === mlaConstituency.toLowerCase());

        if (found) {
          setMandals(found.Mandals);
        } else {
          console.warn("No mandals found for constituency:", mlaConstituency);
          setMandals([]);
        }

      } catch (error) {
        console.error("Error fetching MLA data:", error);
      }
    };

    fetchMLADetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${CLIENT_API_ENDPOINT}/addVolunteer`, formdata, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success("Volunteer added successfully!");
      navigate('/MLAHOME');
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error(error.response?.data?.message || "Failed to add volunteer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-10 relative">
      <button
        onClick={() => navigate('/MLAHOME')}
        className="absolute top-6 left-6 text-white bg-white/10 border border-white/20 hover:bg-white/20 transition px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white/10 text-white backdrop-blur-md rounded-xl shadow-2xl p-10 border border-white/20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Add Volunteer</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField label="Name" name="name" value={formdata.name} onChange={handleChange} />
          <InputField label="Age" name="age" value={formdata.age} onChange={handleChange} type="number" />

          <div>
            <label className="block mb-1 font-semibold">Mandal</label>
            <select
              name="mandal"
              value={formdata.mandal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Mandal</option>
              {mandals.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <InputField label="Mobile" name="mobile" value={formdata.mobile} onChange={handleChange} type="tel" />
          <InputField label="Email" name="email" value={formdata.email} onChange={handleChange} type="email" />

          <div className="sm:col-span-2">
            <label className="block mb-1 font-semibold">Constituency</label>
            <input
              type="text"
              name="constituency"
              value={formdata.constituency}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-gray-400/20 text-white cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md"
          disabled={loading}
        >
          {loading ? "Adding... Please wait" : "Add Volunteer"}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={label}
      className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default AddVolunteer;
