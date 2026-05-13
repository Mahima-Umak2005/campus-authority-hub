import { useState } from "react";
import { uploadStudentsCSVApi } from "../api/student";

const UploadCSVForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const token = localStorage.getItem("token");
      const data = await uploadStudentsCSVApi(formData, token);
      setMessage(data.message);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 p-5 border border-gray-300 rounded-lg max-w-[600px] bg-white shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Bulk Upload Students</h3>
      <p className="text-gray-500 text-sm mb-4">
        Upload a CSV file to add multiple students. Required columns: <strong className="text-gray-700">name, email, password, department</strong>. Optional: <strong className="text-gray-700">class</strong>.
        Existing students will be skipped.
      </p>
      
      <form onSubmit={handleSubmit} className="flex gap-2.5 items-center">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="p-2 border border-gray-300 rounded flex-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" 
        />
        <button 
          type="submit" 
          disabled={loading || !file} 
          className={`p-2.5 px-5 bg-green-600 text-white border-none rounded cursor-pointer font-bold transition-opacity hover:bg-green-700 ${loading || !file ? 'opacity-60 cursor-not-allowed hover:bg-green-600' : 'opacity-100'}`}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4 font-medium p-2.5 bg-green-50 rounded border border-green-200">{message}</p>}
      {error && <p className="text-red-500 mt-4 font-medium p-2.5 bg-red-50 rounded border border-red-200">{error}</p>}
    </div>
  );
};

export default UploadCSVForm;
