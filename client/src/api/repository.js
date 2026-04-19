/** @format */

import axios from "axios";

const BASE_URL = "http://localhost:5000/api/files";

export const getDashboardFiles = async (role, department) => {
  const res = await axios.get(
    `${BASE_URL}/dashboard?role=${role}&department=${department}`,
  );
  return res.data;
};

export const getRepositoryFiles = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${BASE_URL}?${query}`);
  return res.data;
};
