import axios from "axios";

const url_base = "http://localhost:5555";

export const getAllRecords = async () => {
  try {
    const response = await axios.get(`${url_base}/record/`);
    return response;
  } catch (error) {
    console.error("Network Error:", error.message);
    if (error.response) {
      console.error("Server Response:", error.response.data);
    }
    throw error;
  }
};

export const createRecord = async (data) => {
  try {
    const response = await axios.post(`${url_base}/record/`, data);
    return response;
  } catch (error) {
    console.error("Network Error:", error.message);
    if (error.response) {
      console.error("Server Response:", error.response.data);
    }
    throw error;
  }
};


export const runExp = async (data) => {
  try {
    const response = await axios.post(`${url_base}/runexp/`, data);
    return response;
  } catch (error) {
    console.error("Network Error:", error.message);
    if (error.response) {
      console.error("Server Response:", error.response.data);
    }
    throw error;
  }
};
