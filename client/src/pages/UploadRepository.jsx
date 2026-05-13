import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { uploadRepositoryFileApi } from "../api/repository";

const roleOptions = ["chairman", "principal", "hod", "faculty"];

const UploadRepository = () => {
  const { user } = useAuth();

  const getInitialForm = () => ({
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
  });

  const [form, setForm] = useState(getInitialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isDepartmentLocked = user?.role === "hod" || user?.role === "faculty";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleToggle = (role) => {
    setForm((current) => {
      const roles = current.accessRoles.split(",").filter(Boolean);
      const exists = roles.includes(role);
      const nextRoles = exists
        ? roles.filter((item) => item !== role)
        : [...roles, role];

      return {
        ...current,
        accessRoles: nextRoles.join(","),
      };
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setFile(null);
    setFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!form.accessRoles) {
      setError("Please select at least one access role");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "department") {
          data.append(key, isDepartmentLocked ? user?.department || "computer" : form.department);
        } else if (key === "subCategory") {
          data.append(key, form.subCategory?.trim() || "General");
        } else {
          data.append(key, form[key]);
        }
      });

      data.append("uploadedBy", user?._id || "");
      data.append("file", file);

      const res = await uploadRepositoryFileApi(data, token);
      setMessage(res.message || "File uploaded successfully");
      resetForm();
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      const message = err.response?.data?.message || "Upload failed";
      console.log("UPLOAD RESPONSE:", err.response?.data);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <i className="fas fa-cloud-upload-alt text-xl text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Upload Repository File
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Share documents with department, category, approval, and role-based access.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="border-b border-gray-100 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <i className="fas fa-info-circle text-blue-500"></i>
            File Information
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              File Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Academic Calendar 2026-27"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the file content..."
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="academic">Academic</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="quality">Quality</option>
                <option value="activities">Activities</option>
                <option value="administration">Administration</option>
                <option value="confidential">Confidential</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sub Category
              </label>
              <input
                type="text"
                name="subCategory"
                placeholder="e.g., Exam Schedule, Syllabus"
                value={form.subCategory}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={isDepartmentLocked ? user?.department : form.department}
                onChange={handleChange}
                disabled={isDepartmentLocked}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="computer">Computer Science</option>
                <option value="civil">Civil Engineering</option>
                <option value="mechanical">Mechanical Engineering</option>
                <option value="electrical">Electrical Engineering</option>
                <option value="all">All Departments</option>
              </select>
              {isDepartmentLocked && (
                <p className="mt-1 text-xs text-gray-400">
                  Department is locked to your assigned department.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                placeholder="2025-26"
                value={form.academicYear}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Access Roles
            </label>
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-4">
              {roleOptions.map((role) => {
                const roles = form.accessRoles.split(",").filter(Boolean);
                const checked = roles.includes(role);

                return (
                  <label
                    key={role}
                    className="flex items-center gap-2 text-sm capitalize text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleRoleToggle(role)}
                    />
                    {role}
                  </label>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Files are visible only to selected roles after approval.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="exam, schedule, notice"
              value={form.tags}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="showOnDashboard"
                checked={form.showOnDashboard}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show on Dashboard after approval</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isConfidential"
                checked={form.isConfidential}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Confidential File</span>
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select File <span className="text-red-500">*</span>
            </label>
            <input type="file" onChange={handleFileChange} required className="hidden" id="fileInput" />
            <label
              htmlFor="fileInput"
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 transition hover:border-blue-500 hover:bg-white"
            >
              <span className="text-sm text-gray-600">
                <i className="fas fa-upload mr-2 text-blue-500"></i>
                {fileName || "Choose a file"}
              </span>
              <i className="fas fa-folder-open text-gray-400"></i>
            </label>
            <p className="mt-1 text-xs text-gray-400">
              Supports PDF, Office documents, images, and common resource files.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
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
            onClick={resetForm}
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-5 max-w-4xl rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-5 max-w-4xl rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}
    </Layout>
  );
};

export default UploadRepository;
