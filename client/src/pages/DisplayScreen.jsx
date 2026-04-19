import { useEffect, useState } from "react";
import { getActivePostersApi } from "../api/posters";
import { Link } from "react-router-dom";

const DisplayScreen = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch all active posters
        const { data } = await getActivePostersApi("", "", token);
        setPosters(data);
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  // Categorize posters
  const collegeNotices = posters.filter(poster => 
    poster.targetDepartments.includes("all")
  );

  const departmentNotices = posters.filter(poster => 
    !poster.targetDepartments.includes("all")
  );

  // Group department notices by their first target department
  const deptGroups = {};
  departmentNotices.forEach(poster => {
    const mainDept = poster.targetDepartments[0] || "General";
    if (!deptGroups[mainDept]) {
      deptGroups[mainDept] = [];
    }
    deptGroups[mainDept].push(poster);
  });

  const renderNoticeCard = (poster) => (
    <div key={poster._id} style={styles.card}>
      <h3 style={styles.cardTitle}>{poster.title}</h3>
      <p style={styles.cardDesc}>
        {poster.description.length > 80 
          ? poster.description.substring(0, 80) + "..." 
          : poster.description}
      </p>
      <a 
        href={poster.imageUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={styles.link}
      >
        View Poster ➔
      </a>
    </div>
  );

  if (loading) {
    return <div style={styles.loading}>Loading Notices...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.navbar}>
        <h2 style={styles.logo}>Campus Authority Hub</h2>
        <div>
          <Link to="/login" style={styles.navBtn}>Login</Link>
          <Link to="/register" style={styles.registerBtn}>Register</Link>
        </div>
      </header>

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Campus Notice Board</h1>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🏫 College Notices</h2>
        {collegeNotices.length > 0 ? (
          <div style={styles.grid}>
            {collegeNotices.map(renderNoticeCard)}
          </div>
        ) : (
          <p style={styles.empty}>No active college notices.</p>
        )}
      </div>

      {Object.keys(deptGroups).map(dept => (
        <div key={dept} style={styles.section}>
          <h2 style={styles.sectionTitle}>
            🏛️ {dept.charAt(0).toUpperCase() + dept.slice(1)} Department Notices
          </h2>
          <div style={styles.grid}>
            {deptGroups[dept].map(renderNoticeCard)}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  navbar: {
    height: "75px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 50px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    fontFamily: "Arial, sans-serif",
  },
  logo: {
    color: "#1d4ed8",
    margin: 0,
  },
  navBtn: {
    marginRight: "15px",
    textDecoration: "none",
    color: "#1d4ed8",
    fontWeight: "bold",
  },
  registerBtn: {
    textDecoration: "none",
    background: "#1d4ed8",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  pageTitle: {
    textAlign: "center",
    color: "#1e3a8a",
    fontSize: "36px",
    marginBottom: "40px",
    borderBottom: "3px solid #2563eb",
    display: "inline-block",
    paddingBottom: "10px",
  },
  section: {
    marginBottom: "50px",
  },
  sectionTitle: {
    color: "#374151",
    fontSize: "24px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardTitle: {
    fontSize: "18px",
    color: "#111827",
    margin: "0 0 10px 0",
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
    marginBottom: "20px",
    flexGrow: 1,
  },
  link: {
    display: "inline-block",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    marginTop: "auto",
  },
  empty: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "24px",
    color: "#4b5563",
    backgroundColor: "#f9fafb",
  }
};

export default DisplayScreen;