import { useState } from "react";
import { uploadPosterApi } from "../api/posters";

const Posters = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: null,
    priority: "medium",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "poster") {
      setFormData({ ...formData, poster: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("poster", formData.poster);
      data.append("priority", formData.priority);
      data.append("expiryDate", formData.expiryDate);
      data.append("targetAudience", JSON.stringify(["all"]));
      data.append("targetDepartments", JSON.stringify(["all"]));

      await uploadPosterApi(data, token);

      setMessage("Poster uploaded successfully!");

      setFormData({
        title: "",
        description: "",
        poster: null,
        priority: "medium",
        expiryDate: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Upload Poster</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Poster Title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          />

          <input
            type="file"
            name="poster"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button style={styles.button} type="submit">
            {loading ? "Uploading..." : "Upload Poster"}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    minHeight: "100px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginTop: "15px",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};

export default Posters;