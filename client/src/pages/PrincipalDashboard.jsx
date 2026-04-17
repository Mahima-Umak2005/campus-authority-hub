import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import PosterList from "../components/PosterList";
import axios from "axios";
import { getActivePostersApi } from "../api/posters";
const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posterLoading, setPosterLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

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
    </Layout>
  );
};

export default PrincipalDashboard;