import API from './api';

const getItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await API.get(`/items?${params}`);
  return response.data;
};

const getItemById = async (id) => {
  const response = await API.get(`/items/${id}`);
  return response.data;
};

const createItem = async (formData) => {
  const response = await API.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateItem = async (id, formData) => {
  const response = await API.put(`/items/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteItem = async (id) => {
  const response = await API.delete(`/items/${id}`);
  return response.data;
};

const getMyItems = async () => {
  const response = await API.get('/items/my-posts');
  return response.data;
};

const itemService = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
};

export default itemService;
