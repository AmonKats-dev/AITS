import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Update this with your Django backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  console.log('Current token:', token);
  console.log('Request URL:', config.url);
  console.log('Request method:', config.method);
  console.log('Request headers:', config.headers);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header added:', config.headers.Authorization);
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      console.log('Unauthorized error detected, clearing auth data...');
      // Clear auth data
      localStorage.removeItem('access');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedRole');
      
      return Promise.reject(new Error('Unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Auth services
export const login = async (credentials) => {
  const response = await api.post('/users/login/', credentials);
  return response.data;
};

export const logout = async () => {
  const refresh_token = localStorage.getItem('refreshToken');
  const response = await api.post('/users/logout/', { refresh_token });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users/register/', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/users/profile/');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile/', profileData);
  return response.data;
};

// User services
export const getStudents = async () => {
  const response = await api.get('/users/students/');
  return response.data;
};

// Issue services
export const getAllIssues = async () => {
  const response = await api.get('/issues/');
  return response.data;
};

export const getStudentIssues = async () => {
  const response = await api.get('/issues/student/');
  return response.data;
};

export const getLecturerIssues = async () => {
  const response = await api.get('/issues/lecturer/');
  return response.data;
};

export const getIssueById = async (id) => {
  const response = await api.get(`/issues/${id}/`);
  return response.data;
};

export const createIssue = async (issueData) => {
  console.log('Creating issue with data:', issueData);
  const response = await api.post('/issues/create/', issueData);
  console.log('Issue creation response:', response);
  return response.data;
};

export const updateIssue = async (id, issueData) => {
  const response = await api.put(`/issues/${id}/`, issueData);
  return response.data;
};

export const deleteIssue = async (id) => {
  const response = await api.delete(`/issues/${id}/`);
  return response.data;
};

// File upload services
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('Uploading file:', file.name);
  const response = await api.post('/issues/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('File upload response:', response);
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}/`);
  return response.data;
};

// Academic services
export const getColleges = async () => {
  const response = await api.get('/academic/colleges/');
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get('/academic/departments/');
  return response.data;
};

export const createCollege = async (collegeData) => {
  const response = await api.post('/academic/colleges/', collegeData);
  return response.data;
};

export const updateCollege = async (id, collegeData) => {
  const response = await api.put(`/academic/colleges/${id}/`, collegeData);
  return response.data;
};

export const deleteCollege = async (id) => {
  const response = await api.delete(`/academic/colleges/${id}/`);
  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await api.post('/academic/departments/', departmentData);
  return response.data;
};

export const updateDepartment = async (id, departmentData) => {
  const response = await api.put(`/academic/departments/${id}/`, departmentData);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/academic/departments/${id}/`);
  return response.data;
};

export default api; 