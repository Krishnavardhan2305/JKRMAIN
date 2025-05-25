import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CLIENT_API_ENDPOINT, QUERY_API_ENDPOINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RaiseQuery = () => {
  const [issue, setIssue] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const position = useSelector((state) => state.client.client.client?.position);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue) {
      toast.error('Please describe the issue');
      return;
    }

    const formData = new FormData();
    formData.append('issue', issue);
    formData.append('position', position); 

    if (image) formData.append('image', image);

    try {
      setLoading(true);
      await axios.post(`${QUERY_API_ENDPOINT}/raise-query`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      toast.success('Query submitted successfully');
      setIssue('');
      setImage(null);
      navigate(-1); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 text-white p-8 rounded-lg w-full max-w-xl shadow-lg border border-white/20 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Raise a Query</h2>

        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Issue Description</span>
          <textarea
            rows="5"
            className="w-full bg-white/20 p-3 rounded-lg focus:outline-none placeholder-white/60"
            placeholder="Describe your issue here..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="block mb-1 font-semibold">Upload Image (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-white"
          />
        </label>

        <div className="flex">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-full bg-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mr-2"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ml-2"
          >
            {loading ? 'Submitting...' : 'Submit Query'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RaiseQuery;
