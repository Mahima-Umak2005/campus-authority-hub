import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "faculty"
      ? "/faculty-dashboard"
      : user?.role === "hod"
      ? "/hod-dashboard"
      : "/principal-dashboard";

  return (
    <div className="w-[250px] min-h-screen bg-slate-900 text-white p-5 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-[22px] mb-2.5 leading-snug font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Campus Authority Hub</h2>
      <p className="text-slate-400 mb-[25px] capitalize font-medium text-sm">{user?.role}</p>

      <nav className="flex flex-col gap-3">
        <Link to={dashboardPath} className="no-underline text-slate-200 p-3 rounded-lg bg-slate-800 transition-all hover:bg-slate-700 hover:text-white font-medium">
          Dashboard
        </Link>

        <Link to="/repository" className="no-underline text-slate-200 p-3 rounded-lg bg-slate-800 transition-all hover:bg-slate-700 hover:text-white font-medium">
          Repository
        </Link>

        <Link to="/repository/upload" className="no-underline text-slate-200 p-3 rounded-lg bg-slate-800 transition-all hover:bg-slate-700 hover:text-white font-medium">
          Upload File
        </Link>

        <Link to="/posters/new" className="no-underline text-slate-200 p-3 rounded-lg bg-slate-800 transition-all hover:bg-slate-700 hover:text-white font-medium">
          Upload Poster
        </Link>

        <Link to="/manage-posters" className="no-underline text-slate-200 p-3 rounded-lg bg-slate-800 transition-all hover:bg-slate-700 hover:text-white font-medium">
          Manage Posters
        </Link>

        <Link to="/profile" className="no-underline text-slate-200 p-3 rounded-lg bg-slate-800 transition-all hover:bg-slate-700 hover:text-white font-medium">
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;