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
