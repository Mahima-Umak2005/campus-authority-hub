import axios from "axios";

const PosterCard = ({ poster, onDelete, onEdit }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this poster?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/posters/${poster._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onDelete(poster._id);
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.card}>
      <img src={poster.imageUrl} alt={poster.title} style={styles.image} />

      <div style={{ padding: "12px" }}>
        <h4>{poster.title}</h4>
        <p>{poster.description}</p>

        <div style={styles.actions}>
          <button style={styles.editBtn} onClick={() => onEdit(poster)}>
            Edit
          </button>

          <button style={styles.deleteBtn} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
  deleteBtn: {
    flex: 1,
    padding: "10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
};

export default PosterCard;