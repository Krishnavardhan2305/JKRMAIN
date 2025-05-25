import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import axios from 'axios';
import toast from 'react-hot-toast';
import AgeGroupVotingChart from '../components/AgeGroupVotingChart';
import CasteVotingChart from '../components/CasteVotingChart';
import GenderAgeVotingChart from '../components/GenderAgeVotingChart';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/ClientSlice';

const ClientMhome = () => {
  const navigate = useNavigate();
  const [mlaParty, setMlaParty] = useState('');
  const [mlaConstituency, setMlaConstituency] = useState('');
  const [mlaName, setMlaName] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMLADetails = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/mladata`, {
          withCredentials: true,
        });
        setMlaParty(response.data.PoliticalParty);
        setMlaConstituency(response.data.constituency);
        setMlaName(response.data.name);
      } catch (error) {
        console.error('Error fetching MLA data:', error);
      }
    };
    fetchMLADetails();
  }, []);

  const handleAddVolunteer = () => {
    navigate('/addMLAHOME/addvolunteer');
  };

  const handleMandalwiseRedirect = () => {
    navigate('/mandal-distribution');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };
  const handleRaiseQuery = () => {
    navigate('/raise-a-query');
  };
  

  const LogOutHandler = async () => {
    try {
      await axios.post(`${CLIENT_API_ENDPOINT}/logout`);
      dispatch(logout());
      navigate('/');
      toast.success('Logout Successful');
    } catch (error) {
      console.log(error);
    }
  };
  const VolunteerHandler = async (req, res) => {
    try {
      navigate('/MLAHOME/seevolunteers');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6 space-x-2">
        <button
          onClick={VolunteerHandler}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          See Volunteers
        </button>
        <button
          onClick={handleAddVolunteer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Volunteer
        </button>
        <button
          onClick={handleMandalwiseRedirect}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Mandal-wise Distribution
        </button>
        <button
          onClick={handleChangePassword}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
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
          onClick={LogOutHandler}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white mb-2">Welcome <span className="text-blue-200">{mlaName}</span></h1>
          <p className="text-lg text-gray-400">Constituency: <span className="font-semibold">{mlaConstituency}</span></p>
          <p className="text-2xl font-bold mt-4 text-indigo-700 border-b-2 border-indigo-400 inline-block pb-1">
            Voting Insights
          </p>
        </div>
        {mlaParty && mlaConstituency && (
          <>
            <AgeGroupVotingChart mlaParty={mlaParty} mlaConstituency={mlaConstituency} />
            <GenderAgeVotingChart mlaParty={mlaParty} mlaConstituency={mlaConstituency} />
            <CasteVotingChart mlaParty={mlaParty} mlaConstituency={mlaConstituency} />
          </>
        )}
      </div>
    </div>
  );
};

export default ClientMhome;
