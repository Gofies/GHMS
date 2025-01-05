import axios from 'axios';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

export const Endpoint = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/patient/auth/signup',
  ADMIN_CHANGE_PASSWORD: '/admin/auth/change-password',
  PATIENT_CHANGE_PASSWORD: '/patient/auth/change-password',
  DOCTOR_CHANGE_PASSWORD: '/doctor/auth/change-password',
  LAB_TECHNICIAN_CHANGE_PASSWORD: '/labtechnician/auth/',
  GET_PATIENT_APPOINTMENTS: '/patient/appointments',
  GET_PROFILE: '/patient/profile',
  UPDATE_PROFILE: '/patient/profile',
  GET_LAB_TESTS: '/patient/medical-record/lab-tests',
  GET_OTHER_TESTS: '/patient/medical-record/other-tests',
  GET_DIAGNOSES: '/patient/medical-record/diagnoses',
  GET_HOME_APPOINTMENTS: '/patient',
  GET_HEALTH_METRICS: '/patient/metrics',
  PUT_HEALTH_METRICS: '/patient/metrics',
  GET_DOCTOR_HOME: '/doctor',
  GET_ADMIN_DOCTOR: '/admin/doctor',
  GET_ADMIN_PATIENT: '/admin/patient',
  GET_ADMIN_LAB_TECHNICIAN: '/admin/labtechnician',
  GET_ADMIN_POLYCLINIC: '/admin/polyclinic',
  GET_ADMIN_HOSPITAL: '/admin/hospital',
  GET_DOCTOR_PATIENTS: '/doctor/patient',
  GET_LAB_TECHNICIAN_HOME: '/labtechnician/',
  PUT_COMPLETE_TEST: '/labtechnician/',
  GET_LAB_TECHNICIAN_TESTS: '/labtechnician/test',
  GET_LAB_TECHNICIAN_TESTS_RESULTS: '/labtechnician/test/results',
  CANCEL_APPOINTMENT: '/patient/appointments'
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
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
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post('/auth/refresh-token');
        const newToken = refreshResponse.data.token;

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const dispatch = useDispatch();
        dispatch(logout());
        console.error('Refresh token failed. Logging out...');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const handleError = (error) => {
  if (error.response) {
    console.error('API error response:', error.response.data);
    if (error.response.status === 401) {
      console.error('Unauthorized error. Token may have expired.');
    } else if (error.response.status === 403) {
      console.error('Forbidden error. You do not have permission.');
    }
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Unexpected error:', error.message);
  }
};

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
    const response = await axiosInstance.delete(url, {
      data,
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export default {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
};
