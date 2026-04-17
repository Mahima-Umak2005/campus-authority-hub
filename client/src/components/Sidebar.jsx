import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Campus Authority Hub</h2>
      <p style={styles.role}>{user?.role}</p>

      <nav style={styles.nav}>
        <Link to="/principal-dashboard" style={styles.link}>
          Dashboard
        </Link>

        <Link to="/posters/new" style={styles.link}>
          Upload Poster
        </Link>

        <Link to="/manage-posters" style={styles.link}>
          Manage Posters
        </Link>

        <Link to="/profile" style={styles.link}>
          Profile
        </Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  logo: {
    fontSize: "22px",
    marginBottom: "10px",
  },
  role: {
    color: "#94a3b8",
    marginBottom: "25px",
    textTransform: "capitalize",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    textDecoration: "none",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    background: "#1e293b",
  },
};

export default Sidebar;