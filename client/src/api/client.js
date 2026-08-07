import axios from 'axios';

const API_ORIGIN = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true,
});

export default api;
