import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getDashboardFiles } from "../api/repository";

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      const data = await getDashboardFiles(
        "faculty",
        user?.department || "all"
      );
      setFiles(data);
    };

    if (user) loadFiles();
  }, [user]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Faculty Dashboard</h2>
      <p className="text-gray-500 mb-6">Welcome, <strong className="text-blue-600">{user?.name}</strong></p>

      <button
        className="px-[15px] py-[10px] bg-green-600 text-white border-none rounded-lg cursor-pointer font-semibold transition-colors hover:bg-green-700"
        onClick={() => navigate("/upload-repository")}
      >
        Upload Repository File
      </button>

      <h3 className="mt-[25px] text-xl font-semibold text-gray-800 mb-4">Repository Files</h3>

      <div className="grid gap-4">
      {files.map((file) => (
        <div key={file._id} className="bg-white p-[15px] rounded-[10px] shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-1">{file.title}</h4>
          <p className="text-sm text-gray-600 mb-1">{file.subCategory}</p>
          <small className="text-xs text-gray-500">
            {new Date(file.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
      </div>
    </Layout>
  );
};

export default FacultyDashboard;