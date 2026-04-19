import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import PosterList from "../components/PosterList";
<<<<<<< HEAD
import { getDashboardPostersApi } from "../api/posters";
=======
import { getActivePostersApi } from "../api/posters";
import { getDashboardFiles } from "../api/repository";
>>>>>>> 8807a287da3eb907c15b4fad338a31dd6fb89761

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
<<<<<<< HEAD
        const { data } = await getDashboardPostersApi(token);
        setPosters(data);
      } catch (err) {
        console.error("Failed to load posters", err);
        setError("Failed to load department notices.");
=======

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
>>>>>>> 8807a287da3eb907c15b4fad338a31dd6fb89761
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