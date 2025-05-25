import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { CLIENT_API_ENDPOINT } from '../utils/constant';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MandalCasteChart = ({ mlaParty, mlaConstituency }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!mlaParty || !mlaConstituency) return;
      try {
        const res = await axios.get(`${CLIENT_API_ENDPOINT}/mandalwiseCasteStats`, {
          params: { mlaParty, mlaConstituency },
        });

        const grouped = {};
        res.data.data.forEach(({ mandal, caste, mla_votes }) => {
          if (!grouped[mandal]) grouped[mandal] = {};
          grouped[mandal][caste] = mla_votes;
        });

        const result = Object.entries(grouped).map(([mandal, casteVotes]) => ({
          mandal,
          labels: Object.keys(casteVotes),
          values: Object.values(casteVotes),
        }));

        setChartData(result);
      } catch (err) {
        console.error('Error fetching caste data:', err);
      }
    };

    fetchData();
  }, [mlaParty, mlaConstituency]);

  return (
    <div className="mt-10">
      <h3 className="text-center font-semibold text-lg mb-4">
        Mandal-wise Caste Distribution (MLA Votes)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartData.map(({ mandal, labels, values }) => {
          const data = {
            labels,
            datasets: [
              {
                label: `${mandal}`,
                data: values,
                backgroundColor: '#60a5fa',
              },
            ],
          };

          return (
            <div key={mandal} className="bg-white p-4 rounded-lg shadow-md h-[300px]">
              <h4 className="text-center mb-2 font-medium text-gray-700">{mandal}</h4>
              <div className="h-[220px] overflow-y-auto">
                <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MandalCasteChart;
