import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const formatValue = (value) => {
  if (!value) return "Not provided";
  return value;
};

const formatRole = (role) => {
  if (!role) return "Not provided";
  return role.replace("-", " ");
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <i className="fas fa-user-circle text-2xl text-blue-600"></i>
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        </div>
        <p className="text-gray-500">View your account information</p>
      </div>

      <div className="max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold uppercase text-white">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {formatValue(user?.name)}
              </h3>
              <p className="capitalize text-gray-500">{formatRole(user?.role)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-1 text-sm font-medium text-gray-500">Full Name</p>
            <p className="font-semibold text-gray-800">{formatValue(user?.name)}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-1 text-sm font-medium text-gray-500">Email</p>
            <p className="break-words font-semibold text-gray-800">
              {formatValue(user?.email)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-1 text-sm font-medium text-gray-500">Role</p>
            <p className="font-semibold capitalize text-gray-800">
              {formatRole(user?.role)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-1 text-sm font-medium text-gray-500">Department</p>
            <p className="font-semibold capitalize text-gray-800">
              {formatValue(user?.department)}
            </p>
          </div>

          {user?.collegeName && (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="mb-1 text-sm font-medium text-gray-500">College</p>
              <p className="font-semibold text-gray-800">{user.collegeName}</p>
            </div>
          )}

          {user?.collegeCode && (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="mb-1 text-sm font-medium text-gray-500">
                College Code
              </p>
              <p className="font-semibold text-gray-800">{user.collegeCode}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
