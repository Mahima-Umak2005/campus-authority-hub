import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const UploadRepository = () => {
  const { user } = useAuth();

  const initialForm = {
    title: "",
    description: "",
    category: "academic",
    subCategory: "",
    department: user?.department || "computer",
    showOnDashboard: false,
    isConfidential: false,
    academicYear: "",
    accessRoles: "chairman,principal,hod,faculty",
    tags: "",
  };

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });
      data.append("uploadedBy", user?._id);
      data.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        data
      );

      alert(res.data.message || "File Uploaded Successfully!");

      setForm({
        ...initialForm,
        department: user?.department || "computer",
      });
      setFile(null);
      setFileName("");
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      alert(error?.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6 md:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <i className="fas fa-cloud-upload-alt text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Upload Repository File</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Share documents, notices, and resources with the campus community
                </p>
              </div>
            </div>
          </div>

          {/* Upload Form Card */}
          <div className="max-w-3xl">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              autoComplete="off"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  File Information
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-heading mr-2 text-gray-400"></i>
                    File Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Academic Calendar 2026-27"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-align-left mr-2 text-gray-400"></i>
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description of the file content..."
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-folder mr-2 text-gray-400"></i>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                    >
                      <option value="academic">📚 Academic</option>
                      <option value="student">👨‍🎓 Student</option>
                      <option value="faculty">👨‍🏫 Faculty</option>
                      <option value="quality">⭐ Quality</option>
                      <option value="activities">🎯 Activities</option>
                      <option value="administration">🏛️ Administration</option>
                      <option value="confidential">🔒 Confidential</option>
                    </select>
                  </div>

                  {/* Sub Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-tag mr-2 text-gray-400"></i>
                      Sub Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subCategory"
                      placeholder="e.g., Exam Schedule, Syllabus"
                      value={form.subCategory}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-building mr-2 text-gray-400"></i>
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                    >
                      <option value="computer">💻 Computer Science</option>
                      <option value="civil">🏗️ Civil Engineering</option>
                      <option value="mechanical">⚙️ Mechanical Engineering</option>
                      <option value="electrical">⚡ Electrical Engineering</option>
                      <option value="all">🌐 All Departments</option>
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                      Academic Year
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      placeholder="2025-26"
                      value={form.academicYear}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-hashtag mr-2 text-gray-400"></i>
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="exam, schedule, notice (comma separated)"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="showOnDashboard"
                      checked={form.showOnDashboard}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <i className="fas fa-chart-line mr-2 text-blue-500"></i>
                      Show on Dashboard
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isConfidential"
                      checked={form.isConfidential}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <i className="fas fa-lock mr-2 text-orange-500"></i>
                      Confidential File (Restricted Access)
                    </span>
                  </label>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-paperclip mr-2 text-gray-400"></i>
                    Select File <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                      id="fileInput"
                    />
                    <label
                      htmlFor="fileInput"
                      className="flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50 hover:bg-white"
                    >
                      <span className="text-gray-600 text-sm">
                        <i className="fas fa-upload mr-2 text-blue-500"></i>
                        {fileName || "Choose a file"}
                      </span>
                      <i className="fas fa-folder-open text-gray-400"></i>
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt"></i>
                      Upload File
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setFile(null);
                    setFileName("");
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-500 text-lg mt-0.5"></i>
              <div>
                <p className="text-sm text-blue-800 font-medium">Upload Guidelines</p>
                <p className="text-xs text-blue-600 mt-1">
                  Files uploaded to the repository will be accessible based on department and role permissions.
                  Confidential files will only be visible to authorized personnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRepository;