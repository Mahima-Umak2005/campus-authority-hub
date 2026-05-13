import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import PosterList from "../components/PosterList";
import { getActivePostersApi } from "../api/posters";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await getActivePostersApi(
          "student",
          user?.department || "all",
          token
        );

        setPosters(data || []);
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

        </>
      )}
    </Layout>
  );
};

export default StudentDashboard;
