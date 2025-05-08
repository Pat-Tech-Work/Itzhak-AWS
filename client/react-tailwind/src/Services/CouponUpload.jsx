import { useState } from "react";

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
    const formData = new FormData();
    formData.append('couponFile', file);

    try {
      const response = await fetch('https://itzhak-aws-vkmdh.ondigitalocean.app//api/couponCode/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error || "Upload failed");
        return;
      }

      const result = await response.json();
      setMessage("Upload successful! " + (result.message || ""));
    } catch (err) {
      setMessage("Server error. Try again later.");
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
