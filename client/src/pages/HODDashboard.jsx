import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import PosterList from "../components/PosterList";
import { getActivePostersApi } from "../api/posters";
import { getDashboardFiles } from "../api/repository";

const HODDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posters, setPosters] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const posterData = await getActivePostersApi(
          "hod",
          user?.department || "all",
          token
        );

        setPosters(posterData.data);

        const repoData = await getDashboardFiles(
          "hod",
          user?.department || "all"
        );

        setFiles(repoData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">HOD Dashboard</h2>
      <p className="text-gray-500 mb-8">Welcome, <strong className="text-blue-600">{user?.name}</strong></p>

      <h3 className="mt-[30px] text-xl font-semibold text-gray-800 mb-4">Repository Updates</h3>

      <div className="grid gap-4">
      {files.length === 0 ? (
        <p className="text-gray-500 italic">No repository files</p>
      ) : (
        files.map((file) => (
          <div key={file._id} className="bg-white p-[15px] rounded-[10px] shadow-[0_2px_6px_rgba(0,0,0,0.08)] border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-1">{file.title}</h4>
            <p className="text-sm text-gray-600 mb-1">{file.subCategory}</p>
            <small className="text-xs text-gray-500">
              {file.department} |{" "}
              {new Date(file.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))
      )}
      </div>

      <h3 className="mt-[40px] text-xl font-semibold text-gray-800 mb-4">Posters</h3>

      {loading ? <p className="text-gray-500 italic">Loading...</p> : <PosterList posters={posters} />}
    </Layout>
  );
};

export default HODDashboard;