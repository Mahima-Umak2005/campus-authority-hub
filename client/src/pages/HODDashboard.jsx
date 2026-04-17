import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import PosterList from "../components/PosterList";
import { getActivePostersApi } from "../api/posters";

const HODDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch posters targeted at this HOD's department
        const { data } = await getActivePostersApi("hod", user?.department || "all", token);
        setPosters(data);
      } catch (err) {
        console.error("Failed to load posters", err);
        setError("Failed to load department notices.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPosters();
    }
  }, [user]);

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h2>HOD Dashboard</h2>
          <p style={styles.subtitle}>
            Welcome back, <strong>{user?.name}</strong>. Managing the <strong>{user?.department}</strong> department.
          </p>
        </div>
        <button 
          style={styles.actionButton} 
          onClick={() => navigate("/posters/new")}
        >
          + Add New Notice
        </button>
      </div>

      <div style={styles.content}>
        <h3>Active Department Notices</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? (
          <p>Loading notices...</p>
        ) : posters.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No active notices found for your department.</p>
          </div>
        ) : (
          <PosterList posters={posters} />
        )}
      </div>
    </Layout>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    marginTop: "5px",
  },
  actionButton: {
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)",
    transition: "transform 0.2s, background-color 0.2s",
  },
  content: {
    marginTop: "20px",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#f9fafb",
    border: "1px dashed #d1d5db",
    borderRadius: "12px",
    color: "#6b7280",
    marginTop: "20px",
  }
};

export default HODDashboard;