import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createSurveyThunk } from "../redux/slices/surveySlice";
import { useDispatch } from "react-redux";
import amazonProductLinks from '../Services/productLinks';

function Step_4() {
    const navigate = useNavigate();
    const location = useLocation();
const dispatch = useDispatch();

    const previousData = location.state || JSON.parse(localStorage.getItem("surveyData")) || {};

    const [formData, setFormData] = useState({
        ...previousData,
        review: previousData.review || "",
    });

    const [copySuccess, setCopySuccess] = useState("");

    useEffect(() => {
        localStorage.setItem("surveyData", JSON.stringify(formData));
    }, [formData]);

    const isCustomerSatisfied = formData.satisfied === "yes";

    const handleReviewChange = (e) => {
        setFormData({ ...formData, review: e.target.value });
    };

    const handleBack = () => {
        navigate("/step_3", { state: formData });
    };


    const productLink = amazonProductLinks[formData.product];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formData.review)
            .then(() => {
                setCopySuccess("Copied!");
                setTimeout(() => setCopySuccess(""), 2000);
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
                setCopySuccess("Copy failed");
            });
    };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.review) {
        alert("Lack of field of criticism");
        return;
    }

    if (!formData.orderNumber || !formData.email || !formData.satisfied || !formData.name) {
        alert("Important data missing");
        return;
    }

    try {
        const resultAction = await dispatch(createSurveyThunk(formData));
        const response = resultAction.payload;

        if (response?.couponCode) {
            localStorage.removeItem("surveyData");
            navigate("/success", {
                state: {
                    couponCode: response.couponCode,
                    couponExpirationDate: response.couponExpirationDate
                }
            });
        } else {
            alert("Survey sent, but no coupon code received.");
        }
    } catch (error) {
        alert("Error sending survey: " + error.message);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full h-14 sm:h-16 lg:h-24">
                <div className="w-full h-full bg-cover bg-center bg-[url('/bg.jpg')]" />
            </div>

            <div className="container mx-auto px-3 sm:px-4 -mt-8 sm:-mt-10 lg:-mt-14 mb-10">
                <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6">
                    <img
                        src="/HevraCom-logo.png"
                        className="mx-auto h-12 sm:h-14 w-auto mt-2 mb-2"
                        alt="HevraCom Logo"
                    />

                    <div className="text-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Final Step</h2>
                        <div className="text-blue-600 text-sm sm:text-base font-semibold">🎁 Free Amazon Gift Card</div>
                        <p className="text-gray-500 text-sm mt-1">You're almost there! Please review your gift details.</p>
                        <div className="mt-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm">
                                Step 4 of 4
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                        {productLink && (
                            <div className="text-center mt-6">
                                <a
                                    href={productLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Write a review on Amazon
                                </a>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Step_4;

/*
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createSurvey } from "../Services/SurveyService";
import amazonProductLinks from '../Services/productLinks';

function Step_4() {
    const navigate = useNavigate();
    const location = useLocation();

    const previousData = location.state || JSON.parse(localStorage.getItem("surveyData")) || {};

    const [formData, setFormData] = useState({
        ...previousData,
        review: previousData.review || "",
    });

    const [copySuccess, setCopySuccess] = useState("");

    useEffect(() => {
        localStorage.setItem("surveyData", JSON.stringify(formData));
    }, [formData]);

    const isCustomerSatisfied = formData.satisfied === "yes";

    const handleReviewChange = (e) => {
        setFormData({ ...formData, review: e.target.value });
    };

    const handleBack = () => {
        navigate("/step_3", { state: formData });
    };


    const productLink = amazonProductLinks[formData.product];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formData.review)
            .then(() => {
                setCopySuccess("Copied!");
                setTimeout(() => setCopySuccess(""), 2000);
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
                setCopySuccess("Copy failed");
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.review) {
            alert("חסר שדה ביקורת");
            return;
        }

        if (!formData.orderNumber || !formData.email || !formData.satisfied || !formData.name) {
            alert("חסרים נתונים חשובים");
            return;
        }

        try {
            const response = await createSurvey(formData);
            localStorage.removeItem("surveyData");
            navigate("/success", { state: { couponCode: response.couponCode } });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                if (error.response.data.couponCode) {
                    localStorage.removeItem("surveyData");
                    navigate("/success", { state: { couponCode: error.response.data.couponCode } });
                } else {
                    alert(error.response.data.error || error.message);
                }
            } else {
                alert(error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full h-14 sm:h-16 lg:h-24">
                <div className="w-full h-full bg-cover bg-center bg-[url('/bg.jpg')]" />
            </div>

            <div className="container mx-auto px-3 sm:px-4 -mt-8 sm:-mt-10 lg:-mt-14 mb-10">
                <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6">
                    <img
                        src="/HevraCom-logo.png"
                        className="mx-auto h-12 sm:h-14 w-auto mt-2 mb-2"
                        alt="HevraCom Logo"
                    />

                    <div className="text-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Final Step</h2>
                        <div className="text-blue-600 text-sm sm:text-base font-semibold">🎁 Free Amazon Gift Card</div>
                        <p className="text-gray-500 text-sm mt-1">You're almost there! Please review your gift details.</p>
                        <div className="mt-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm">
                                Step 4 of 4
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">


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
                        {productLink && (
                            <div className="text-center mt-6">
                                <a
                                    href={productLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Write a review on Amazon
                                </a>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Step_4;
*/