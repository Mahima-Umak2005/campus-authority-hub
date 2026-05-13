import { useEffect, useState } from "react";
import { getActivePostersApi } from "../api/posters";
import { Link } from "react-router-dom";

const DisplayScreen = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch all active posters
        const { data } = await getActivePostersApi("", "", token);
        setPosters(data);
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  // Categorize posters
  const collegeNotices = posters.filter(poster => 
    poster.targetDepartments.includes("all")
  );

  const departmentNotices = posters.filter(poster => 
    !poster.targetDepartments.includes("all")
  );

  // Group department notices by their first target department
  const deptGroups = {};
  departmentNotices.forEach(poster => {
    const mainDept = poster.targetDepartments[0] || "General";
    if (!deptGroups[mainDept]) {
      deptGroups[mainDept] = [];
    }
    deptGroups[mainDept].push(poster);
  });

  const renderNoticeCard = (poster) => (
    <div key={poster._id} className="bg-white rounded-xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
      <h3 className="text-lg text-gray-900 m-0 mb-2.5 font-semibold">{poster.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-grow">
        {poster.description.length > 80 
          ? poster.description.substring(0, 80) + "..." 
          : poster.description}
      </p>
      <a 
        href={poster.imageUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block text-blue-600 no-underline font-semibold text-sm mt-auto hover:text-blue-800 transition-colors"
      >
        View Poster ➔
      </a>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl text-gray-600 bg-gray-50">Loading Notices...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="h-[75px] bg-white flex justify-between items-center px-[50px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
        <h2 className="text-blue-700 m-0 text-2xl font-bold">Campus Authority Hub</h2>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-blue-700 font-bold hover:text-blue-800 transition-colors">Login</Link>
          <Link to="/register" className="bg-blue-700 text-white px-[18px] py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg">Register</Link>
        </div>
      </header>

      <div className="p-10 max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-blue-900 text-4xl inline-block pb-2.5 border-b-[3px] border-blue-600 font-bold">Campus Notice Board</h1>
        </div>
      
      <div className="mb-[50px]">
        <h2 className="text-gray-700 text-2xl mb-5 flex items-center gap-2.5 font-bold">🏫 College Notices</h2>
        {collegeNotices.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {collegeNotices.map(renderNoticeCard)}
          </div>
        ) : (
          <p className="text-gray-400 italic">No active college notices.</p>
        )}
      </div>

      {Object.keys(deptGroups).map(dept => (
        <div key={dept} className="mb-[50px]">
          <h2 className="text-gray-700 text-2xl mb-5 flex items-center gap-2.5 font-bold">
            🏛️ {dept.charAt(0).toUpperCase() + dept.slice(1)} Department Notices
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {deptGroups[dept].map(renderNoticeCard)}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default DisplayScreen;