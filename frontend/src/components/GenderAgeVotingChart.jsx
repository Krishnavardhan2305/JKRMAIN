import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GenderAgeVotingChart = ({ mlaParty, mlaConstituency }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${CLIENT_API_ENDPOINT}/votingInsightsByGender`, {
          params: { mlaParty, mlaConstituency },
        });

        const rawData = res.data.data;
        const ageGroups = ['18-30', '31-55', '55+'];
        const maleData = [0, 0, 0];
        const femaleData = [0, 0, 0];

        rawData.forEach(({ age_group, gender, count }) => {
          const idx = ageGroups.indexOf(age_group);
          if (gender.toLowerCase() === 'male') {
            maleData[idx] = parseInt(count, 10);
          } else if (gender.toLowerCase() === 'female') {
            femaleData[idx] = parseInt(count, 10);
          }
        });

        setChartData({
          labels: ageGroups,
          datasets: [
            {
              label: 'Male Voters',
              data: maleData,
              backgroundColor: '#60a5fa',
            },
            {
              label: 'Female Voters',
              data: femaleData,
              backgroundColor: '#f472b6',
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching gender-age voting stats:", error);
      }
    };

    if (mlaParty && mlaConstituency) {
      fetchData();
    }
  }, [mlaParty, mlaConstituency]);

  if (!chartData) return <p className="text-center">Loading chart...</p>;

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h3 className="text-center font-semibold text-gray-800 mb-4 text-xl">
        Gender-wise Votes for {mlaParty} by Age Group
      </h3>
      <div className="relative" style={{ height: '300px' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: {
              x: { stacked: true },
              y: { stacked: true, beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
};

export default GenderAgeVotingChart;
