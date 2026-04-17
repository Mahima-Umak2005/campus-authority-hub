import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

const ManagePosters = () => {
  const [allPosters, setAllPosters] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const fetchPosters = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/posters/active?role=principal&department=all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllPosters(res.data);
      setPosters(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load posters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  useEffect(() => {
    let filtered = [...allPosters];

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priority !== "all") {
      filtered = filtered.filter((item) => item.priority === priority);
    }

    setPosters(filtered);
  }, [search, priority, allPosters]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this poster?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/posters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = allPosters.filter((item) => item._id !== id);
      setAllPosters(updated);

      alert("Poster deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleEdit = async (poster) => {
    const newTitle = prompt("Enter new title", poster.title);
    if (!newTitle) return;

    const newDescription = prompt(
      "Enter new description",
      poster.description
    );
    if (!newDescription) return;

    const newPriority = prompt(
      "Enter priority: high / medium / low",
      poster.priority
    );
    if (!newPriority) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/posters/${poster._id}`,
        {
          title: newTitle,
          description: newDescription,
          priority: newPriority.toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Poster updated successfully");
      fetchPosters();
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <Layout>
      <h2>Manage Posters</h2>

      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search posters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading posters...</p>
      ) : posters.length === 0 ? (
        <p>No posters found</p>
      ) : (
        <div style={styles.grid}>
          {posters.map((poster) => (
            <div key={poster._id} style={styles.card}>
              <img
                src={poster.imageUrl}
                alt={poster.title}
                style={styles.image}
              />

              <h3>{poster.title}</h3>
              <p>{poster.description}</p>

              <p>
                <strong>Priority:</strong> {poster.priority}
              </p>

              <div style={styles.btnGroup}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(poster)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(poster._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

const styles = {
  topBar: {
    display: "flex",
    gap: "15px",
    margin: "20px 0",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    width: "260px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  btnGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ManagePosters;