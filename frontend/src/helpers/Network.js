import axios from 'axios';

export const Endpoint = {
    LOGIN: "/login",
  // Add more endpoints as needed
};

// Base configuration for Axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    // auth related headers will be added
  },
});

// Generic GET request function
export const getRequest = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, params);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Generic POST request function
export const postRequest = async (url, data = {}, params = {}) => {
  try {
    const response = await axiosInstance.post(url, data, params);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// // Generic PUT request function
// export const putRequest = async (url, data = {}, params = {}) => {
//   try {
//     const response = await axiosInstance.put(url, data, params);
//     return response.data;
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// // Generic DELETE request function
// export const deleteRequest = async (url, params = {}) => {
//   try {
//     const response = await axiosInstance.delete(url, params);
//     return response.data;
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// Error handling function
const handleError = (error) => {
  // Handle errors (e.g., log them, show notifications)
  console.error('API error:', error);
};

export default {
  getRequest,
  postRequest,
  // putRequest,
  // deleteRequest,
};
