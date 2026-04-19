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
    <div style={styles.box}>
      <h2>Repository Updates</h2>

      {files.length === 0 ? (
        <p>No files available</p>
      ) : (
        files.map((file) => (
          <div key={file._id} style={styles.card}>
            <h4>{file.title}</h4>
            <p>{file.subCategory}</p>
            <small>{file.department}</small>
            <br />

            <a
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open File
            </a>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  card: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
};

export default RepositoryWidget;