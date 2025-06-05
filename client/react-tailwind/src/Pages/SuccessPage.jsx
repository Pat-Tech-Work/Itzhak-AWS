//SuccessPage.jsx
import { useLocation } from "react-router-dom";

function SuccessPage() {
  const location = useLocation();
  const couponCode = location.state?.couponCode;
  const couponExpirationDate = location.state?.couponExpirationDate;

  console.log("Success page received:", { 
    couponCode, 
    couponExpirationDate,
    dateType: couponExpirationDate ? typeof couponExpirationDate : "undefined"
  });

  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.log("No date provided");
      return "N/A";
    }
    
    try {
      // If it's already a date string in ISO format, use it directly
      const date = new Date(dateStr);
      
      console.log("Parsing date:", {
        input: dateStr,
        parsed: date,
        time: date.getTime(),
        isValid: !isNaN(date.getTime())
      });
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateStr);
        return "N/A";
      }
      
      // Format with Israeli locale (day.month.year)
      return date.toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-600">Thank You!</h2>
        <p className="text-gray-700">Your submission has been received.</p>

        {couponCode ? (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <h3 className="text-xl font-bold">Your Coupon Code:</h3>
            <p className="text-lg text-green-600">{couponCode}</p>
          </div>
        ) : (
          <p className="text-red-600">No coupon code available.</p>
        )}

        <p className="text-sm text-gray-600 mt-2">
         The coupon is valid until: <strong>{formatDate(couponExpirationDate)}</strong>
        </p>
      </div>
    </div>
  );
}

export default SuccessPage;

/* גיט אהב

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


*/