import { useLocation } from "react-router-dom";

function SuccessPage() {
    // משתמשים ב-React Router כדי לקרוא את קוד הקופון מה-state של ה-router
    const location = useLocation();
    const couponCode = location.state?.couponCode; // אם יש state עם couponCode

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-green-600">Thank You!</h2>
                <p className="text-gray-700">Your submission has been received.</p>

                {/* אם קיים קוד קופון, הצג אותו */}
                {couponCode ? (
                    <div className="mt-4 p-4 bg-green-100 rounded-md">
                        <h3 className="text-xl font-bold">Your Coupon Code:</h3>
                        <p className="text-lg text-green-600">{couponCode}</p>
                    </div>
                ) : (
                    <p className="text-red-600">No coupon code available.</p>
                )}
            </div>
        </div>
    );
}

export default SuccessPage;
