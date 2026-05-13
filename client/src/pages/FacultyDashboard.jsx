import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getDashboardFiles } from "../api/repository";
import { getActivePostersApi, getDashboardPostersApi } from "../api/posters";
import PosterList from "../components/PosterList";

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

const FacultyDashboard = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        const [visibleRes, ownRes, repoFiles] = await Promise.all([
          getActivePostersApi("faculty", user?.department || "all", token),
          getDashboardPostersApi(token),
          getDashboardFiles("faculty", user?.department || "all"),
        ]);

        const mergedPosters = [
          ...(visibleRes.data || []),
          ...(ownRes.data || []),
        ]
          .filter(isCurrentlyVisible)
          .filter(
            (poster, index, current) =>
              current.findIndex((item) => item._id === poster._id) === index
          );

        setPosters(mergedPosters);
        setFiles(repoFiles || []);
      } catch (err) {
        console.log("Failed to load faculty dashboard", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) loadDashboard();
  }, [user]);

  return (
    <Layout>
      <section className="mb-8 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 p-7 text-white shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-100">
          {user?.department || "Department"} Faculty
        </p>
        <h2 className="mb-2 text-3xl font-bold">Faculty Dashboard</h2>
        <p className="max-w-2xl text-emerald-100">
          Welcome, {user?.name}. Review department notices, upload resources, and publish student-facing posters from one workspace.
        </p>
      </section>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Department</p>
          <p className="mt-2 text-2xl font-bold capitalize text-gray-800">
            {user?.department || "Not assigned"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Visible Posters</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{posters.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Repository Files</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{files.length}</p>
        </div>
      </div>

      <div className="mb-10 grid gap-5 md:grid-cols-3">
        <QuickAction
          to="/repository/upload"
          icon="fas fa-file-arrow-up"
          title="Upload File"
          text="Add notes, circulars, assignments, or department resources."
          color="bg-emerald-50 text-emerald-700"
        />
        <QuickAction
          to="/posters/new"
          icon="fas fa-bullhorn"
          title="Upload Poster"
          text="Publish notices for students in your department."
          color="bg-blue-50 text-blue-700"
        />
        <QuickAction
          to="/manage-posters"
          icon="fas fa-pen-to-square"
          title="Manage Posters"
          text="Edit, schedule, or remove posters uploaded by you."
          color="bg-amber-50 text-amber-700"
        />
      </div>

      <section className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <i className="fas fa-images text-xl text-blue-600"></i>
          <h3 className="text-xl font-semibold text-gray-800">
            Department Posters
          </h3>
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Loading posters...</p>
        ) : (
          <PosterList posters={posters} showActions={false} />
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <i className="fas fa-folder-open text-xl text-emerald-600"></i>
            <h3 className="text-xl font-semibold text-gray-800">
              Repository Files
            </h3>
          </div>
          <Link to="/repository" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View repository
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Loading files...</p>
        ) : files.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 py-8 text-center">
            <i className="fas fa-folder-open mb-2 text-4xl text-gray-300"></i>
            <p className="text-gray-500">No repository files available.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <a
                key={file._id}
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <i className="fas fa-file-pdf text-blue-600"></i>
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">{file.title}</h4>
                <p className="mb-2 text-sm capitalize text-gray-500">
                  {file.category} / {file.subCategory}
                </p>
                <small className="text-xs text-gray-400">
                  {new Date(file.createdAt).toLocaleDateString()}
                </small>
              </a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default FacultyDashboard;
