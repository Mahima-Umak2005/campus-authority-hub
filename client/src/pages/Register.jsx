import { useState } from "react";
import { registerApi } from "../api/auth";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "principal",
    collegeName: "",
    collegeCode: "",
    collegeAddress: "",
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
    <div className="register-page-container">
      <div className="register-card">
        <h2>Register</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="principal">Principal</option>
              <option value="chairman">College Admin</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="collegeName"
              placeholder="College Name"
              value={formData.collegeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="collegeCode"
              placeholder="College Code (Unique)"
              value={formData.collegeCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="collegeAddress"
              placeholder="College Address"
              value={formData.collegeAddress}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
      </div>
    </div>
  );
};

export default Register;