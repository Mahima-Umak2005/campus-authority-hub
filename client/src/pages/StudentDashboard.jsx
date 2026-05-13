import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getStudentNoticesApi, markPosterAsReadApi } from "../api/posters";

const formatDate = (value) => {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString();
};

const priorityClasses = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

const NoticeCard = ({ poster, onMarkRead }) => {
  const isPinned = poster.isPinned || poster.priority === "high";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <img
        src={poster.imageUrl}
        alt={poster.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {isPinned && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              Pinned
            </span>
          )}
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
              priorityClasses[poster.priority] || priorityClasses.medium
            }`}
          >
            {poster.priority}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              poster.isRead
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {poster.isRead ? "Read" : "Unread"}
          </span>
        </div>

        <h4 className="mb-2 text-lg font-bold text-gray-800">{poster.title}</h4>
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {poster.description}
        </p>

        <div className="mb-4 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
          <p>
            <i className="fas fa-calendar-alt mr-1 text-gray-400"></i>
            Published: {formatDate(poster.publishDate || poster.createdAt)}
          </p>
          <p>
            <i className="fas fa-hourglass-end mr-1 text-gray-400"></i>
            Expires: {formatDate(poster.expiryDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={poster.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <i className="fas fa-eye"></i>
            View Poster
          </a>

          {!poster.isRead && (
            <button
              type="button"
              onClick={() => onMarkRead(poster._id)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <i className="fas fa-check"></i>
              Mark Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HistoryRow = ({ poster }) => (
  <div className="flex flex-col gap-2 border-b border-gray-100 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
    <div>
      <h4 className="font-semibold text-gray-800">{poster.title}</h4>
      <p className="text-sm text-gray-500">
        {poster.readAt
          ? `Read on ${formatDate(poster.readAt)}`
          : `Expired on ${formatDate(poster.expiryDate)}`}
      </p>
    </div>
    <a
      href={poster.imageUrl}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
    >
      View
    </a>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeNotices, setActiveNotices] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = useMemo(
    () => activeNotices.filter((poster) => !poster.isRead).length,
    [activeNotices]
  );

  const loadDashboard = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const { data } = await getStudentNoticesApi(token);

      setActiveNotices(data.active || []);
      setHistory(data.history || []);
    } catch (err) {
      console.log("Failed to load student dashboard", err);
      setError(err.response?.data?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await markPosterAsReadApi(id, token);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark notice as read");
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <i className="fas fa-user-graduate text-2xl text-blue-600"></i>
          <h2 className="text-2xl font-bold text-gray-800">
            Student Dashboard
          </h2>
        </div>
        <p className="text-gray-500">
          Welcome back,{" "}
          <span className="font-semibold text-blue-600">{user?.name}</span>
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-medium text-gray-500">Department</p>
          <p className="font-bold capitalize text-gray-800">
            {user?.department || "Not assigned"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-medium text-gray-500">Class</p>
          <p className="font-bold text-gray-800">
            {user?.className || "Not assigned"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-medium text-gray-500">Unread Notices</p>
          <p className="font-bold text-gray-800">{unreadCount}</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <i className="fas fa-bullhorn text-xl text-blue-600"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Active Notices
              </h3>
            </div>

            {activeNotices.length === 0 ? (
              <p className="text-gray-500 italic">No active notices available</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {activeNotices.map((poster) => (
                  <NoticeCard
                    key={poster._id}
                    poster={poster}
                    onMarkRead={handleMarkRead}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <i className="fas fa-clock-rotate-left text-lg text-emerald-600"></i>
              <h3 className="text-lg font-semibold text-gray-800">
                Notice History
              </h3>
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-gray-500">No notice history yet.</p>
            ) : (
              history.map((poster) => (
                <HistoryRow key={`${poster._id}-${poster.readAt || "expired"}`} poster={poster} />
              ))
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default StudentDashboard;
