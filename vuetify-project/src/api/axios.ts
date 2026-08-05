import axios from 'axios';

export const apiSession = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

export const apiJwt = axios.create({
  baseURL: 'http://localhost:8080/api'
});

apiJwt.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});