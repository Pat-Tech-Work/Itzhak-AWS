
// `https://itzhak-aws-vkmdh.ondigitalocean.app/itzhak-aws-server/api/orderNumber/${formData.orderNumber}`

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Step_1() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    phoneNumber: "",
    countryCode: "+972"
  });

  const [error, setError] = useState("");
  const [phonePrompt, setPhonePrompt] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponExpirationDate, setCouponExpirationDate] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const countryCodes = [
    { code: "+972", country: "Israel" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+90", country: "Turkey" },
    { code: "+7", country: "Russia" },
    // ניתן להוסיף עוד לפי הצורך
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
      updatedValue = value.replace(/\D/g, ""); // רק ספרות
    }

    setFormData({ ...formData, [name]: updatedValue });
    setError("");
    setPhonePrompt("");
    setCouponCode("");
    setCouponExpirationDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderCheck = await fetch(`https://itzhak-aws-vkmdh.ondigitalocean.app/api/orderNumber/${formData.orderNumber}`);
        
      if (orderCheck.status === 404) {
        setError("The order number is not in the system. Please check and try again.");
        return;
      }
      const surveyCheck = await fetch(`https://itzhak-aws-vkmdh.ondigitalocean.app/itzhak-aws-server/api/survey/check/${formData.orderNumber}`);
      const surveyData = await surveyCheck.json();

      if (surveyData.exists) {
        setShowPhoneInput(true);

        if (!formData.phoneNumber) {
          setPhonePrompt("This order already has a survey. Please enter your phone number to retrieve your coupon.");
          return;
        }

        const fullPhone = formData.countryCode + formData.phoneNumber;

        const verifyCheck = await fetch(
          `https://itzhak-aws-vkmdh.ondigitalocean.app/itzhak-aws-server/api/survey/verify/${formData.orderNumber}/${fullPhone}`
        );
        const verifyData = await verifyCheck.json();

        if (verifyCheck.status === 200 && verifyData.verified) {
          setCouponCode(verifyData.couponCode);
          setCouponExpirationDate(verifyData.couponExpirationDate);
          setPhonePrompt("");
        } else {
          setPhonePrompt("Phone number does not match the one used in the survey.");
        }

        return;
      }

      // אין סקר קיים – מעבר לשלב הבא
      localStorage.setItem("orderNumber", formData.orderNumber);
      navigate("/step_2", { state: { orderNumber: formData.orderNumber } });

    } catch (error) {
      console.error("Error checking order number:", error);
      setError("Server connection error. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 px-12 py-10">
        <img src="/HevraCom-logo.png" alt="Logo" className="mx-auto h-20 mb-6" />

        <div className="text-center mb-6">
          <div className="text-blue-600 text-xl font-semibold mb-2">🎁 Free Amazon Gift Card</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Enter Your Order Number</h1>
          <p className="text-gray-600 text-base">Complete the form to get your free coupon gift!</p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              <span className="text-sm font-medium">Step 1 of 4</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* מספר הזמנה */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              Order Number
              <span className="text-indigo-500 ml-1">*</span>
              <span
                className="ml-2 text-indigo-600 font-bold text-lg cursor-pointer relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                !
                {showTooltip && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded p-2 w-64 shadow-lg z-10">
                    Your Amazon Order Number can be found in your account under 'Your Orders.'
                    It typically looks like 123-4567890-1234567.
                  </div>
                )}
              </span>
            </label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              required
              placeholder="e.g. 123-4567890-1234567"
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* טלפון – רק אם יש סקר קיים */}
          {showPhoneInput && (
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">
                Your Phone Number <span className="text-indigo-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-2 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number e.g. 234-456-7890"
                  className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm"
                />
              </div>
            </div>
          )}

          {/* הודעות */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mt-2 border border-red-300">
              {error}
            </div>
          )}
          {phonePrompt && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm mt-2 border border-yellow-300">
              {phonePrompt}
            </div>
          )}
          {couponCode && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-md shadow-sm mt-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🎉</div>
                <div>
                  <p className="font-semibold text-base mb-1">
                    The survey has already been filled out for this order.
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Your coupon code:</span>{" "}
                    <span className="text-green-700 bg-white px-2 py-0.5 rounded-md border border-green-400 font-mono text-sm tracking-wide shadow-sm">
                      {couponCode}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">The coupon is valid until:</span>{" "}
                    <span className="underline">{formatDate(couponExpirationDate)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white text-lg font-semibold ${
              formData.orderNumber ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-300 cursor-not-allowed"
            } transition duration-300`}
            disabled={!formData.orderNumber || (!!error && !couponCode)}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default Step_1;
