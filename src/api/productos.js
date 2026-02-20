// src/api/productos.js
import apiClient from './config';

// Obtener todos los productos
export const fetchProductos = async () => {
  try {
    const response = await apiClient.get('/api/productos/');
    return response.data.results ?? response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (productoData) => {
  try {
    const response = await apiClient.post('/api/productos/', productoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProducto = async (id, productoData) => {
  try {
    const response = await apiClient.put(`/api/productos/${id}/`, productoData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    await apiClient.delete(`/api/productos/${id}/`);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};
