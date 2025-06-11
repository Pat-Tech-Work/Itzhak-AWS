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
    // שמירה של כל המידע שיש עד כה (מספר הזמנה) תחת מפתח אחיד
    const surveyData = { orderNumber: formData.orderNumber };
    localStorage.setItem("surveyData", JSON.stringify(surveyData));
    navigate("/step_2", { state: surveyData });
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
    // קונטיינר חיצוני עם ריווח פנימי (padding)
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-4 sm:mb-6">
          <img
            src="/HevraCom-logo.png"
            alt="Logo"
            className="mx-auto h-12 sm:h-16 max-w-full object-contain"
          />
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <div className="text-blue-600 text-base sm:text-lg font-semibold mb-2">🎁 Free Amazon Gift Card</div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">Enter Your Order Number</h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">Complete the form to get your free coupon gift!</p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              <span className="text-sm font-medium">Step 1 of 4</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
              Order Number <span className="text-indigo-500 ml-1">*</span>
              <span
                className="ml-2 text-indigo-600 font-bold text-lg cursor-pointer relative flex items-center justify-center h-5 w-5"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                !
                {showTooltip && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md p-2 w-64 shadow-lg z-10">
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
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
            />
          </div>

          {showPhoneInputUI && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Phone Number <span className="text-indigo-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-base flex-shrink-0 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {countryCodes.map(c => (
                    <option key={c.code} value={c.code} className="text-base">
                      {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter phone number"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-base min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          )}

          {displayError && !couponDetailsUI && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-300 break-words">
              {typeof displayError === 'string' ? displayError : 'An unexpected error occurred. Please try again.'}
            </div>
          )}

          {phonePromptMessageUI && !couponDetailsUI && !displayError && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg text-sm border border-yellow-300 break-words">
              {phonePromptMessageUI}
            </div>
          )}

          {couponDetailsUI && (
            <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="text-xl flex-shrink-0 mt-0.5">🎉</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-2">The survey has already been filled out for this order.</p>
                  <div className="text-sm break-words">
                    <span className="font-semibold">Your coupon code:</span>
                    <div className="mt-1">
                      <span className="text-green-700 bg-white px-2.5 py-1.5 rounded-md border border-green-400 font-mono text-sm tracking-wide shadow-sm inline-block break-all">
                        {couponDetailsUI.couponCode}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-semibold">The coupon is valid until:</span>
                    <span className="underline ml-1">{formatDate(couponDetailsUI.couponExpirationDate)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* הצג את הכפתור רק אם פרטי הקופון אינם מוצגים */}
          {!couponDetailsUI && (
          <button
            type="submit"
            disabled={isLoading || !formData.orderNumber || (showPhoneInputUI && !formData.phoneNumber && !couponDetailsUI)}
            className={`w-full py-3 rounded-lg text-white text-base font-semibold transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
              (isLoading || !formData.orderNumber || (showPhoneInputUI && !formData.phoneNumber && !couponDetailsUI))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {isLoading ? "Loading..." : "Next"}
            
          </button>
           )}
        </form>
      </div>
    </div>
  );
}

export default Step_1;
