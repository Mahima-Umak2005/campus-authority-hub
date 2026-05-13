/** @format */

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/posters",
});

export const uploadPosterApi = (formData, token) =>
  API.post("/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const getActivePostersApi = (role, department, token) =>
  API.get(`/active?role=${role}&department=${department}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getDashboardPostersApi = (token) =>
  API.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getStudentNoticesApi = (token) =>
  API.get("/student", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getDepartmentPostersApi = (token, department = "all") =>
  API.get(`/department?department=${department}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const markPosterAsReadApi = (id, token) =>
  API.patch(
    `/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
