import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import PosterList from "../components/PosterList";
import { getActivePostersApi } from "../api/posters";
import { getDashboardFiles } from "../api/repository";

const HODDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posters, setPosters] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        const posterData = await getActivePostersApi(
          "hod",
          user?.department || "all",
          token
        );

        setPosters(posterData.data);

        const repoData = await getDashboardFiles(
          "hod",
          user?.department || "all"
        );

        setFiles(repoData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  return (
    <Layout>
      <h2>HOD Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      <h3 style={{ marginTop: "30px" }}>Repository Updates</h3>

      {files.length === 0 ? (
        <p>No repository files</p>
      ) : (
        files.map((file) => (
          <div key={file._id} style={styles.card}>
            <h4>{file.title}</h4>
            <p>{file.subCategory}</p>
            <small>
              {file.department} |{" "}
              {new Date(file.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))
      )}

      <h3 style={{ marginTop: "40px" }}>Posters</h3>

      {loading ? <p>Loading...</p> : <PosterList posters={posters} />}
    </Layout>
  );
};

const styles = {
  btn: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
};

export default HODDashboard;