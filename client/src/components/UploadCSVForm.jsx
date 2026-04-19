import { useState } from "react";
import { uploadStudentsCSVApi } from "../api/student";

const UploadCSVForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const token = localStorage.getItem("token");
      const data = await uploadStudentsCSVApi(formData, token);
      setMessage(data.message);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Bulk Upload Students</h3>
      <p style={styles.helpText}>
        Upload a CSV file to add multiple students. Required columns: <strong>name, email, password, department</strong>. Optional: <strong>class</strong>.
        Existing students will be skipped.
      </p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={styles.input} 
        />
        <button 
          type="submit" 
          disabled={loading || !file} 
          style={{...styles.button, opacity: loading || !file ? 0.6 : 1}}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "600px",
    backgroundColor: "#fff",
  },
  helpText: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    flex: 1,
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  success: {
    color: "green",
    marginTop: "15px",
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginTop: "15px",
    fontWeight: "500",
  },
};

export default UploadCSVForm;
