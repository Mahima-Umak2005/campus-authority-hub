/** @format */

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const loginApi = (data) => API.post("/login", data);
export const registerApi = (data) => API.post("/register", data);
export const meApi = (token) =>
  API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
