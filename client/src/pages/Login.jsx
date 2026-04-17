import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const redirectUser = (role) => {
    if (role === "principal" || role === "chairman") {
      navigate("/principal-dashboard");
    } else if (role === "hod") {
      navigate("/hod-dashboard");
    } else {
      navigate("/faculty-dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await loginApi(formData);

      login(data.token, data);
      redirectUser(data.role);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Campus Authority Hub</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          {loading ? "Please wait..." : "Login"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={{ marginTop: "15px" }}>
          Don't have account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #2563eb, #1e3a8a)",
  },
  card: {
    width: "350px",
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: "12px",
    textAlign: "center",
  },
};

export default Login;