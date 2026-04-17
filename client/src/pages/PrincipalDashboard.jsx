import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import PosterList from "../components/PosterList";
import axios from "axios";
import { getActivePostersApi } from "../api/posters";
import { registerApi } from "../api/auth";
const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posterLoading, setPosterLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "computer"
  });
  const [userMsg, setUserMsg] = useState("");
  const [userErr, setUserErr] = useState("");

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg("");
    setUserErr("");
    try {
      await registerApi(newUser);
      setUserMsg("User created successfully!");
      setNewUser({ name: "", email: "", password: "", role: "faculty", department: "computer" });
    } catch (err) {
      setUserErr(err.response?.data?.message || "Failed to create user");
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("STATS RESPONSE:", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("STATS ERROR:", err.response?.data || err.message);
        setStatsError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await getActivePostersApi("principal", "all", token);
        setPosters(data);
      } catch (err) {
        console.error("Failed to load posters");
      } finally {
        setPosterLoading(false);
      }
    };

    fetchStats();
    fetchPosters();
  }, []);

  return (
    <Layout>
      <h2>Principal Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      {loading && <p>Loading dashboard data...</p>}
      {statsError && <p style={{ color: "red" }}>{statsError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats ? (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <StatCard title="Total Users" value={stats.totalUsers ?? 0} color="#2563eb" />
          <StatCard title="Total Files" value={stats.totalFiles ?? 0} color="#16a34a" />
          <StatCard title="Active Posters" value={stats.activePosters ?? 0} color="#f59e0b" />
          <StatCard title="Departments" value={stats.departments ?? 0} color="#dc2626" />
        </div>
      ) : (
        !loading && <p>No stats available</p>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>Uploaded Posters</h3>
        {posterLoading ? <p>Loading posters...</p> : <PosterList posters={posters} />}
      </div>

      <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "500px" }}>
        <h3>Create Department User (Faculty / HOD)</h3>
        <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleUserChange} required style={{ padding: "8px" }} />
          <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleUserChange} required style={{ padding: "8px" }} />
          <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleUserChange} required style={{ padding: "8px" }} />
          <select name="role" value={newUser.role} onChange={handleUserChange} style={{ padding: "8px" }}>
            <option value="faculty">Faculty</option>
            <option value="hod">HOD</option>
          </select>
          <select name="department" value={newUser.department} onChange={handleUserChange} style={{ padding: "8px" }}>
            <option value="computer">Computer</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="civil">Civil</option>
          </select>
          <button type="submit" style={{ padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Create User</button>
        </form>
        {userMsg && <p style={{ color: "green", marginTop: "10px" }}>{userMsg}</p>}
        {userErr && <p style={{ color: "red", marginTop: "10px" }}>{userErr}</p>}
      </div>
    </Layout>
  );
};

export default PrincipalDashboard;