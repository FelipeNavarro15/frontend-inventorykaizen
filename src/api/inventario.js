// src/api/inventario.js
import apiClient from './config';

// Obtener inventario
export const fetchInventario = async () => {
  try {
    const response = await apiClient.get('/api/inventario/');
    return response.data.results ?? response.data;
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    throw error;
  }
};

// Obtener reporte financiero
export const fetchReporteFinanciero = async () => {
  try {
    const response = await apiClient.get('/api/inventario/reporte_financiero/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte financiero:', error);
    throw error;
  }
};

export const createAjuste = async (payload) => {
  try {
    const response = await apiClient.post('/api/inventario/ajustar/', payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear ajuste:', error);
    throw error;
  }
};

export const fetchAjustes = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/inventario/ajustes/', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener ajustes de inventario:', error);
    throw error;
  }
};

export const setMinimo = async (payload) => {
  try {
    const response = await apiClient.post('/api/inventario/set_minimo/', payload);
    return response.data;
  } catch (error) {
    console.error('Error al establecer mínimo:', error);
    throw error;
  }
};
