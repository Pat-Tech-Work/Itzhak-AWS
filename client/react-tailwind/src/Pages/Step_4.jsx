import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createSurvey } from "../Services/SurveyService";

function Step_4() {
    const navigate = useNavigate();
    const location = useLocation();

    // מקבל את הנתונים מהשלב הקודם או מה-localStorage
    const previousData = location.state || JSON.parse(localStorage.getItem("surveyData")) || {};

    // -------------------- STATE --------------------
    const [formData, setFormData] = useState({
        ...previousData,
        review: previousData.review || "", // הוספת שדה הביקורת
    });
    const [copySuccess, setCopySuccess] = useState('');

    // -------------------- EFFECTS --------------------
    useEffect(() => {
        // שומר את הנתונים ב-localStorage בכל שינוי
        localStorage.setItem("surveyData", JSON.stringify(formData));
    }, [formData]);

    // -------------------- COMPUTED VALUES --------------------
    // בדיקה אם המשתמש מרוצה - בודקים את שדה satisfied
    const isCustomerSatisfied = formData.satisfied === "yes";

    // -------------------- HANDLERS --------------------
    const handleReviewChange = (e) => {
        setFormData({ ...formData, review: e.target.value });
    };

    const handleBack = () => {
        navigate("/step_3", { state: formData });
    };

    const handleAmazonClick = () => {
        window.open("https://hevracom.store/", "_blank");
    };

    // פונקציה להעתקת הטקסט של הביקורת
    const copyToClipboard = () => {
        navigator.clipboard.writeText(formData.review)
            .then(() => {
                setCopySuccess('Copied!');
                // הסרת ההודעה אחרי 2 שניות
                setTimeout(() => {
                    setCopySuccess('');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                setCopySuccess('Copy failed');
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // בדיקה אם שדה הביקורת ריק
        if (!formData.review) {
            alert('חסר שדה ביקורת');
            return;
        }

        // בדיקה אם שדות חשובים חסרים
        if (!formData.orderNumber || !formData.email || !formData.satisfied || !formData.name) {
            alert('חסרים נתונים חשובים');
            return;
        }

        try {
            // שליחת כל הנתונים כולל שדה הביקורת לשרת
            const response = await createSurvey(formData);

            console.log(response);

            // אחרי שליחה מוצלחת, ניקוי ה-localStorage
            localStorage.removeItem("surveyData");

            // מעבר לדף הצלחה
            navigate("/success", { state: { couponCode: response.couponCode } });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                // במקרה של שגיאה שהסקר כבר קיים אך התקבל קוד קופון
                if (error.response.data.couponCode) {
                    // ניקוי ה-localStorage
                    localStorage.removeItem("surveyData");
                    // מעבר לדף הצלחה עם קוד הקופון שהתקבל
                    navigate("/success", { state: { couponCode: error.response.data.couponCode } });
                } else {
                    alert(` ${error.response.data.error || error.message}`);
                }
            } else {
                alert(` ${error.message}`);
            }
        }
    };

    return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  
  {/* תמונת רקע עליונה */}
  <div className="w-full h-14 sm:h-16 lg:h-24">
    <div 
      className="w-full h-full bg-cover bg-center bg-[url('/bg.jpg')]" 
      aria-hidden="true"
    />
  </div>

  {/* מרכז הדף */}
  <div className="container mx-auto px-3 sm:px-4 -mt-8 sm:-mt-10 lg:-mt-14 mb-10">
    
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6">
      
      {/* לוגו */}
      <img 
        src="/HevraCom-logo.png"
        className="mx-auto h-12 sm:h-14 w-auto mt-2 mb-2"
        alt="HevraCom Logo"
      />

      {/* כותרת */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
          Final Step
        </h2>
        <div className="text-blue-600 text-sm sm:text-base font-semibold">
          🎁 Free Amazon Gift Card
        </div>
        <p className="text-gray-500 text-sm mt-1">
          You're almost there! Please review your gift details.
        </p>
        <div className="mt-3">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm">
            Step 4 of 4
          </span>
        </div>
      </div>

      {/* טופס */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ביקורת */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <label htmlFor="review" className="text-sm font-medium text-gray-700">
              Write your review: <span className="text-indigo-500">*</span>
            </label>

            {isCustomerSatisfied && (
              <div className="relative group">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  Copy Review
                </button>

                {copySuccess && (
                  <span className="absolute right-0 -bottom-6 text-green-500 text-xs bg-white px-2 py-1 rounded shadow-sm">
                    {copySuccess}
                  </span>
                )}
              </div>
            )}
          </div>

          <textarea
            id="review"
            value={formData.review}
            onChange={handleReviewChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
            placeholder="Share your experience..."
            required
          />
        </div>

        {/* קישור לאמזון */}
        {isCustomerSatisfied && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleAmazonClick}
              className="w-full sm:w-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-sm font-medium rounded-md transition"
            >
              Leave your review on Amazon
            </button>
          </div>
        )}

        {/* ניווט */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 pt-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-md hover:bg-gray-100"
          >
            Back
          </button>

          <button
            type="submit"
            className="w-full sm:flex-grow px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-md"
          >
            Submit & Get Gift Card
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

      );
      
}

export default Step_4;
