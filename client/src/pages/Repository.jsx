import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Repository = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setFiles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) => {
    const matchSearch = file.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDept =
      department === "all" || file.department === department;

    const matchCategory =
      category === "all" || file.category === category;

    return matchSearch && matchDept && matchCategory;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-5 max-w-[1200px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Centralized Repository</h1>

          {/* Filters */}
          <div className="flex gap-2.5 mb-5 flex-wrap">
            <input
              type="text"
              placeholder="Search file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2.5 w-[250px] border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Departments</option>
              <option value="computer">Computer</option>
              <option value="civil">Civil</option>
              <option value="mechanical">Mechanical</option>
              <option value="electrical">Electrical</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="quality">Quality</option>
              <option value="activities">Activities</option>
              <option value="administration">Administration</option>
              <option value="confidential">Confidential</option>
            </select>
          </div>

          {/* File Cards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[15px]">
            {filteredFiles.map((file) => (
              <div key={file._id} className="bg-white border border-gray-200 rounded-xl p-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{file.title}</h3>
                <p className="text-sm text-gray-600 mb-1"><b className="font-semibold text-gray-800">Department:</b> {file.department}</p>
                <p className="text-sm text-gray-600 mb-1"><b className="font-semibold text-gray-800">Category:</b> {file.category}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <b className="font-semibold text-gray-800">Date:</b>{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2.5 mt-auto pt-2">
                  {/* View File */}
                  <a
                    href={`http://localhost:5000/api/files/download/${file._id}`}
                    className="inline-block px-[14px] py-2 bg-blue-600 text-white rounded-lg no-underline font-medium hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <p className="mt-5 text-gray-500 italic">No files found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repository;