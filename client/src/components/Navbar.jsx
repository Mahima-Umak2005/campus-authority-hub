import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <div>
        <h3 style={{ margin: 0 }}>Campus Authority Hub</h3>
        <small>Welcome, {user?.name}</small>
      </div>

      <button onClick={handleLogout} style={styles.btn}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  nav: {
    height: "70px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  btn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;