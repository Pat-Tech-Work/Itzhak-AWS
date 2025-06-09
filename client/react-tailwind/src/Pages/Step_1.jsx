// src/Pages/Step_1.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkOrderNumberThunk,
  checkSurveyExistsThunk,
  verifyPhoneNumberThunk,
  clearSurveyError,
  resetSurveyState
} from "../redux/slices/surveySlice";

function Step_1() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderNumber: "",
    phoneNumber: "",
    countryCode: "+972"
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    isLoading,
    error: surveyApiError,
    orderNumberCheckStatus,
    surveyExistsStatus,
    phoneNumberVerificationStatus
  } = useSelector((state) => state.survey);

  const countryCodes = [
    { code: "+972", country: "Israel" }, { code: "+1", country: "USA" },
    { code: "+44", country: "UK" }, { code: "+49", country: "Germany" },
    { code: "+33", country: "France" }, { code: "+90", country: "Turkey" },
    { code: "+7", country: "Russia" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  useEffect(() => {
    if (formData.orderNumber || formData.phoneNumber) {
      if (surveyApiError) {
        dispatch(clearSurveyError());
      }
    }
  }, [formData.orderNumber, formData.phoneNumber, surveyApiError, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetSurveyState());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "phoneNumber" ? value.replace(/\D/g, "") : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearSurveyError());

    try {
      await dispatch(checkOrderNumberThunk(formData.orderNumber)).unwrap();
      const surveyExistsResult = await dispatch(checkSurveyExistsThunk(formData.orderNumber)).unwrap();

      if (surveyExistsResult.exists) {
        if (!formData.phoneNumber) {
          return;
        }
        const fullPhone = formData.countryCode + formData.phoneNumber;
        await dispatch(verifyPhoneNumberThunk({ orderNumber: formData.orderNumber, fullPhone })).unwrap();
      } else {
        localStorage.setItem("orderNumber", formData.orderNumber);
        navigate("/step_2", { state: { orderNumber: formData.orderNumber } });
      }
    } catch (error) {
      console.error("Error sending process at Step_1:", error);
    }
  };

  const showPhoneInputUI = surveyExistsStatus.checked && surveyExistsStatus.exists;
  const phonePromptMessageUI = showPhoneInputUI && !formData.phoneNumber
    ? "This order already has a survey. Please enter your phone number to retrieve your coupon."
    : (phoneNumberVerificationStatus.checked && phoneNumberVerificationStatus.status && phoneNumberVerificationStatus.status !== 200 && !phoneNumberVerificationStatus.data?.verified)
      ? (phoneNumberVerificationStatus.error || "Phone number does not match the one used in the survey.")
      : "";

  const couponDetailsUI = (phoneNumberVerificationStatus.checked && phoneNumberVerificationStatus.status === 200 && phoneNumberVerificationStatus.data?.verified)
    ? phoneNumberVerificationStatus.data
    : null;

  const displayError = orderNumberCheckStatus.error || surveyExistsStatus.error || phoneNumberVerificationStatus.error || surveyApiError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-2">
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Logo */}
        <div className="text-center mb-2 sm:mb-4">
          <img
            src="/HevraCom-logo.png"
            alt="Logo"
            className="mx-auto h-8 sm:h-12 md:h-16 mb-2 sm:mb-3 max-w-full object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="text-blue-600 text-sm sm:text-lg font-semibold mb-1">🎁 Free Amazon Gift Card</div>
          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 leading-tight">Enter Your Order Number</h1>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Complete the form to get your free coupon gift!</p>
          <div className="mt-2 sm:mt-3 flex justify-center">
            <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              <span className="text-xs sm:text-sm font-medium">Step 1 of 4</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Order Number Input */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1 flex items-center text-sm">
              Order Number <span className="text-indigo-500 ml-1">*</span>
              <span
                className="ml-2 text-indigo-600 font-bold text-base cursor-pointer relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                !
                {showTooltip && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded p-2 w-64 shadow-lg z-10">
                    Your Amazon Order Number can be found in your account under 'Your Orders.' It typically looks like 123-4567890-1234567.
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
              disabled={isLoading}
              placeholder="e.g. 123-4567890-1234567"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
            />
          </div>

          {/* Phone Input */}
          {showPhoneInputUI && (
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">
                Your Phone Number <span className="text-indigo-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="px-2 py-2 rounded-md border border-gray-200 bg-gray-50 text-base flex-shrink-0 w-20"

                >
                  {countryCodes.map(c => (
                    <option key={c.code} value={c.code} className="text-sm">
                      {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter phone number"
                  className="flex-1 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-base min-w-0"
                />
              </div>
            </div>
          )}

          {/* Error Messages */}
          {displayError && !couponDetailsUI && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm border border-red-300">
              {typeof displayError === 'string' ? displayError : 'An unexpected error occurred. Please try again.'}
            </div>
          )}

          {/* Phone Prompt Message */}
          {phonePromptMessageUI && !couponDetailsUI && !displayError && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm border border-yellow-300">
              {phonePromptMessageUI}
            </div>
          )}

          {/* Coupon Details */}
          {couponDetailsUI && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-3 py-3 rounded-md shadow-sm">
              <div className="flex items-start space-x-2">
                <div className="text-lg flex-shrink-0">🎉</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">The survey has already been filled out for this order.</p>
                  <div className="text-sm break-words">
                    <span className="font-semibold">Your coupon code:</span>
                    <div className="mt-1">
                      <span className="text-green-700 bg-white px-2 py-1 rounded-md border border-green-400 font-mono text-sm tracking-wide shadow-sm inline-block break-all">
                        {couponDetailsUI.couponCode}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">The coupon is valid until:</span>
                    <span className="underline ml-1">{formatDate(couponDetailsUI.couponExpirationDate)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.orderNumber || (showPhoneInputUI && !formData.phoneNumber && !couponDetailsUI)}
            className={`w-full py-3 rounded-md text-white text-base font-semibold transition duration-300 ${(isLoading || !formData.orderNumber || (showPhoneInputUI && !formData.phoneNumber && !couponDetailsUI))
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
              }`}
          >
            {isLoading ? "Loading..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Step_1;
