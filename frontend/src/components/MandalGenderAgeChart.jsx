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

const MandalGenderAgeChart = ({ mlaParty, mlaConstituency }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!mlaParty || !mlaConstituency) return;
      try {
        const res = await axios.get(`${CLIENT_API_ENDPOINT}/mandalwiseGenderAgeStats`, {
          params: { mlaParty, mlaConstituency },
        });

        setChartData(res.data.data);
      } catch (err) {
        console.error('Error fetching gender-age group data:', err);
      }
    };

    fetchData();
  }, [mlaParty, mlaConstituency]);

  return (
    <div className="mt-10">
      <h3 className="text-center font-semibold text-lg mb-4">Mandal-wise Gender-Age Group Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartData.map(({ mandal, male_18_30, female_18_30, male_31_55, female_31_55, male_55_plus, female_55_plus }) => {
          const data = {
            labels: ['18-30', '31-55', '55+'],
            datasets: [
              {
                label: 'Male',
                data: [male_18_30, male_31_55, male_55_plus],
                backgroundColor: '#60a5fa',
              },
              {
                label: 'Female',
                data: [female_18_30, female_31_55, female_55_plus],
                backgroundColor: '#f472b6',
              },
            ],
          };

          return (
            <div key={mandal} className="bg-white p-4 rounded-lg shadow-md h-[350px]">
              <h4 className="text-center mb-2 font-medium text-gray-700">{mandal}</h4>
              <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} height={250} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MandalGenderAgeChart;
