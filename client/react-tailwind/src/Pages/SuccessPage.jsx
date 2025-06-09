import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

// --- האייקונים נשארים ללא שינוי ---
const CopyIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M4 1.5H3a2 2 0 0 0-2 2v8.5A1.5 1.5 0 0 0 2.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1zM10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1zM10.5 1.5A1.5 1.5 0 0 0 9 0h-3A1.5 1.5 0 0 0 4.5 1.5v1A1.5 1.5 0 0 0 6 4.5h3A1.5 1.5 0 0 0 10.5 3v-1.5z" />
  </svg>
);
const CheckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
  </svg>
);
const ClockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
  </svg>
);

function SuccessPage() {
  const location = useLocation();
  const couponCode = location.state?.couponCode || "AMZN-GIFT-1234";
  const couponExpirationDate = location.state?.couponExpirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 text-center flex flex-col items-center">

        {/* אייקון הצלחה עדין יותר */}
        <div className="mx-auto bg-green-50 rounded-full h-20 w-20 flex items-center justify-center ring-2 ring-green-100">
          <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* כותרות רגועות יותר */}
        <div className="mt-5 space-y-1">
          <h1 className="text-2xl font-bold text-green-600">Thank You!</h1>
          <p className="text-base text-slate-500 max-w-md">
            We genuinely value your feedback and appreciate you taking the time to share it.<br/>
            Your submission has been received. 🎉
          </p>
        </div>

        {/* בלוק קופון משולב ונקי */}
        {couponCode ? (
          <div className="w-full mt-6 pt-6 border-t border-slate-200/80">
            <p className="text-sm font-medium text-slate-500 mb-3">Your Amazon Gift Card Code:</p>

            <div className="relative p-4 border border-slate-200 rounded-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-2xl font-semibold font-mono text-indigo-500 tracking-wide break-all">
                  {couponCode}
                </span>
                <button
                  onClick={handleCopy}
                  disabled={isCopied}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out border ${isCopied
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-200'
                    }`}
                >
                  {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>Valid until: <strong>{formatDate(couponExpirationDate)}</strong></span>
            </div>
          </div>
        ) : (
          <div className="w-full mt-6 pt-6 border-t border-slate-200/80">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Your coupon is on its way and will be sent to you soon!</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SuccessPage;
