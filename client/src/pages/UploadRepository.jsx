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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select file");
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
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      console.log("SERVER:", error?.response?.data);

      alert(
        error?.response?.data?.message || "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <h1>Upload Repository File</h1>

          <form
            onSubmit={handleSubmit}
            style={styles.form}
            autoComplete="off"
          >
            <input
              type="text"
              name="title"
              placeholder="File Title"
              value={form.title}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="academic">Academic</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="quality">Quality</option>
              <option value="activities">Activities</option>
              <option value="administration">Administration</option>
              <option value="confidential">Confidential</option>
            </select>

            <input
              type="text"
              name="subCategory"
              placeholder="Sub Category"
              value={form.subCategory}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="computer">Computer</option>
              <option value="civil">Civil</option>
              <option value="mechanical">Mechanical</option>
              <option value="electrical">Electrical</option>
              <option value="all">All</option>
            </select>

            <input
              type="text"
              name="academicYear"
              placeholder="Academic Year (2025-26)"
              value={form.academicYear}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
              style={styles.input}
            />

            <label>
              <input
                type="checkbox"
                name="showOnDashboard"
                checked={form.showOnDashboard}
                onChange={handleChange}
              />{" "}
              Show on Dashboard
            </label>

            <label>
              <input
                type="checkbox"
                name="isConfidential"
                checked={form.isConfidential}
                onChange={handleChange}
              />{" "}
              Confidential File
            </label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  form: {
    display: "grid",
    gap: "12px",
    maxWidth: "600px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  btn: {
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default UploadRepository;