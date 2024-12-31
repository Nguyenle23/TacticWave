import axios from "axios";

const url_base = "http://localhost:5555";

export const getAllRecords = async (userID) => {
  try {
    // Kiểm tra nếu userID không được cung cấp
    if (!userID) {
      throw new Error("User ID is required to fetch records.");
    }

    // Xây dựng URL
    const url = `${url_base}/record/${userID}`;

    // Gửi request
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Server Response:", error.response?.data || error.message);
    throw error;
  }
};


export const createRecord = async (data) => {
  try {
    const response = await axios.post(`${url_base}/record/`, data);
    return response;
  } catch (error) {
    console.error("Server Response:", error.response.data);
    throw error;
  }
};

export const submitFeedback = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(`${url_base}/feedback/`, data);
    return response;
  } catch (error) {
    console.error("Server Response:", error.response.data);
    throw error;
  }
}

export const runExp = async (data) => {
  try {
    const response = await axios.post(`${url_base}/runexp/`, data);
    return response;
  } catch (error) {
    console.error("Server Response:", error.response.data);
    throw error;
  }
};
