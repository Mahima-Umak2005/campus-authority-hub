import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const getDashboardPath = (role) => {
  if (role === "principal" || role === "chairman") return "/principal-dashboard";
  if (role === "hod") return "/hod-dashboard";
  if (role === "admin") return "/admin-dashboard";
  if (role === "student") return "/student-dashboard";
  return "/faculty-dashboard";
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await changePasswordApi(
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        token
      );

      login(data.token, data);
      setMessage("Password changed successfully");
      setTimeout(() => navigate(getDashboardPath(data.role), { replace: true }), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <i className="fas fa-key text-xl text-blue-600"></i>
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          </div>
          <p className="text-sm text-gray-500">
            {user?.forcePasswordChange
              ? "Please change your default password before using the dashboard."
              : "Update your account password."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!user?.forcePasswordChange && (
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          )}

          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
