import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';

const ClientVHome = () => {
  const [volunteerData, setVolunteerData] = useState(null);
  const [citizens, setCitizens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteerDetails = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/volunteerData`, {
          withCredentials: true,
        });
        setVolunteerData(response.data);
      } catch (error) {
        console.error("Error fetching volunteer details:", error);
      }
    };

    const fetchCitizens = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/volunteerCitizens`, {
          withCredentials: true,
        });
        setCitizens(response.data);
      } catch (error) {
        console.error("Error fetching citizens:", error);
      }
    };

    fetchVolunteerDetails();
    fetchCitizens();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${CLIENT_API_ENDPOINT}/logout`, {}, {
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handlechangePassword = () => {
    navigate('/VOLUNTEERHOME/changePassword');
  };
  const handleRaiseQuery = () => {
    navigate('/raise-a-query');
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 relative">
        <div className="absolute top-4 right-4 flex space-x-4">
          <button
            onClick={handlechangePassword}
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Change Password
          </button>
          <button
          onClick={handleRaiseQuery}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Raise a Query
        </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Volunteer Dashboard
        </h2>

        {volunteerData ? (
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <span className="font-semibold text-gray-600">Name:</span>
              <span className="ml-2 text-lg text-black font-medium">{volunteerData.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600">Constituency:</span>
              <span className="ml-2 text-lg text-black font-medium">{volunteerData.constituency}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600">Mandal:</span>
              <span className="ml-2 text-lg text-black font-medium">{volunteerData.mandal}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading volunteer information...</p>
        )}

        <div className="mt-4 mb-8 text-center">
          <button
            onClick={() => navigate('/VOLUNTEERHOME/addcitizen')}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Add Citizen
          </button>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Citizens Added</h3>

        {citizens.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border">
              <thead className="bg-gray-200 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Age</th>
                  <th className="px-4 py-2 border">Gender</th>
                  <th className="px-4 py-2 border">Constituency</th>
                  <th className="px-4 py-2 border">Mandal</th>
                  <th className="px-4 py-2 border">Village</th>
                  <th className="px-4 py-2 border">Caste</th>
                  <th className="px-4 py-2 border">Subcaste</th>
                  <th className="px-4 py-2 border">Voted For</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{citizen.name}</td>
                    <td className="px-4 py-2 border">{citizen.age}</td>
                    <td className="px-4 py-2 border">{citizen.gender}</td>
                    <td className="px-4 py-2 border">{citizen.constituency}</td>
                    <td className="px-4 py-2 border">{citizen.mandal}</td>
                    <td className="px-4 py-2 border">{citizen.village}</td>
                    <td className="px-4 py-2 border">{citizen.caste}</td>
                    <td className="px-4 py-2 border">{citizen.subcaste}</td>
                    <td className="px-4 py-2 border">{citizen.votedfor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No citizens added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ClientVHome;
