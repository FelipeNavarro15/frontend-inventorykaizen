import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
