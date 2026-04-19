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
