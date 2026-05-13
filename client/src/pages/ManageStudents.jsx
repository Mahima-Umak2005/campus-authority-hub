import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
  deleteDepartmentStudentApi,
  getDepartmentStudentsApi,
  resetDepartmentStudentPasswordApi,
  updateDepartmentStudentApi,
} from "../api/student";

const ManageStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const data = await getDepartmentStudentsApi(token);
      setStudents(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = async (student) => {
    const name = prompt("Enter student name", student.name);
    if (!name) return;

    const email = prompt("Enter student email", student.email);
    if (!email) return;

    const className = prompt("Enter class", student.className || "");

    try {
      const token = localStorage.getItem("token");
      const updatedStudent = await updateDepartmentStudentApi(
        student._id,
        {
          name,
          email,
          className: className || "",
        },
        token
      );

      setStudents((current) =>
        current.map((item) =>
          item._id === student._id ? updatedStudent : item
        )
      );
      showMessage("Student updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this student?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await deleteDepartmentStudentApi(id, token);
      setStudents((current) => current.filter((student) => student._id !== id));
      showMessage("Student deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    }
  };

  const handleResetPassword = async (id) => {
    const password = prompt("Enter new temporary password", "12345");
    if (!password) return;

    if (password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    const confirmed = window.confirm(
      "Reset this student's password and force password change on next login?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const data = await resetDepartmentStudentPasswordApi(id, token, password);
      showMessage(data.message || "Password reset successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.className?.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <i className="fas fa-users text-2xl text-blue-600"></i>
          <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
        </div>
        <p className="text-gray-500">
          Department:{" "}
          <span className="font-semibold capitalize text-blue-600">
            {user?.department}
          </span>
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-[280px]"
        />
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 italic">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-8 text-center">
          <i className="fas fa-user-graduate mb-2 text-4xl text-gray-300"></i>
          <p className="text-gray-500">No students found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {student.className || "-"}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">
                      {student.department}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(student)}
                          className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(student._id)}
                          className="rounded-lg bg-amber-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-amber-600"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student._id)}
                          className="rounded-lg bg-red-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageStudents;
