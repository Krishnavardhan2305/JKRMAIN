import React, { useEffect, useState } from 'react';
import { QUERY_API_ENDPOINT } from '../utils/constant';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SeeQueries = () => {
  const [queries, setQueries] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getQueries = async () => {
      try {
        const response = await axios.get(`${QUERY_API_ENDPOINT}/getqueries`);
        setQueries(response.data.queries);
      } catch (error) {
        console.log(error);
      }
    };
    getQueries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-semibold hover:underline"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Raised Queries</h2>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-200 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Issue</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Raised By (Position)</th>
            </tr>
          </thead>
          <tbody>
            {queries.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-gray-500">
                  No queries submitted.
                </td>
              </tr>
            ) : (
              queries.map((query, index) => (
                <tr key={query.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 max-w-md break-words">{query.issue}</td>
                  <td className="px-6 py-4">
                    {query.image_url ? (
                      <img
                        src={query.image_url}
                        alt="query"
                        className="h-16 cursor-pointer border rounded"
                        onClick={() => setPreviewImage(query.image_url)}
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 capitalize">{query.position || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setPreviewImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeQueries;
