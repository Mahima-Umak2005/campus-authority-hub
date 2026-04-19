import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Repository = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setFiles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) => {
    const matchSearch = file.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDept =
      department === "all" || file.department === department;

    const matchCategory =
      category === "all" || file.category === category;

    return matchSearch && matchDept && matchCategory;
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <h1>Centralized Repository</h1>

          {/* Filters */}
          <div style={styles.filterRow}>
            <input
              type="text"
              placeholder="Search file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Departments</option>
              <option value="computer">Computer</option>
              <option value="civil">Civil</option>
              <option value="mechanical">Mechanical</option>
              <option value="electrical">Electrical</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="quality">Quality</option>
              <option value="activities">Activities</option>
              <option value="administration">Administration</option>
              <option value="confidential">Confidential</option>
            </select>
          </div>

          {/* File Cards */}
          <div style={styles.grid}>
            {filteredFiles.map((file) => (
              <div key={file._id} style={styles.card}>
                <h3>{file.title}</h3>
                <p><b>Department:</b> {file.department}</p>
                <p><b>Category:</b> {file.category}</p>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
  {/* View File */}
  <a
  href={`http://localhost:5000/api/files/download/${file._id}`}
  style={styles.btn}
>
  Download
</a>
</div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <p style={{ marginTop: "20px" }}>No files found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    width: "250px",
  },
  select: {
    padding: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  btn: {
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 14px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
  },
  downloadBtn: {
  display: "inline-block",
  padding: "8px 14px",
  background: "#16a34a",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
},
};

export default Repository;