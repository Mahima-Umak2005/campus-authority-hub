import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import PosterList from "../components/PosterList";
import UploadCSVForm from "../components/UploadCSVForm";
import { getDepartmentPostersApi } from "../api/posters";
import { getDashboardFiles } from "../api/repository";

const isCurrentlyVisible = (poster) => {
  const now = new Date();
  const publishDate = poster.publishDate ? new Date(poster.publishDate) : null;
  const expiryDate = poster.expiryDate ? new Date(poster.expiryDate) : null;

  return (
    poster.isActive !== false &&
    (!publishDate || publishDate <= now) &&
    (!expiryDate || expiryDate >= now)
  );
};

const QuickAction = ({ to, icon, title, text, color }) => (
  <Link
    to={to}
    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
  >
    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
      <i className={`${icon} text-lg`}></i>
    </div>
    <h3 className="mb-1 font-bold text-gray-800">{title}</h3>
    <p className="text-sm leading-6 text-gray-500">{text}</p>
  </Link>
);

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
        const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const { data } = await getDepartmentPostersApi(token, user?.department);
        setPosters((data || []).filter(isCurrentlyVisible).slice(0, 4));
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
        const repoData = await getDashboardFiles(user?.role, user?.department, token);
        setRepoFiles((repoData || []).slice(0, 3));
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
      <section className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-7 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-100">
              {user?.department || "Department"} Department
            </p>
            <h2 className="mb-2 text-3xl font-bold">HOD Dashboard</h2>
            <p className="max-w-2xl text-blue-100">
              Welcome back, {user?.name}. Manage students, notices, files, and department communication from one focused workspace.
            </p>
          </div>

          <Link
            to="/department-analytics"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50"
          >
            <i className="fas fa-chart-line"></i>
            Department Analytics
          </Link>
        </div>
      </section>

      {loading && (
        <div className="mb-5 flex items-center gap-2 text-gray-500">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading dashboard data...</span>
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
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Students" value={stats.totalStudents ?? 0} color="#2563eb" />
          <StatCard title="Faculty" value={stats.totalFaculty ?? 0} color="#16a34a" />
          <StatCard title="Active Posters" value={stats.activePosters ?? 0} color="#f59e0b" />
          <StatCard title="Repository Files" value={stats.totalFiles ?? 0} color="#7c3aed" />
        </div>
      )}

      <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          to="/manage-students"
          icon="fas fa-user-graduate"
          title="Manage Students"
          text="Edit student details, reset passwords, and review department students."
          color="bg-blue-50 text-blue-700"
        />
        <QuickAction
          to="/posters/new"
          icon="fas fa-bullhorn"
          title="Upload Poster"
          text="Publish targeted notices for faculty and students in your department."
          color="bg-amber-50 text-amber-700"
        />
        <QuickAction
          to="/manage-posters"
          icon="fas fa-pen-to-square"
          title="Manage Posters"
          text="Edit, schedule, or remove posters uploaded by you."
          color="bg-emerald-50 text-emerald-700"
        />
        <QuickAction
          to="/department-analytics"
          icon="fas fa-chart-pie"
          title="Analytics"
          text="View department activity, poster status, and notice engagement."
          color="bg-purple-50 text-purple-700"
        />
      </div>

      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <i className="fas fa-images text-xl text-blue-600"></i>
            <h3 className="text-xl font-semibold text-gray-800">Latest Department Posters</h3>
          </div>
          <Link to="/department-analytics" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        {posterLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading posters...</span>
          </div>
        ) : (
          <PosterList posters={posters} showActions={false} />
        )}
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="mb-5 flex items-center gap-2">
            <i className="fas fa-users text-xl text-purple-600"></i>
            <h3 className="text-xl font-semibold text-gray-800">Bulk Upload Students</h3>
          </div>
          <UploadCSVForm />
        </div>

        <div>
          <div className="mb-5 flex items-center gap-2">
            <i className="fas fa-folder-open text-xl text-emerald-600"></i>
            <h3 className="text-xl font-semibold text-gray-800">Recent Repository Files</h3>
          </div>

          {repoLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading files...</span>
            </div>
          ) : repoFiles.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <i className="fas fa-folder-open mb-2 text-3xl text-gray-300"></i>
              <p className="text-sm text-gray-500">No files available.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {repoFiles.map((file) => (
                <a
                  key={file._id}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">{file.title}</p>
                  <p className="mt-1 text-sm capitalize text-gray-500">
                    {file.category} / {file.subCategory}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HODDashboard;
