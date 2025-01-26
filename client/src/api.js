import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;

export const registerStudent = (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

export const loginFaculty = (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const createAttendanceSession = (data) => {
  return axios.post(`${API_URL}/attendance/create-session`, data);
};

export const markAttendance = (data) => {
  return axios.post(`${API_URL}/attendance/mark-attendance`, data);
};

export const getAttendance = (sessionId) => {
  return axios.get(`${API_URL}/attendance/${sessionId}`);
};

export const toggleStudentAttendance = (sessionId, studentId) => {
  return axios.put(`${API_URL}/attendance/${sessionId}/${studentId}`);
};

export const getFacultySessions = (id) => {
  return axios.get(`${API_URL}/attendance/sessions/${id}`);
};

export const getAllStudents = () => {
  return axios.get(`${API_URL}/attendance/students`);
};
