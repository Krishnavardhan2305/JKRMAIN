import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import { CLIENT_API_ENDPOINT } from '../utils/constant';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const MandalAgeGroupChart = ({ mlaParty, mlaConstituency }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!mlaParty || !mlaConstituency) return;
      try {
        const res = await axios.get(`${CLIENT_API_ENDPOINT}/mandalwiseAgeGroupStats`, {
          params: { mlaParty, mlaConstituency },
        });

        const formatted = res.data.data.map(row => ({
          mandal: row.mandal,
          age_18_30: row.age_18_30,
          age_31_55: row.age_31_55,
          age_55_plus: row.age_55_plus,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error('Error loading age group chart:', err);
      }
    };

    fetchData();
  }, [mlaParty, mlaConstituency]);

  return (
    <div className="mt-10">
      <h3 className="text-center font-semibold text-lg mb-4">Mandal-wise Age Group Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartData.map(({ mandal, age_18_30, age_31_55, age_55_plus }) => {
          const data = {
            labels: ['18-30', '31-55', '55+'],
            datasets: [
              {
                label: mandal,
                data: [age_18_30, age_31_55, age_55_plus],
                backgroundColor: ['#60a5fa', '#fbbf24', '#34d399'],
              },
            ],
          };

          return (
            <div key={mandal} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-center mb-2 font-medium text-gray-700">{mandal}</h4>
              <div className="h-[300px]">
                <Bar
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                      },
                    },
                  }}
                />
              </div>
            </div>
          );
          
        })}
      </div>
    </div>
  );
};

export default MandalAgeGroupChart;
