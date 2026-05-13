import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import PrincipalDashboard from "../pages/PrincipalDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import HODDashboard from "../pages/HODDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import Posters from "../pages/Posters";
import DisplayScreen from "../pages/DisplayScreen";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import Repository from "../pages/Repository";
import UploadRepository from "../pages/UploadRepository";
import ManagePosters from "../pages/ManagePosters";
import Profile from "../pages/Profile";
import ManageStudents from "../pages/ManageStudents";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/principal-dashboard"
        element={
          <ProtectedRoute allowedRoles={["chairman", "principal"]}>
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/repository/upload"
  element={
    <ProtectedRoute
      allowedRoles={["chairman", "principal", "hod", "faculty"]}
    >
      <UploadRepository />
    </ProtectedRoute>
  }
/>
      <Route
  path="/manage-posters"
  element={
    <ProtectedRoute allowedRoles={["chairman", "principal", "hod", "faculty"]}>
      <ManagePosters />
    </ProtectedRoute>
  }
/>

      <Route
        path="/hod-dashboard"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <HODDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty-dashboard"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-students"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <ManageStudents />
          </ProtectedRoute>
        }
      />
      <Route
  path="/repository"
  element={
    <ProtectedRoute
      allowedRoles={["chairman", "principal", "hod", "faculty"]}
    >
      <Repository />
    </ProtectedRoute>
  }
/>
      <Route
        path="/posters/new"
        element={
          <ProtectedRoute
            allowedRoles={["chairman", "principal", "hod", "faculty"]}
          >
            <Posters />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["chairman", "principal", "hod", "faculty", "admin", "student"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/display" element={<DisplayScreen />} />
    </Routes>
  );
};

export default AppRoutes;
