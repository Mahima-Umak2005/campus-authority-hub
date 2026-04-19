import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { registerApi } from "../api/auth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "hod",
    department: "computer",
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
      setNewUser({ name: "", email: "", password: "", role: "hod", department: "computer" });
    } catch (err) {
      setUserErr(err?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h2>Admin Dashboard</h2>
          <p style={styles.subtitle}>
            Welcome back, <strong>{user?.name}</strong>. Managing administrative tasks.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "500px" }}>
        <h3>Create Department User (HOD / Faculty)</h3>
        <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleUserChange} required style={{ padding: "8px" }} />
          <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleUserChange} required style={{ padding: "8px" }} />
          <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleUserChange} required style={{ padding: "8px" }} />
          <select name="role" value={newUser.role} onChange={handleUserChange} style={{ padding: "8px" }}>
            <option value="hod">HOD</option>
            <option value="faculty">Faculty</option>
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
};

export default AdminDashboard;
