import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import MandalAgeGroupChart from '../components/MandalAgeGroupChart';
import MandalCasteChart from '../components/MandalCasteChart';
import MandalGenderAgeChart from '../components/MandalGenderAgeChart';
// import MandalGenderChart from '../components/MandalGenderChart';

ChartJS.register(ArcElement, Tooltip, Legend);

const MandalDistribution = () => {
  const [charts, setCharts] = useState([]);
  const [mlaParty, setMlaParty] = useState('');
  const [mlaConstituency, setMlaConstituency] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMLA = async () => {
      const res = await axios.get(`${CLIENT_API_ENDPOINT}/mladata`, { withCredentials: true });
      setMlaParty(res.data.PoliticalParty);
      setMlaConstituency(res.data.constituency);
    };
    fetchMLA();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!mlaParty || !mlaConstituency) return;

      const res = await axios.get(`${CLIENT_API_ENDPOINT}/mandalwiseVotingStats`, {
        params: { mlaParty, mlaConstituency },
      });

      const chartsData = res.data.data.map((row) => ({
        mandal: row.mandal,
        data: {
          labels: [mlaParty, 'Others'],
          datasets: [
            {
              label: `${row.mandal} Votes`,
              data: [row.mla_votes, row.other_votes],
              backgroundColor: ['#3b82f6', '#f87171'],
              borderWidth: 1,
            },
          ],
        },
      }));

      setCharts(chartsData);
    };

    fetchData();
  }, [mlaParty, mlaConstituency]);

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/MLAHOME')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Constituency-wise Distribution
        </button>
      </div>

      <h2 className="text-center text-xl font-semibold mb-6">Mandal-wise Voting Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {charts.map(({ mandal, data }) => (
          <div key={mandal} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-center font-medium text-gray-700 mb-4">{mandal}</h3>
            <div className="flex justify-center h-[250px]">
              <div className="w-[200px] h-[200px]">
                <Pie data={data} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for next charts */}
      <MandalAgeGroupChart mlaParty={mlaParty} mlaConstituency={mlaConstituency} />
       <MandalCasteChart mlaParty={mlaParty} mlaConstituency={mlaConstituency} />
       <MandalGenderAgeChart mlaParty={mlaParty} mlaConstituency={mlaConstituency} /> 
    </div>
  );
};

export default MandalDistribution;
