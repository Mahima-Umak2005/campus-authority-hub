import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getDepartmentPostersApi } from "../api/posters";

const audienceLabel = (poster) => {
  const audience = poster.targetAudience || [];

  if (audience.includes("hod") && audience.length === 1) return "HODs";
  if (audience.includes("faculty") && audience.includes("student")) {
    return "Faculty + Students";
  }
  if (audience.includes("faculty")) return "Faculty";
  if (audience.includes("student")) return "Students";
  return "All";
};

const metricStyles = {
  blue: "bg-blue-50 text-blue-900 border-blue-100",
  green: "bg-emerald-50 text-emerald-900 border-emerald-100",
  amber: "bg-amber-50 text-amber-900 border-amber-100",
  purple: "bg-purple-50 text-purple-900 border-purple-100",
  red: "bg-red-50 text-red-900 border-red-100",
  slate: "bg-slate-50 text-slate-900 border-slate-100",
  cyan: "bg-cyan-50 text-cyan-900 border-cyan-100",
  gray: "bg-gray-50 text-gray-900 border-gray-100",
};

const MetricTile = ({ label, value, color = "gray" }) => (
  <div className={`rounded-xl border p-5 ${metricStyles[color]}`}>
    <p className="text-sm font-semibold opacity-75">{label}</p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);

const DepartmentAnalytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [posters, setPosters] = useState([]);
  const [audience, setAudience] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        const [statsRes, postersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          getDepartmentPostersApi(token, user?.department),
        ]);

        setStats(statsRes.data);
        setPosters(postersRes.data || []);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const filteredPosters = useMemo(() => {
    if (audience === "all") return posters;
    return posters.filter((poster) => poster.targetAudience?.includes(audience));
  }, [audience, posters]);

  const highPriorityCount = posters.filter(
    (poster) => poster.priority === "high" || poster.isPinned
  ).length;

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <i className="fas fa-chart-line text-2xl text-blue-600"></i>
            <h2 className="text-2xl font-bold text-gray-800">
              Department Analytics
            </h2>
          </div>
          <p className="text-gray-500">
            Department:{" "}
            <span className="font-semibold capitalize text-blue-600">
              {user?.department}
            </span>
          </p>
        </div>

        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Audience</option>
          <option value="hod">HODs</option>
          <option value="faculty">Faculty</option>
          <option value="student">Students</option>
        </select>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading analytics...</span>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricTile label="Students" value={stats?.totalStudents ?? 0} color="blue" />
            <MetricTile label="Faculty" value={stats?.totalFaculty ?? 0} color="green" />
            <MetricTile label="Active Posters" value={stats?.activePosters ?? 0} color="amber" />
            <MetricTile label="Read Marks" value={stats?.readMarks ?? 0} color="purple" />
            <MetricTile label="Department Posters" value={stats?.totalDepartmentPosters ?? 0} color="gray" />
            <MetricTile label="Scheduled" value={stats?.scheduledPosters ?? 0} color="cyan" />
            <MetricTile label="Expired" value={stats?.expiredPosters ?? 0} color="red" />
            <MetricTile label="Important" value={highPriorityCount} color="slate" />
          </div>

          <div className="mb-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Student Notices</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {posters.filter((poster) => poster.targetAudience?.includes("student")).length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Faculty Notices</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {posters.filter((poster) => poster.targetAudience?.includes("faculty")).length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Repository Files</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {stats?.totalFiles ?? 0}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-bold text-gray-800">
                Department-Wise Poster List
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredPosters.length} poster{filteredPosters.length === 1 ? "" : "s"} for the selected audience.
              </p>
            </div>

            {filteredPosters.length === 0 ? (
              <p className="p-5 text-gray-500">No posters found for this filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Poster</th>
                      <th className="px-4 py-3">Audience</th>
                      <th className="px-4 py-3">Departments</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Read Marks</th>
                      <th className="px-4 py-3">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPosters.map((poster) => (
                      <tr key={poster._id}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">
                            {poster.title}
                          </div>
                          <div className="line-clamp-1 text-xs text-gray-500">
                            {poster.description}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {audienceLabel(poster)}
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-600">
                          {(poster.targetDepartments || []).join(", ")}
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-600">
                          {poster.priority}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {poster.readBy?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {poster.expiryDate
                            ? new Date(poster.expiryDate).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default DepartmentAnalytics;
