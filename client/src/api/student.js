import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

export const uploadStudentsCSVApi = async (formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(`${API_URL}/upload-csv`, formData, config);
  return response.data;
};

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getDepartmentStudentsApi = async (token) => {
  const response = await axios.get(API_URL, authConfig(token));
  return response.data;
};

export const updateDepartmentStudentApi = async (id, data, token) => {
  const response = await axios.put(`${API_URL}/${id}`, data, authConfig(token));
  return response.data;
};

export const deleteDepartmentStudentApi = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, authConfig(token));
  return response.data;
};

export const resetDepartmentStudentPasswordApi = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/reset-password`,
    {},
    authConfig(token)
  );
  return response.data;
};
