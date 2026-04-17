import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <h2 style={styles.logo}>Campus Authority Hub</h2>

        <div>
          <Link to="/login" style={styles.navBtn}>
            Login
          </Link>

          <Link to="/register" style={styles.registerBtn}>
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.left}>
          <h1 style={styles.heading}>
            Smart Digital Platform for College Management
          </h1>

          <p style={styles.text}>
            Manage announcements, posters, faculty communication, department
            updates and administrative tasks in one centralized platform.
          </p>

          <div style={{ marginTop: "25px" }}>
            <Link to="/login" style={styles.mainBtn}>
              Get Started
            </Link>
          </div>
        </div>

        <div style={styles.right}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="College"
            style={styles.image}
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 Campus Authority Hub | Designed for Smart Colleges
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fbff",
    fontFamily: "Arial, sans-serif",
  },

  navbar: {
    height: "75px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 50px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
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

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "70px 60px",
    flexWrap: "wrap",
  },

  left: {
    maxWidth: "550px",
  },

  heading: {
    fontSize: "42px",
    color: "#0f172a",
    lineHeight: "1.3",
  },

  text: {
    fontSize: "18px",
    color: "#475569",
    marginTop: "18px",
    lineHeight: "1.6",
  },

  mainBtn: {
    textDecoration: "none",
    background: "#2563eb",
    color: "white",
    padding: "14px 24px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
  },

  right: {
    marginTop: "20px",
  },

  image: {
    width: "380px",
    maxWidth: "100%",
  },

  footer: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
    marginTop: "30px",
  },
};

export default Home;