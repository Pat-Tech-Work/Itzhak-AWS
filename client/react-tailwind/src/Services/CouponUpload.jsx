import { useState } from "react";
import { uploadCouponFileThunk  } from "../redux/slices/surveySlice";
import { useDispatch } from "react-redux";
function CouponUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

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
    const resultAction = await dispatch(uploadCouponFileThunk(file));
    if (uploadCouponFileThunk.fulfilled.match(resultAction)) {
      setMessage("Upload successful! " + (resultAction.payload.message || ""));
    } else {
      setMessage(resultAction.payload || "Upload failed.");
    }
  } catch (err) {
    setMessage("Unexpected error occurred.");
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
