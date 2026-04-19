import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getDashboardFiles } from "../api/repository";

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      const data = await getDashboardFiles(
        "faculty",
        user?.department || "all"
      );
      setFiles(data);
    };

    if (user) loadFiles();
  }, [user]);

  return (
    <Layout>
      <h2>Faculty Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      <button
        style={styles.btn}
        onClick={() => navigate("/upload-repository")}
      >
        Upload Repository File
      </button>

      <h3 style={{ marginTop: "25px" }}>Repository Files</h3>

      {files.map((file) => (
        <div key={file._id} style={styles.card}>
          <h4>{file.title}</h4>
          <p>{file.subCategory}</p>
          <small>
            {new Date(file.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </Layout>
  );
};

const styles = {
  btn: {
    padding: "10px 15px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },
};

export default FacultyDashboard;