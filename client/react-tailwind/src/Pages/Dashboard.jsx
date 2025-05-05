import React, { useEffect, useState } from 'react';
import axios from 'axios';

const satisfactionLevels = {
  1: 'Very Dissatisfied',
  2: 'Dissatisfied',
  3: 'Neutral',
  4: 'Satisfied',
  5: 'Very Satisfied'
};

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/survey');
        setSurveys(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setError('Failed to load survey data');
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const getSatisfactionColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-700',
      2: 'bg-orange-100 text-orange-700',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-700',
      5: 'bg-emerald-100 text-emerald-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const renderYesNo = (value) => (
    <span className={value ? 'text-green-600 font-semibold' : 'text-gray-500'}>
      {value ? '✓ Yes' : '✗ No'}
    </span>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-6xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          📊 Customer Survey Results Dashboard
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading survey data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 font-semibold">
                  <th className="px-4 py-3 rounded-tl-lg">#</th>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Marketplace</th>
                  <th className="px-4 py-3">Satisfaction</th>
                  <th className="px-4 py-3">Updates</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Coupon Code</th>
                  <th className="px-4 py-3 rounded-tr-lg">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {surveys.length > 0 ? (
                  surveys.map((survey, index) => (
                    <tr key={survey._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-t px-4 py-3 font-medium text-gray-800">{index + 1}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{survey.orderNumber}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{survey.email}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{survey.product}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{survey.marketplace}</td>
                      <td className="border-t px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSatisfactionColor(survey.satisfaction)}`}>
                          {satisfactionLevels[survey.satisfaction] || 'Not Provided'}
                        </span>
                      </td>
                      <td className="border-t px-4 py-3">{renderYesNo(survey.updates)}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{survey.usageDuration}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{survey.couponCode}</td>
                      <td className="border-t px-4 py-3 text-gray-800">{formatDate(survey.submittedAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-10 text-gray-500">
                      No survey data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 text-center">
          Total responses: {surveys.length}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
