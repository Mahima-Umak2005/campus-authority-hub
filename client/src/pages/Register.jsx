import { useState } from "react";
import { registerApi } from "../api/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "computer",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await registerApi(formData);
      setMessage("User registered successfully");
      console.log(data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="faculty">Faculty</option>
            <option value="hod">HOD</option>
            <option value="principal">Principal</option>
            <option value="chairman">Chairman</option>
          </select>
        </div>

        <div>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="computer">Computer</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="civil">Civil</option>
            <option value="all">All</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;