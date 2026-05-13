/** @format */

import axios from "axios";

const BASE_URL = "http://localhost:5000/api/files";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getDashboardFiles = async (role, department, token = localStorage.getItem("token")) => {
  const res = await axios.get(
    `${BASE_URL}/dashboard?role=${role}&department=${department}`,
    authConfig(token)
  );
  return res.data;
};

export const getRepositoryFiles = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}?${query}`, authConfig(token));
  return res.data;
};

export const uploadRepositoryFileApi = async (formData, token) => {
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateFileApprovalApi = async (id, data, token) => {
  const res = await axios.patch(
    `${BASE_URL}/${id}/approval`,
    data,
    authConfig(token)
  );
  return res.data;
};

export const getFileDownloadUrl = (id, token) =>
  `${BASE_URL}/download/${id}?token=${token || ""}`;
