import { useEffect, useState } from "react";
import { getDashboardFiles } from "../api/repository";
import { useAuth } from "../context/AuthContext";

const RepositoryWidget = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  const loadFiles = async () => {
    try {
      const res = await getDashboardFiles(
        user.role,
        user.department
      );

      setFiles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl mt-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Repository Updates</h2>

      {files.length === 0 ? (
        <p className="text-gray-500 italic">No files available</p>
      ) : (
        files.map((file) => (
          <div key={file._id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">{file.title}</h4>
            <p className="text-sm text-gray-600 mb-0.5">{file.subCategory}</p>
            <small className="text-xs text-gray-400 uppercase tracking-wider font-medium">{file.department}</small>
            <br />

            <a
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Open File
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default RepositoryWidget;