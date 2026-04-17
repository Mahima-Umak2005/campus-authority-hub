import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Faculty Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back, {user?.name}
            </p>
          </div>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Info Cards */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Name</h3>
            <p>{user?.name}</p>
          </div>

          <div style={styles.card}>
            <h3>Role</h3>
            <p>{user?.role}</p>
          </div>

          <div style={styles.card}>
            <h3>Department</h3>
            <p>{user?.department}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2>Quick Actions</h2>

          <div style={styles.actions}>
            <button
              style={styles.actionBtn}
              onClick={() => navigate("/posters/new")}
            >
              Upload Poster
            </button>

            <button
              style={styles.actionBtn}
              onClick={() => navigate("/manage-posters")}
            >
              Manage Posters
            </button>

            <button
              style={styles.actionBtn}
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Notice */}
        <div style={styles.notice}>
          <h3>Faculty Notice</h3>
          <p>
            Use this dashboard to upload academic notices, event posters,
            workshop announcements, and department updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    padding: "10px",
  },

  header: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    padding: "25px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
  },

  subtitle: {
    marginTop: "6px",
    opacity: 0.9,
  },

  logoutBtn: {
    padding: "10px 18px",
    border: "none",
    background: "white",
    color: "#2563eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  section: {
    marginTop: "35px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  actions: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "15px",
  },

  actionBtn: {
    padding: "12px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  notice: {
    marginTop: "30px",
    background: "#eff6ff",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "5px solid #2563eb",
  },
};

export default FacultyDashboard;