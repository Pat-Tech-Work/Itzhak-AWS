import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchSurveysThunk } from "../redux/slices/surveySlice";
import { logoutThunk } from "../redux/slices/authSlice";

const satisfactionLevels = {
  "1 - Very Satisfied": "Very Satisfied",
  "2 - Satisfied": "Satisfied",
  "3 - Neutral": "Neutral",
  "4 - Dissatisfied": "Dissatisfied",
  "5 - Very Dissatisfied": "Very Dissatisfied"
};

const Dashboard = () => {
  const { surveys, isLoading, error } = useSelector((state) => state.survey);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchSurveysThunk());
  }, [dispatch]);

  const getSatisfactionColor = (level) => {
    const colors = {
      "1 - Very Satisfied": 'bg-red-100 text-red-700',
      "2 - Satisfied": 'bg-orange-100 text-orange-700',
      "3 - Neutral": 'bg-yellow-100 text-yellow-800',
      "4 - Dissatisfied": 'bg-green-100 text-green-700',
      "5 - Very Dissatisfied": 'bg-emerald-100 text-emerald-700',
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

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Customer Survey Results Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Log Out
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-600">Loading survey data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-semibold">
                  <th className="px-2 py-3 text-left">#</th>
                  <th className="px-2 py-3 text-left">Order</th>
                  <th className="px-2 py-3 text-left">Email</th>
                  <th className="px-2 py-3 text-left">Product</th>
                  <th className="px-2 py-3 text-left">Marketplace</th>
                  <th className="px-2 py-3 text-left">Satisfaction</th>
                  <th className="px-2 py-3 text-left">Updates</th>
                  <th className="px-2 py-3 text-left">Duration</th>
                  <th className="px-2 py-3 text-left">Coupon</th>
                  <th className="px-2 py-3 text-left">Submitted</th>
                  <th className="px-2 py-3 text-left">Expiration</th>
                </tr>
              </thead>
              <tbody>
                {surveys.length > 0 ? (
                  surveys.map((survey, index) => (
                    <tr key={survey._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-t px-2 py-2 text-gray-800">{index + 1}</td>
                      <td className="border-t px-2 py-2 text-gray-800 whitespace-nowrap">{survey.orderNumber}</td>
                      <td className="border-t px-2 py-2 text-gray-800 truncate max-w-[120px]" title={survey.email}>
                        {survey.email}
                      </td>
                      <td className="border-t px-2 py-2 text-gray-800 truncate max-w-[100px]" title={survey.product}>
                        {survey.product}
                      </td>
                      <td className="border-t px-2 py-2 text-gray-800">{survey.marketplace}</td>
                      <td className="border-t px-2 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSatisfactionColor(survey.satisfaction)}`}>
                          {satisfactionLevels[survey.satisfaction] || 'Not Provided'}
                        </span>
                      </td>
                      <td className="border-t px-2 py-2">{renderYesNo(survey.updates)}</td>
                      <td className="border-t px-2 py-2 text-gray-800">{survey.usageDuration}</td>
                      <td className="border-t px-2 py-2 text-gray-800">{survey.couponCode}</td>
                      <td className="border-t px-2 py-2 text-gray-800 whitespace-nowrap">
                        {formatDate(survey.submittedAt)}
                      </td>
                      <td className="border-t px-2 py-2 text-gray-800 whitespace-nowrap">
                        {formatDate(survey.couponExpirationDate)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-10 text-gray-500">
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