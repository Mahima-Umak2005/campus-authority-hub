import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HODDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>HOD Dashboard</h2>
      <p>Name: {user?.name}</p>
      <p>Role: {user?.role}</p>
      <p>Department: {user?.department}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HODDashboard;