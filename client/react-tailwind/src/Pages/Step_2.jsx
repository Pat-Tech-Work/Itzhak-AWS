import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Step_2() {
    const location = useLocation();
    const navigate = useNavigate();

    // שימוש בנתון שהגיע מהעמוד הקודם, אם יש כזה
    const initialOrderNumber = location.state?.orderNumber || "";

    const [formData, setFormData] = useState({
        orderNumber: initialOrderNumber,
        email: "",
        name: "",
        phoneNumber: "",
        satisfied: "",
        updates: false
    });

    const [showTooltip, setShowTooltip] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/step_3", { state: formData });
    };

    const isFormValid = formData.orderNumber && formData.email && formData.satisfied && formData.name;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
          <div className="w-full relative overflow-hidden h-0.5">
            <div className="w-full h-full bg-cover bg-center bg-[url('/bg.jpg')]" aria-hidden="true"></div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-lg shadow border border-gray-100 px-4 sm:px-6 py-3">
              <div className="text-center mb-2">
                <img src="/HevraCom-logo.png" className="mx-auto h-10 sm:h-12 w-auto mb-1" />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Your Feedback</h1>
                <p className="text-xs sm:text-sm text-gray-500">We'd love to hear your thoughts on our product</p>
                <div className="mt-1 flex justify-center">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    <span className="text-xs font-medium">Step 2 of 4</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-2">
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
              
                <div className="relative">
                  <label className="block text-gray-700 font-medium text-sm mb-0.5">
                    Your Order Number <span className="text-indigo-500">*</span>
                    <span
                      className="ml-1 text-blue-500 cursor-pointer text-xs"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      !
                    </span>
                  </label>
                  {showTooltip && (
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded p-1.5 w-56 shadow-lg z-10">
                      Your Amazon Order Number can be found in your Amazon account under 'Your Orders.'
                    </div>
                  )}
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
              
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-0.5">Your Phone Number <span className="text-indigo-500">*</span></label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 234-456-7890"
                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
              
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="updates"
                    checked={formData.updates}
                    onChange={handleChange}
                    className="h-3 w-3 text-indigo-500 focus:ring-indigo-400"
                  />
                  <label className="ml-2 text-gray-600 text-xs">
                    I agree to receive special offers and updates by email and SMS
                  </label>
                </div>
              
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Are you satisfied with the product? <span className="text-indigo-500">*</span></label>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="satisfied"
                        value="yes"
                        checked={formData.satisfied === "yes"}
                        onChange={handleChange}
                        required
                        className="h-3 w-3 text-indigo-500"
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="satisfied"
                        value="no"
                        checked={formData.satisfied === "no"}
                        onChange={handleChange}
                        className="h-3 w-3 text-indigo-500"
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                  </div>
                </div>
              
                <div className="flex justify-between gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => navigate("/step_1", { state: formData })}
                    className="w-1/3 py-1.5 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-100 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`flex-grow py-1.5 rounded text-white text-sm ${isFormValid
                      ? 'bg-indigo-500 hover:bg-indigo-600 transition'
                      : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    disabled={!isFormValid}
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
                
      }
      
      export default Step_2;