import { useState } from "react";
import { uploadCouponFile } from "../Services/SurveyService"; 

function CouponUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) {
    setMessage("Please select a file to upload.");
    return;
  }

  try {
    const result = await uploadCouponFile(file);
    setMessage("Upload successful! " + (result.message || ""));
  } catch (err) {
    setMessage(err.message || "Upload failed.");
  }
};

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Coupons File</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-indigo-700">{message}</p>}
    </div>
  );
}

export default CouponUpload;
