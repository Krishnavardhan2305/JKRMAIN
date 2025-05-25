import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CasteVotingChart = ({ mlaParty, mlaConstituency }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${CLIENT_API_ENDPOINT}/citizenStatsByCaste`, {
        params: { mlaParty, mlaConstituency },
      });

      const castes = res.data.data;

      const labels = castes.map(c => c.caste.toUpperCase());
      const values = castes.map(c => c.mla_votes);
      const bgColors = labels.map(() =>
        '#' + Math.floor(Math.random() * 16777215).toString(16)
      );

      setChartData({
        labels,
        datasets: [
          {
            label: 'Votes for MLA by Caste',
            data: values,
            backgroundColor: bgColors,
            borderWidth: 1,
          },
        ],
      });
    };

    if (mlaParty && mlaConstituency) {
      fetchData();
    }
  }, [mlaParty, mlaConstituency]);

  if (!chartData) return null;

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h3 className="text-center font-semibold text-black mb-6 text-lg">
        Votes for {mlaParty} by Caste
      </h3>
      <div className="flex justify-center items-center h-[300px]">
        <div className="w-[250px] h-[250px]">
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default CasteVotingChart;
