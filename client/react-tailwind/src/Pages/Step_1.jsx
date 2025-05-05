import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Step_1() {
    const [formData, setFormData] = useState({ orderNumber: "" });
    const [error, setError] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // איפוס הודעת השגיאה בעת שינוי
    };
// שמירה ב localStorage
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:4000/api/orderNumber/${formData.orderNumber}`);

        if (!response.ok) {
            setError("Order number not found. Please check and try again.");
            return;
        }

        const data = await response.json();

        // שמירת מספר ההזמנה ב-localStorage
        localStorage.setItem("orderNumber", formData.orderNumber);

        // מעבר לעמוד הבא
        navigate("/step_2", { state: { orderNumber: formData.orderNumber } });
    } catch (error) {
        console.error("Error verifying order number:", error);
        setError("Server connection error. Please try again later.");
    }
};


    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 px-12 py-10">
          <img
            src="/HevraCom-logo.png"
            alt="Logo"
            className="mx-auto h-20 mb-6"
          />
      
          <div className="text-center mb-6">
            <div className="text-blue-600 text-xl font-semibold mb-2">
              🎁 Free Amazon Gift Card
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Enter Your Order Number
            </h1>
            <p className="text-gray-600 text-base">
              Complete the form to get your free coupon gift!
            </p>
            <div className="mt-4 flex justify-center">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                                <span className="text-sm font-medium">Step 1 of 4</span>
                            </div>
                        </div>
          </div>
      
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
      
            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white text-lg font-semibold ${
                formData.orderNumber
                  ? "bg-indigo-500 hover:bg-indigo-600 transition duration-300"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!formData.orderNumber}
            >
              Next
            </button>
          </form>
        </div>
      </div>
      
      
    );
}

export default Step_1;
