import axios from "axios";
import { useAuth } from "../context/AuthContext";

const getPosterStatus = (poster) => {
  const now = new Date();
  const publishDate = poster.publishDate ? new Date(poster.publishDate) : null;
  const expiryDate = poster.expiryDate ? new Date(poster.expiryDate) : null;

  if (poster.isActive === false) return "deleted";
  if (publishDate && publishDate > now) return "scheduled";
  if (expiryDate && expiryDate < now) return "expired";
  return "active";
};

const getDaysUntilExpiry = (poster) => {
  if (!poster.expiryDate) return null;

  const diff = new Date(poster.expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const statusClasses = {
  active: "bg-green-50 text-green-700 border-green-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  deleted: "bg-red-50 text-red-700 border-red-200",
};

const PosterCard = ({ poster, onDelete, onEdit, showActions = true }) => {
  const { user } = useAuth();
  const status = getPosterStatus(poster);
  const daysUntilExpiry = getDaysUntilExpiry(poster);

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
        </h4>
        <div className="mb-2 flex flex-wrap gap-2">
          <span className={`rounded border px-2 py-0.5 text-xs font-bold capitalize ${statusClasses[status]}`}>
            {status}
          </span>
          {status === "active" && daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry >= 0 && (
            <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
              Expires in {daysUntilExpiry} day{daysUntilExpiry === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{poster.description}</p>

        {showActions && canEdit && (
          <div className="flex gap-2.5 mt-auto pt-3 border-t border-gray-100">
            <button className="flex-1 p-2 bg-blue-600 text-white border-none rounded-lg cursor-pointer font-semibold text-sm transition-colors hover:bg-blue-700" onClick={handleEdit}>
              Edit
            </button>

            <button className="flex-1 p-2 bg-red-500 text-white border-none rounded-lg cursor-pointer font-semibold text-sm transition-colors hover:bg-red-600" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterCard;
