import axios from 'axios';
import { logout } from '../redux/authSlice';
import { useDispatch } from "react-redux";

export const Endpoint = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  SIGNUP: "/patient/auth/signup",
  CHANGE_PASSWORD: "/patient/auth/change-password",
  GET_PATIENT_APPOINTMENTS: "/patient/appointments",
  GET_PROFILE: "/patient/profile",
  UPDATE_PROFILE: "/patient/profile",
  GET_LAB_TESTS: "/patient/medical-record/lab-tests",
  GET_OTHER_TESTS: "/patient/medical-record/other-tests",
  GET_DIAGNOSES: "/patient/medical-record/diagnoses",
  GET_HOME_APPOINTMENTS: "/patient",
  GET_HEALTH_METRICS: "/patient/metrics",
  PUT_HEALTH_METRICS: "/patient/metrics",

  GET_DOCTOR_HOME: "/doctor",
  GET_ADMIN_DOCTOR: "/admin/doctor",

  GET_ADMIN_POLYCLINIC: "/admin/polyclinic",
  GET_ADMIN_HOSPITAL: "/admin/hospital",

  GET_DOCTOR_PATIENTS: "/doctor/patient"
};

const axiosInstance = axios.create({
  baseURL: 'https://localhost/api/v1/',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache', 
    Pragma: 'no-cache', 
    Expires: '0', 
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      console.log("Unauthorized or Forbidden error, attempting refresh...");
      //originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh-token', {});
        console.log("Refresh token successful. Retrying original request...");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token expired or failed. Logging out...');
        // Logout user or redirect to login
        window.location.href = '/'; // Yönlendirme
        return Promise.reject(refreshError);
      }
    
    return Promise.reject(error);
  }
}
);

export const getRequest = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const postRequest = async (url, data = {}, params = {}) => {
  try {
    const response = await axiosInstance.post(url, data, { params });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const putRequest = async (url, data = {}, params = {}) => {
  try {
    const response = await axiosInstance.put(url, data, { params });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteRequest = async (url, data = {}, params = {}) => {
  try {
    const response = await axiosInstance.delete(url, data, { params });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

const handleError = (error) => {
  if (error.response) {
    // Backend'den gelen hata
    console.error('API error response:', error.response.data);
    if (error.response.status === 401) {
      console.error('Unauthorized error. Token may have expired.');
    } else if (error.response.status === 403) {
      console.error('Forbidden error. You do not have permission.');
    }
  } else if (error.request) {
    // Backend'e istek atıldı ama yanıt alınamadı
    console.error('No response received:', error.request);
  } else {
    // Başka bir hata
    console.error('Unexpected error:', error.message);
  }
};

export default {
  getRequest,
  postRequest,
  putRequest
};
