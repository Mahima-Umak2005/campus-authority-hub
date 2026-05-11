import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ManagePosters = () => {
  const { user } = useAuth();
  const [allPosters, setAllPosters] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const fetchPosters = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/posters/dashboard",
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Posters</h2>

      <div className="flex gap-[15px] my-5 flex-wrap">
        <input
          type="text"
          placeholder="Search posters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2.5 w-[260px] rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2.5 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
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
            <div key={poster._id} className="bg-white p-[15px] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col">
              <img
                src={poster.imageUrl}
                alt={poster.title}
                className="w-full h-[180px] object-cover rounded-[10px] mb-2.5"
              />

              <h3 className="text-lg font-bold text-gray-800 mb-1">{poster.title}</h3>
              <p className="text-gray-600 text-sm mb-2.5 flex-grow">{poster.description}</p>

              <p className="text-sm mb-3">
                <strong className="text-gray-800">Priority:</strong> <span className="capitalize">{poster.priority}</span>
                {!poster.isActive && <span className="text-red-500 ml-2.5 font-bold">[DELETED]</span>}
              </p>

              <div className="flex gap-2.5 mt-auto pt-2">
                {user && (poster.uploadedBy === user._id || user.role === "principal" || user.role === "admin") && (
                  <>
                    <button
                      className="flex-1 p-2.5 bg-blue-600 text-white border-none rounded-lg cursor-pointer font-semibold transition-colors hover:bg-blue-700"
                      onClick={() => handleEdit(poster)}
                    >
                      Edit
                    </button>

                    <button
                      className="flex-1 p-2.5 bg-red-500 text-white border-none rounded-lg cursor-pointer font-semibold transition-colors hover:bg-red-600"
                      onClick={() => handleDelete(poster._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ManagePosters;