import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});
const baseURL = 'http://localhost:3000';

export const createRestaurante = (restaurante) => api.post('/restaurantes', restaurante);
export const getRestaurantes = () => api.get('/restaurantes');
export const deleteRestaurante = (id) => api.delete(`/restaurantes/${id}`);
export const updateRestaurante = (id, restaurante) => api.put(`/restaurantes/${id}`, restaurante);
export const getProductos = () => api.get('/productos');
export const createProducto = (producto) => api.post('/productos', producto);
export const updateProducto = async (producto) => {
  try {
    const response = await axios.put(`${baseURL}/productos/${producto.id}`, producto);
    return response;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};
export const deleteProducto = (id) => api.delete(`/productos/${id}`);
export const getTiposProducto = () => api.get('/tiposProducto');
export const createTipoProducto = (nuevoTipo) => {
  return axios.post(`${baseURL}/tiposProducto`, nuevoTipo);
};