import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PosterCard = ({ poster, onDelete, onEdit }) => {
  const { user } = useAuth();

  const canEdit = user && (
    poster.uploadedBy === user._id || 
    user.role === "principal" || 
    user.role === "admin"
  );

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

      if (onDelete) {
        onDelete(poster._id);
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleEdit = async () => {
    const newTitle = prompt("Enter new title", poster.title);
    if (!newTitle) return;

    const newDescription = prompt("Enter new description", poster.description);
    if (!newDescription) return;

    const newPriority = prompt("Enter priority: high / medium / low", poster.priority);
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

      alert("Poster updated successfully!");
      if (onEdit) {
        onEdit(poster._id);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div style={styles.card}>
      <img src={poster.imageUrl} alt={poster.title} style={styles.image} />

      <div style={{ padding: "12px" }}>
        <h4>
          {poster.title}
          {!poster.isActive && <span style={{ color: "red", marginLeft: "10px", fontSize: "14px", fontWeight: "bold" }}>[DELETED]</span>}
        </h4>
        <p>{poster.description}</p>

        <div style={styles.actions}>
          {canEdit && (
            <button style={styles.editBtn} onClick={handleEdit}>
              Edit
            </button>
          )}

          {canEdit && (
            <button style={styles.deleteBtn} onClick={handleDelete}>
              Delete
            </button>
          )}
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