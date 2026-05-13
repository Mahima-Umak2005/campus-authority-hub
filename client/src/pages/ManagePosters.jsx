import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/posters";
const PRIORITIES = ["high", "medium", "low"];

const ManagePosters = () => {
  const { user } = useAuth();
  const [allPosters, setAllPosters] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchPosters = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/dashboard`, getAuthHeaders());
      setAllPosters(res.data || []);
      setPosters(res.data || []);
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
    const searchText = search.trim().toLowerCase();

    let filtered = [...allPosters];

    if (searchText) {
      filtered = filtered.filter((item) =>
        (item.title || "").toLowerCase().includes(searchText)
      );
    }

    if (priority !== "all") {
      filtered = filtered.filter((item) => item.priority === priority);
    }

    setPosters(filtered);
  }, [search, priority, allPosters]);

  const canManagePoster = (poster) => {
    if (!user) return false;

    const uploadedBy =
      typeof poster.uploadedBy === "object"
        ? poster.uploadedBy?._id
        : poster.uploadedBy;

    const isDepartmentPoster =
      user.role === "hod" &&
      user.department &&
      user.department !== "all" &&
      poster.targetDepartments?.includes(user.department);

    return (
      uploadedBy === user._id ||
      user.role === "principal" ||
      user.role === "admin" ||
      user.role === "chairman" ||
      isDepartmentPoster
    );
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this poster?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      setAllPosters((current) => current.filter((item) => item._id !== id));
      alert("Poster deleted successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = async (poster) => {
    const newTitle = prompt("Enter new title", poster.title);
    if (!newTitle) return;

    const newDescription = prompt("Enter new description", poster.description);
    if (!newDescription) return;

    const newPriority = prompt(
      "Enter priority: high / medium / low",
      poster.priority
    );
    if (!newPriority) return;

    const priorityValue = newPriority.toLowerCase();

    if (!PRIORITIES.includes(priorityValue)) {
      alert("Invalid priority");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/${poster._id}`,
        {
          title: newTitle,
          description: newDescription,
          priority: priorityValue,
        },
        getAuthHeaders()
      );

      alert("Poster updated successfully");
      fetchPosters();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <Layout>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Manage Posters</h2>

      <div className="my-5 flex flex-wrap gap-[15px]">
        <input
          type="text"
          placeholder="Search posters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[260px] rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Loading posters...</p>
      ) : posters.length === 0 ? (
        <p className="text-gray-500">No posters found</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {posters.map((poster) => (
            <div
              key={poster._id}
              className="flex flex-col rounded-xl bg-white p-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              <img
                src={poster.imageUrl}
                alt={poster.title || "Poster"}
                className="mb-2.5 h-[180px] w-full rounded-[10px] object-cover"
              />

              <h3 className="mb-1 text-lg font-bold text-gray-800">
                {poster.title}
              </h3>
              <p className="mb-2.5 flex-grow text-sm text-gray-600">
                {poster.description}
              </p>

              <p className="mb-3 text-sm">
                <strong className="text-gray-800">Priority:</strong>{" "}
                <span className="capitalize">{poster.priority}</span>
                {!poster.isActive && (
                  <span className="ml-2.5 font-bold text-red-500">
                    [DELETED]
                  </span>
                )}
              </p>

              {canManagePoster(poster) && (
                <div className="mt-auto flex gap-2.5 pt-2">
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-lg border-none bg-blue-600 p-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                    onClick={() => handleEdit(poster)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-lg border-none bg-red-500 p-2.5 font-semibold text-white transition-colors hover:bg-red-600"
                    onClick={() => handleDelete(poster._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ManagePosters;
