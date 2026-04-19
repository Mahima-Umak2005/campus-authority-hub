import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import PrincipalDashboard from "../pages/PrincipalDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import HODDashboard from "../pages/HODDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Posters from "../pages/Posters";
import DisplayScreen from "../pages/DisplayScreen";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import ManagePosters from "../pages/ManagePosters";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DisplayScreen />} />

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
  path="/manage-posters"
  element={
    <ProtectedRoute allowedRoles={["chairman", "principal"]}>
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
        path="/posters/new"
        element={
          <ProtectedRoute
            allowedRoles={["chairman", "principal", "hod", "faculty"]}
          >
            <Posters />
          </ProtectedRoute>
        }
      />

      <Route path="/display" element={<DisplayScreen />} />
    </Routes>
  );
};

export default AppRoutes;