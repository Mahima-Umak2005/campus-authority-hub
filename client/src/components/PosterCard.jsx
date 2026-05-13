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
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col h-full border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <img src={poster.imageUrl} alt={poster.title} className="w-full h-[180px] object-cover" />

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-lg font-bold text-gray-800 mb-1">
          {poster.title}
          {!poster.isActive && <span className="text-red-500 ml-2.5 text-sm font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">[DELETED]</span>}
        </h4>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{poster.description}</p>

        <div className="flex gap-2.5 mt-auto pt-3 border-t border-gray-100">
          {canEdit && (
            <button className="flex-1 p-2 bg-blue-600 text-white border-none rounded-lg cursor-pointer font-semibold text-sm transition-colors hover:bg-blue-700" onClick={handleEdit}>
              Edit
            </button>
          )}

          {canEdit && (
            <button className="flex-1 p-2 bg-red-500 text-white border-none rounded-lg cursor-pointer font-semibold text-sm transition-colors hover:bg-red-600" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterCard;