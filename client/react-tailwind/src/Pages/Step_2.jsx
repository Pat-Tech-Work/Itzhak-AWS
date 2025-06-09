import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Step_2() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- שינוי 1: קריאה עקבית של כל המידע הקיים ---
  // קוראים את המידע מ-navigate, ואם אין (בגלל רענון), אז מ-localStorage.
  const previousData = location.state || JSON.parse(localStorage.getItem("surveyData")) || {};

  const [formData, setFormData] = useState({
    // הגדרת ערכי ברירת מחדל לשדות של שלב זה
    email: "",
    name: "",
    phoneNumber: "",
    countryCode: "+972", // קוד ברירת מחדל לישראל
    satisfied: "",
    updates: false,
    // מיזוג עם המידע שהגיע מהשלבים הקודמים.
    // אם שדה קיים ב-previousData, הוא ידרוס את ברירת המחדל.
    ...previousData
  });

  // --- שינוי 2: שמירת כל שינוי בטופס ישירות ל-localStorage ---
  // ה-useEffect הזה מבטיח שהמידע תמיד מגובה.
  useEffect(() => {
    localStorage.setItem("surveyData", JSON.stringify(formData));
  }, [formData]);

  const [showTooltip, setShowTooltip] = useState(false);

  // List of country codes
  const countryCodes = [
    { code: "+972", country: "Israel" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    // ... הוסף כאן את שאר המדינות מהקוד המקורי שלך ...
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = name === "phoneNumber" ? value.replace(/\D/g, "") : value;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : updatedValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // המידע כבר מעודכן ב-formData בזכות ה-state.
    // פשוט מנווטים לשלב הבא עם כל האובייקט המלא.
    navigate("/step_3", { state: formData });
  };

  const isFormValid = formData.orderNumber && formData.email && formData.satisfied && formData.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:py-12">
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-lg shadow border border-gray-100 px-4 sm:px-6 py-3">
          <div className="text-center mb-2">
            <img src="/HevraCom-logo.png" alt="Logo" className="mx-auto h-10 sm:h-12 w-auto mb-1" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Your Feedback</h1>
            <p className="text-xs sm:text-sm text-gray-500">We'd love to hear your thoughts on our product</p>
            <div className="mt-1 flex justify-center">
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                <span className="text-xs font-medium">Step 2 of 4</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* --- כאן מגיע כל ה-JSX של הטופס שלך ללא שינוי --- */}
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-0.5">Your Full Name <span className="text-indigo-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm"
              />
            </div>

            {/* Order Number */}
            <div className="relative">
              <label className="block text-gray-700 font-medium text-sm mb-0.5">
                Your Order Number <span className="text-indigo-500">*</span>
              </label>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="Enter your order number"
                required
                readOnly
                className="w-full px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-gray-700 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-0.5">Your Email Address <span className="text-indigo-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-0.5">Your Phone Number</label>
              <div className="flex gap-2">
                <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="px-2 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm">
                  {countryCodes.map(country => (
                    <option key={country.code} value={country.code}>{country.code} {country.country}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="flex-1 px-2 sm:px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Updates Checkbox */}
            <div className="flex items-center">
              <input type="checkbox" name="updates" checked={formData.updates} onChange={handleChange} className="h-3 w-3 text-indigo-500 focus:ring-indigo-400" />
              <label className="ml-2 text-gray-600 text-xs">I agree to receive special offers and updates by email and SMS</label>
            </div>

            {/* Satisfaction Radio */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">Are you satisfied with the product? <span className="text-indigo-500">*</span></label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input type="radio" name="satisfied" value="yes" checked={formData.satisfied === "yes"} onChange={handleChange} required className="h-3 w-3 text-indigo-500" />
                  <span className="ml-2 text-sm">Yes</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="satisfied" value="no" checked={formData.satisfied === "no"} onChange={handleChange} className="h-3 w-3 text-indigo-500" />
                  <span className="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3 mt-3">
              <button type="button" onClick={() => navigate("/step_1", { state: formData })} className="w-1/3 py-1.5 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-100 transition">Back</button>
              <button type="submit" className={`flex-grow py-1.5 rounded text-white text-sm ${isFormValid ? 'bg-indigo-500 hover:bg-indigo-600 transition' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!isFormValid}>Next</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Step_2;
