import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Step_3() {
    const location = useLocation();
    const navigate = useNavigate();

    // קריאת המידע מהשלב הקודם או מ-localStorage. לוגיקה זו כבר הייתה תקינה.
    const previousData = location.state || JSON.parse(localStorage.getItem("surveyData")) || {};
    const [formData, setFormData] = useState({
        // חשוב: קודם כל פורסים את המידע הקיים כדי לשמר אותו
        ...previousData,
        
        // לאחר מכן, מגדירים ערכי ברירת מחדל רק לשדות החדשים של שלב זה,
        // או דורסים ערכים קיימים אם זו הכוונה.
        // לדוגמה, אם רוצים שהמשתמש יבחר מחדש את שביעות הרצון מהרשימה המפורטת.
        product: previousData.product || "",
        marketplace: previousData.marketplace || "",
        satisfaction: previousData.satisfaction || "",
        usageDuration: previousData.usageDuration || "",
    });

    // ה-useEffect הזה, שכבר היה קיים אצלך, הוא קריטי ומבטיח שהמידע נשמר.
    useEffect(() => {
        localStorage.setItem("surveyData", JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/step_4", { state: formData });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:py-12">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
                <img 
                  src="/HevraCom-logo.png"
                  alt="Company Logo"
                  className="mx-auto h-20 w-auto"
                />
                <h2 className="text-lg font-semibold text-center mb-4">🎁 Free Amazon Gift Card</h2>
                <p className="text-sm text-gray-600 text-center mb-6">Complete the form to get your free gift!</p>
                <div className="mt-4 flex justify-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                        <span className="text-sm font-medium">Step 3 of 4</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* --- כל ה-JSX של הטופס שלך מגיע כאן ללא שינוי --- */}
                    {/* Product Selection */}
                    <div className="mb-4">
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Which product did you purchase? <span className="text-red-500">*</span></label>
                        <select id="product" name="product" value={formData.product} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a product</option>
                            <option value="HevraCom Premium Hangers">HevraCom Premium Hangers</option>
                            <option value="50 White Plastic Hangers">50 White Plastic Hangers</option>
                            <option value="Multi Size Plastic Hangers">Multi Size Plastic Hangers</option>
                        </select>
                    </div>

                    {/* Marketplace Selection */}
                    <div className="mb-4">
                        <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700 mb-1">Which marketplace did you purchase from? <span className="text-red-500">*</span></label>
                        <select id="marketplace" name="marketplace" value={formData.marketplace} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a marketplace</option>
                            <option value="Amazon">Amazon</option>
                            <option value="eBay">HevraCom Website</option>
                            <option value="Walmart">Walmart</option>
                        </select>
                    </div>

                    {/* Satisfaction Level */}
                    <div className="mb-4">
                        <label htmlFor="satisfaction" className="block text-sm font-medium text-gray-700 mb-1">How satisfied are you with your purchase? <span className="text-red-500">*</span></label>
                        <select id="satisfaction" name="satisfaction" value={formData.satisfaction} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a satisfaction level</option>
                            <option value="1 - Very Satisfied">Very Satisfied</option>
                            <option value="2 - Satisfied">Satisfied</option>
                            <option value="3 - Neutral">Neutral</option>
                            <option value="4 - Dissatisfied">Dissatisfied</option>
                            <option value="5 - Very Dissatisfied">Very Dissatisfied</option>
                        </select>
                    </div>

                    {/* Usage Duration */}
                    <div className="mb-4">
                        <label htmlFor="usageDuration" className="block text-sm font-medium text-gray-700 mb-1">How long have you been using the product?</label>
                        <select id="usageDuration" name="usageDuration" value={formData.usageDuration} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a duration</option>
                            <option value="Less than a week">Less than a week</option>
                            <option value="1-4 weeks">1-4 weeks</option>
                            <option value="1-3 months">1-3 months</option>
                            <option value="3-6 months">3-6 months</option>
                            <option value="6-12 months">6-12 months</option>
                            <option value="Over 1 year">Over 1 year</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button type="button" onClick={() => navigate("/step_2", { state: formData })} className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100">Back</button>
                        <button type="submit" className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800`}>Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Step_3;
