import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';

const SeeVolunteers = () => {
  const navigate = useNavigate();
  const [mlaParty, setMlaParty] = useState('');
  const [mlaConstituency, setMlaConstituency] = useState('');
  const [mlaName, setMlaName] = useState('');
  const [mlaId, setMlaId] = useState(null); 
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchMLADetails = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/mladata`, {
          withCredentials: true,
        });
        setMlaParty(response.data.PoliticalParty);
        setMlaConstituency(response.data.constituency);
        setMlaName(response.data.name);
        setMlaId(response.data.id); 
      } catch (error) {
        console.error('Error fetching MLA data:', error);
      }
    };
    fetchMLADetails();
  }, []);

  useEffect(() => {
    const fetchVolunteers = async () => {
      if (!mlaId) return;
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/volunteers?mla_id=${mlaId}`);
        setVolunteers(response.data || []);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };
    fetchVolunteers();
  }, [mlaId]);

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-center flex-1">Volunteers</h2>
      </div>

      <div className="mb-6 text-center">
        <p>MLA: <span className="font-semibold">{mlaName}</span></p>
        <p>Constituency: <span className="font-semibold">{mlaConstituency}</span></p>
        <p>Party: <span className="font-semibold">{mlaParty}</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg text-black">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mandal</th>
              <th className="px-4 py-2 text-left">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.length > 0 ? (
              volunteers.map((v, idx) => (
                <tr key={v.id} className="border-b">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{v.name}</td>
                  <td className="px-4 py-2">{v.Email}</td>
                  <td className="px-4 py-2">{v.mandal}</td>
                  <td className="px-4 py-2">{v.Mobile}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No volunteers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeeVolunteers;
