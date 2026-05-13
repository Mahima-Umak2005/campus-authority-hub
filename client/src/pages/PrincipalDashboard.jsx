import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import PosterList from "../components/PosterList";
import axios from "axios";
import { getDashboardPostersApi } from "../api/posters";
import { registerApi } from "../api/auth";
import { getDashboardFiles } from "../api/repository";

const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [posters, setPosters] = useState([]);
  const [repoFiles, setRepoFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [posterLoading, setPosterLoading] = useState(true);
  const [repoLoading, setRepoLoading] = useState(true);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "computer",
  });

  const [userMsg, setUserMsg] = useState("");
  const [userErr, setUserErr] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg("");
    setUserErr("");
    setCreatingUser(true);

    try {
      await registerApi(newUser);
      setUserMsg("User created successfully!");
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "faculty",
        department: "computer",
      });
      setTimeout(() => setUserMsg(""), 3000);
    } catch (err) {
      setUserErr(err.response?.data?.message || "Failed to create user");
      setTimeout(() => setUserErr(""), 3000);
    } finally {
      setCreatingUser(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        setStatsError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await getDashboardPostersApi(token);
        const now = new Date();
        setPosters(
          (data || []).filter(
            (poster) =>
              poster.isActive !== false && new Date(poster.expiryDate) >= now
          )
        );
      } catch (err) {
        console.log(err);
      } finally {
        setPosterLoading(false);
      }
    };

    const fetchRepoFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const repoData = await getDashboardFiles(
          user?.role,
          user?.department,
          token
        );
        setRepoFiles(repoData || []);
      } catch (err) {
        console.log(err);
      } finally {
        setRepoLoading(false);
      }
    };

    fetchStats();
    fetchPosters();
    if (user) {
      fetchRepoFiles();
    }
  }, [user]);

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <i className="fas fa-chalkboard-user text-2xl text-blue-600"></i>
          <h2 className="text-2xl font-bold text-gray-800">Principal Dashboard</h2>
        </div>
        <p className="text-gray-500">
          Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>
        </p>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <i className="fas fa-spinner fa-spin text-blue-500 text-2xl mr-2"></i>
          <span className="text-gray-500">Loading dashboard data...</span>
        </div>
      )}
      {statsError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <i className="fas fa-exclamation-circle text-red-500"></i>
          <p className="text-red-600 text-sm">{statsError}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <i className="fas fa-exclamation-triangle text-red-500"></i>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Users"
            value={stats.totalUsers ?? 0}
            color="#2563eb"
            icon="users"
          />
          <StatCard
            title="Total Files"
            value={stats.totalFiles ?? 0}
            color="#16a34a"
            icon="file-alt"
          />
          <StatCard
            title="Active Posters"
            value={stats.activePosters ?? 0}
            color="#f59e0b"
            icon="newspaper"
          />
          <StatCard
            title="Departments"
            value={stats.departments ?? 0}
            color="#dc2626"
            icon="building"
          />
        </div>
      )}

      {/* Posters Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <i className="fas fa-images text-xl text-blue-600"></i>
          <h3 className="text-xl font-semibold text-gray-800">Uploaded Posters</h3>
        </div>
        {posterLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading posters...</span>
          </div>
        ) : (
          <PosterList posters={posters} showActions={false} />
        )}
      </div>

      {/* Repository Files Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <i className="fas fa-folder-open text-xl text-emerald-600"></i>
          <h3 className="text-xl font-semibold text-gray-800">Repository Files</h3>
        </div>
        {repoLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading repository files...</span>
          </div>
        ) : repoFiles.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
            <i className="fas fa-folder-open text-4xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No files available in repository.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {repoFiles.map((file) => (
              <div
                key={file._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <i className="fas fa-file-pdf text-blue-600 text-lg"></i>
                      </div>
                      <h4 className="font-semibold text-gray-800 line-clamp-1">
                        {file.title}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <i className="fas fa-tag text-xs text-gray-400"></i>
                      {file.category} / {file.subCategory}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <i className="fas fa-building text-xs text-gray-400"></i>
                      {file.department}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <i className="fas fa-calendar-alt text-xs text-gray-400"></i>
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    <i className="fas fa-download text-sm"></i>
                    View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create User Section (Chairman Only) */}
      {user?.role === "chairman" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-2xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <i className="fas fa-user-plus text-blue-600 text-lg"></i>
              <h3 className="text-lg font-semibold text-gray-800">Create Department User</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Add faculty, HOD, or admin staff members</p>
          </div>

          <form onSubmit={handleCreateUser} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-user mr-1 text-gray-400"></i> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={handleUserChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-envelope mr-1 text-gray-400"></i> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="user@college.edu"
                  value={newUser.email}
                  onChange={handleUserChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-lock mr-1 text-gray-400"></i> Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={handleUserChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-user-tie mr-1 text-gray-400"></i> Role
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                  <option value="admin">Admin Staff</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-building mr-1 text-gray-400"></i> Department
                </label>
                <select
                  name="department"
                  value={newUser.department}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="computer">Computer Science</option>
                  <option value="electrical">Electrical Engineering</option>
                  <option value="mechanical">Mechanical Engineering</option>
                  <option value="civil">Civil Engineering</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={creatingUser}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {creatingUser ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Create User
                </>
              )}
            </button>

            {userMsg && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i>
                <p className="text-green-600 text-sm">{userMsg}</p>
              </div>
            )}
            {userErr && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                <p className="text-red-600 text-sm">{userErr}</p>
              </div>
            )}
          </form>
        </div>
      )}
    </Layout>
  );
};

export default PrincipalDashboard;
