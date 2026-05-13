import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-[70px] bg-white flex justify-between items-center px-[25px] border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div>
        <h3 className="m-0 text-xl font-bold text-gray-800 tracking-tight">Campus Authority Hub</h3>
        <small className="text-gray-500 font-medium text-sm mt-1 block">Welcome, <span className="text-blue-600">{user?.name}</span></small>
      </div>

      <button onClick={handleLogout} className="px-4 py-2.5 border-none rounded-lg bg-red-500 text-white cursor-pointer font-bold transition-colors hover:bg-red-600 shadow-sm hover:shadow">
        Logout
      </button>
    </div>
  );
};

export default Navbar;