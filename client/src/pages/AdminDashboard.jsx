import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { registerApi } from "../api/auth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "hod",
    department: "computer",
  });
  const [userMsg, setUserMsg] = useState("");
  const [userErr, setUserErr] = useState("");

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg("");
    setUserErr("");
    try {
      await registerApi(newUser);
      setUserMsg("User created successfully!");
      setNewUser({ name: "", email: "", password: "", role: "hod", department: "computer" });
    } catch (err) {
      setUserErr(err?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-[30px] flex-wrap gap-[15px]">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-base mt-[5px]">
            Welcome back, <strong className="text-blue-600">{user?.name}</strong>. Managing administrative tasks.
          </p>
        </div>
      </div>

      <div className="mt-10 p-6 bg-white border border-gray-200 rounded-xl max-w-[500px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">Create Department User (HOD / Faculty)</h3>
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleUserChange} required className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleUserChange} required className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleUserChange} required className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          <select name="role" value={newUser.role} onChange={handleUserChange} className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors">
            <option value="hod">HOD</option>
            <option value="faculty">Faculty</option>
          </select>
          <select name="department" value={newUser.department} onChange={handleUserChange} className="p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors">
            <option value="computer">Computer</option>
            <option value="electrical">Electrical</option>
            <option value="mechanical">Mechanical</option>
            <option value="civil">Civil</option>
          </select>
          <button type="submit" className="p-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer font-bold transition-colors hover:bg-blue-700 mt-2">Create User</button>
        </form>
        {userMsg && <p className="text-green-600 mt-4 font-medium p-2.5 bg-green-50 rounded-lg border border-green-200">{userMsg}</p>}
        {userErr && <p className="text-red-500 mt-4 font-medium p-2.5 bg-red-50 rounded-lg border border-red-200">{userErr}</p>}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
