import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import PosterList from "../components/PosterList";
import UploadCSVForm from "../components/UploadCSVForm";
import { getActivePostersApi } from "../api/posters";
import { getDashboardFiles } from "../api/repository";

const HODDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [posters, setPosters] = useState([]);
  const [repoFiles, setRepoFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [posterLoading, setPosterLoading] = useState(true);
  const [repoLoading, setRepoLoading] = useState(true);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

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
        console.log(err);
        setStatsError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await getActivePostersApi(
          user?.role,
          user?.department,
          token
        );
        setPosters((data || []).filter((poster) => poster.isActive !== false));
      } catch (err) {
        console.log(err);
        setError("Failed to load posters");
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

    if (user) {
      fetchStats();
      fetchPosters();
      fetchRepoFiles();
    }
  }, [user]);

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <i className="fas fa-chalkboard-user text-2xl text-blue-600"></i>
          <h2 className="text-2xl font-bold text-gray-800">HOD Dashboard</h2>
        </div>
        <p className="text-gray-500">
          Welcome back,{" "}
          <span className="font-semibold text-blue-600">{user?.name}</span>
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <i className="fas fa-spinner fa-spin mr-2 text-2xl text-blue-500"></i>
          <span className="text-gray-500">Loading dashboard data...</span>
        </div>
      )}

      {statsError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <i className="fas fa-exclamation-circle text-red-500"></i>
          <p className="text-sm text-red-600">{statsError}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <i className="fas fa-exclamation-triangle text-red-500"></i>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {stats && (
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <i className="fas fa-images text-xl text-blue-600"></i>
          <h3 className="text-xl font-semibold text-gray-800">
            Uploaded Posters
          </h3>
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

      <div className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <i className="fas fa-users text-xl text-purple-600"></i>
          <h3 className="text-xl font-semibold text-gray-800">
            Bulk Upload Students
          </h3>
        </div>
        <UploadCSVForm />
      </div>

      <div className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <i className="fas fa-folder-open text-xl text-emerald-600"></i>
          <h3 className="text-xl font-semibold text-gray-800">
            Repository Files
          </h3>
        </div>

        {repoLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading repository files...</span>
          </div>
        ) : repoFiles.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 py-8 text-center">
            <i className="fas fa-folder-open mb-2 text-4xl text-gray-300"></i>
            <p className="text-gray-500">No files available in repository.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {repoFiles.map((file) => (
              <div
                key={file._id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <i className="fas fa-file-pdf text-lg text-blue-600"></i>
                      </div>
                      <h4 className="line-clamp-1 font-semibold text-gray-800">
                        {file.title}
                      </h4>
                    </div>
                  </div>
                  <div className="mb-4 space-y-2">
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <i className="fas fa-tag text-xs text-gray-400"></i>
                      {file.category} / {file.subCategory}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <i className="fas fa-building text-xs text-gray-400"></i>
                      {file.department}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <i className="fas fa-calendar-alt text-xs text-gray-400"></i>
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
    </Layout>
  );
};

export default HODDashboard;
