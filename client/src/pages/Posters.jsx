import { useState } from "react";
import { uploadPosterApi } from "../api/posters";
import { useAuth } from "../context/AuthContext";

const Posters = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: null,
    priority: "medium",
    isPinned: false,
    publishDate: "",
    expiryDate: "",
    visibilityMode: "all_departments",
    targetDepartments: [],
    audienceMode: "faculty_students",
  });

  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "poster") {
      setFormData({ ...formData, poster: files[0] });
    } else if (e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDepartmentChange = (department) => {
    setFormData((current) => {
      const exists = current.targetDepartments.includes(department);

      return {
        ...current,
        targetDepartments: exists
          ? current.targetDepartments.filter((item) => item !== department)
          : [...current.targetDepartments, department],
      };
    });
  };

  const getAudience = () => {
    if (user?.role === "hod") {
      if (formData.audienceMode === "faculty") return ["faculty"];
      if (formData.audienceMode === "student") return ["student"];
      return ["faculty", "student"];
    }

    if (user?.role === "faculty") {
      return ["student"];
    }

    if (formData.visibilityMode === "all_hods") {
      return ["hod"];
    }

    return ["hod", "faculty", "student"];
  };

  const getDepartments = () => {
    if (user?.role === "hod" || user?.role === "faculty") {
      return [user.department];
    }

    if (formData.visibilityMode === "selected_departments") {
      return formData.targetDepartments;
    }

    return ["all"];
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
      data.append("isPinned", formData.isPinned || formData.priority === "high");
      data.append("publishDate", formData.publishDate || new Date().toISOString());
      data.append("expiryDate", formData.expiryDate);

      const finalDepartments = getDepartments();
      if (finalDepartments.length === 0) {
        setError("Please select at least one department.");
        setLoading(false);
        return;
      }

      data.append("visibilityMode", formData.visibilityMode);
      data.append("targetAudience", JSON.stringify(getAudience()));
      data.append("targetDepartments", JSON.stringify(finalDepartments));

      await uploadPosterApi(data, token);

      setMessage("Poster uploaded successfully!");

      setFormData({
        title: "",
        description: "",
        poster: null,
        priority: "medium",
        isPinned: false,
        publishDate: "",
        expiryDate: "",
        visibilityMode: "all_departments",
        targetDepartments: [],
        audienceMode: "faculty_students",
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

          <label className="mb-[15px] flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleChange}
            />
            Pin as important notice
          </label>

          <label className="mb-1 text-sm font-semibold text-gray-700">
            Publish Date
          </label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />

          {(user?.role === "principal" || user?.role === "chairman") && (
            <>
              <select
                name="visibilityMode"
                value={formData.visibilityMode}
                onChange={handleChange}
                className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="all_hods">All HODs Only</option>
                <option value="all_departments">All Departments</option>
                <option value="selected_departments">Selected Departments</option>
              </select>

              {formData.visibilityMode === "selected_departments" && (
                <div className="mb-[15px] rounded-lg border border-gray-300 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Select Departments
                  </p>
                  {["computer", "electrical", "mechanical", "civil"].map(
                    (department) => (
                      <label
                        key={department}
                        className="mb-2 flex items-center gap-2 text-sm capitalize text-gray-700 last:mb-0"
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetDepartments.includes(
                            department
                          )}
                          onChange={() => handleDepartmentChange(department)}
                        />
                        {department}
                      </label>
                    )
                  )}
                </div>
              )}
            </>
          )}

          {user?.role === "hod" && (
            <>
              <select
                name="audienceMode"
                value={formData.audienceMode}
                onChange={handleChange}
                className="w-full p-3 mb-[15px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="faculty">Faculty Only</option>
                <option value="student">Students Only</option>
                <option value="faculty_students">Faculty + Students</option>
              </select>

              <div className="mb-[15px] rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                Department:{" "}
                <span className="font-semibold capitalize text-gray-800">
                  {user?.department}
                </span>
              </div>
            </>
          )}

          {user?.role === "faculty" && (
            <div className="mb-[15px] rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
              Visible to students in{" "}
              <span className="font-semibold capitalize text-gray-800">
                {user?.department}
              </span>{" "}
              department
            </div>
          )}

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
