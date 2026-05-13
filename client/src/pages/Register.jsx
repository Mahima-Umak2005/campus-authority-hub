import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "principal",
    collegeName: "",
    collegeCode: "",
    collegeAddress: "",
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
    setLoading(true);

    try {
      const { data } = await registerApi(formData);
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="text-center py-5 border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-2 shadow-md">
              <i className="fas fa-user-plus text-white text-xl"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-xs mt-0.5">Join Campus Authority Hub</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-user mr-1 text-gray-400 text-[10px]"></i> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-envelope mr-1 text-gray-400 text-[10px]"></i> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-lock mr-1 text-gray-400 text-[10px]"></i> Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-user-tie mr-1 text-gray-400 text-[10px]"></i> Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="principal">Principal</option>
                  <option value="chairman">College Admin (Chairman)</option>
                </select>
              </div>

              {/* College Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-university mr-1 text-gray-400 text-[10px]"></i> College Name
                </label>
                <input
                  type="text"
                  name="collegeName"
                  placeholder="Bajaj Institute of Technology"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* College Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-qrcode mr-1 text-gray-400 text-[10px]"></i> College Code <span className="text-gray-400 font-normal">(Unique)</span>
                </label>
                <input
                  type="text"
                  name="collegeCode"
                  placeholder="BITW001"
                  value={formData.collegeCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* College Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  <i className="fas fa-location-dot mr-1 text-gray-400 text-[10px]"></i> College Address
                </label>
                <input
                  type="text"
                  name="collegeAddress"
                  placeholder="Wardha, Maharashtra, PIN Code"
                  value={formData.collegeAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </button>

              {/* Messages */}
              {message && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-xs text-center">{message}</p>
                </div>
              )}
              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-500 text-xs text-center">{error}</p>
                </div>
              )}

              {/* Login Link */}
              <p className="text-center text-xs text-gray-600 pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200/70 text-[11px] mt-4">
          <i className="fas fa-shield-alt mr-1"></i> Secure registration for verified authorities
        </p>
      </div>
    </div>
  );
};

export default Register;