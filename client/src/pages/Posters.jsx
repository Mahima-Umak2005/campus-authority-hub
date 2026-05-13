import { useState } from "react";
import { uploadPosterApi } from "../api/posters";
import { useAuth } from "../context/AuthContext";

const Posters = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: null,
    priority: "medium",
    expiryDate: "",
    targetDepartment: "all",
  });

  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "poster") {
      setFormData({ ...formData, poster: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("poster", formData.poster);
      data.append("priority", formData.priority);
      data.append("expiryDate", formData.expiryDate);
      data.append("targetAudience", JSON.stringify(["all"]));
      
      let finalDepartments = ["all"];
      if (user?.role === "hod" || user?.role === "faculty") {
        finalDepartments = [user.department];
      } else {
        finalDepartments = [formData.targetDepartment];
      }
      data.append("targetDepartments", JSON.stringify(finalDepartments));

      await uploadPosterApi(data, token);

      setMessage("Poster uploaded successfully!");

      setFormData({
        title: "",
        description: "",
        poster: null,
        priority: "medium",
        expiryDate: "",
        targetDepartment: "all",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex justify-center bg-gray-50 min-h-screen w-full">
      <div className="w-full max-w-[500px] bg-white p-[30px] rounded-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Poster</h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="title"
            placeholder="Poster Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 min-h-[100px] mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
            required
          />

          <input
            type="file"
            name="poster"
            onChange={handleChange}
            className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            required
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            name="targetDepartment"
            value={user?.role === "hod" || user?.role === "faculty" ? user?.department : formData.targetDepartment}
            onChange={handleChange}
            disabled={user?.role === "hod" || user?.role === "faculty"}
            className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="all">All Departments</option>
            <option value="computer">Computer</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="civil">Civil</option>
          </select>

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            required
          />

          <button className="w-full p-3 bg-blue-600 text-white border-none rounded-lg font-bold cursor-pointer transition-colors hover:bg-blue-700 mt-2" type="submit">
            {loading ? "Uploading..." : "Upload Poster"}
          </button>
        </form>

        {message && <p className="text-green-600 mt-[15px] text-center font-medium p-2 bg-green-50 rounded border border-green-100">{message}</p>}
        {error && <p className="text-red-500 mt-[15px] text-center font-medium p-2 bg-red-50 rounded border border-red-100">{error}</p>}
      </div>
    </div>
  );
};

export default Posters;