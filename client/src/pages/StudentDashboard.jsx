import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import PosterList from "../components/PosterList";
import { getActivePostersApi } from "../api/posters";
import { getDashboardFiles } from "../api/repository";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [posters, setPosters] = useState([]);
  const [repoFiles, setRepoFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const [{ data }, files] = await Promise.all([
          getActivePostersApi("student", user?.department || "all", token),
          getDashboardFiles("student", user?.department || "all", token),
        ]);

        setPosters(
          (data || []).filter(
            (poster) =>
              poster.targetDepartments?.includes("all") ||
              poster.targetDepartments?.includes(user?.department)
          )
        );
        setRepoFiles(files || []);
      } catch (error) {
        console.log("Failed to load student dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboard();
    }
  }, [user]);

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

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <i className="fas fa-images text-xl text-blue-600"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Department Posters
              </h3>
            </div>
            <PosterList posters={posters} showActions={false} />
          </div>

          <div className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <i className="fas fa-folder-open text-xl text-emerald-600"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Repository Files
              </h3>
            </div>

            {repoFiles.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 py-8 text-center">
                <i className="fas fa-folder-open mb-2 text-4xl text-gray-300"></i>
                <p className="text-gray-500">
                  No files available for your department.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {repoFiles.map((file) => (
                  <div
                    key={file._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="p-5">
                      <h4 className="mb-2 font-semibold text-gray-800">
                        {file.title}
                      </h4>
                      <p className="mb-1 text-sm text-gray-500">
                        {file.category} / {file.subCategory}
                      </p>
                      <p className="mb-4 text-sm capitalize text-gray-500">
                        {file.department}
                      </p>
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
        </>
      )}
    </Layout>
  );
};

export default StudentDashboard;
