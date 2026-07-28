import API from './api';

const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

const getNotifications = async () => {
  const response = await API.get('/auth/notifications');
  return response.data;
};

const markNotificationRead = async (id) => {
  const response = await API.put(`/auth/notifications/${id}`);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  getNotifications,
  markNotificationRead,
};

export default authService;
