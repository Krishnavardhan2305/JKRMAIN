import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { CLIENT_API_ENDPOINT } from '../utils/constant';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AgeGroupVotingChart = ({ mlaParty, mlaConstituency }) => {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${CLIENT_API_ENDPOINT}/citizenStats`, {
        params: { mlaParty, mlaConstituency },
      });

      const ageGroups = {
        '18-30': {},
        '31-55': {},
        '55+': {},
      };

      res.data.data.forEach(({ age_group, votedfor, count }) => {
        if (!ageGroups[age_group]) ageGroups[age_group] = {};
        ageGroups[age_group][votedfor] = parseInt(count);
      });

      setGroupedData(ageGroups);
    };

    if (mlaParty && mlaConstituency) {
      fetchData();
    }
  }, [mlaParty, mlaConstituency]);

  const generateChartData = (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const bgColors = labels.map((label) =>
      label === mlaParty ? '#3b82f6' : '#f87171'
    );

    return {
      labels,
      datasets: [
        {
          label: '% of Votes',
          data: values,
          backgroundColor: bgColors,
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {['18-30', '31-55', '55+'].map((group) => (
        <div key={group} className="bg-white shadow-md p-4 rounded-lg">
          <h3 className="text-center text-black font-semibold mb-4">{group} Years</h3>
          <div className="flex justify-center items-center h-[250px]">
            <div className="w-[200px] h-[200px]">
              <Pie data={generateChartData(groupedData[group] || {})} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgeGroupVotingChart;
