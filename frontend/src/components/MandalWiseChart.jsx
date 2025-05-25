import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { CLIENT_API_ENDPOINT } from '../utils/constant';

const MandalWiseChart = ({ mlaParty, mlaConstituency }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMandalStats = async () => {
      try {
        const response = await axios.get(`${CLIENT_API_ENDPOINT}/mandalStats`, {
          params: { mlaParty, mlaConstituency },
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching mandal stats:', error);
      }
    };

    fetchMandalStats();
  }, [mlaParty, mlaConstituency]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="mandal" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="mla_votes" fill="#2563eb" name={mlaParty} />
        <Bar dataKey="other_votes" fill="#10b981" name="Others" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MandalWiseChart;
