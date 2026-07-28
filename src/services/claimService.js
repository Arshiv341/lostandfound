import API from './api';

const createClaim = async (formData) => {
  const response = await API.post('/claims', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getMyClaims = async () => {
  const response = await API.get('/claims/my-claims');
  return response.data;
};

const getItemClaims = async (itemId) => {
  const response = await API.get(`/claims/item/${itemId}`);
  return response.data;
};

const updateClaimStatus = async (id, statusData) => {
  const response = await API.put(`/claims/${id}/status`, statusData);
  return response.data;
};

const getDashboardStats = async () => {
  const response = await API.get('/admin/dashboard');
  return response.data;
};

const getAllUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

const updateUserRole = async (userId, roleData) => {
  const response = await API.put(`/admin/users/${userId}/role`, roleData);
  return response.data;
};

const claimService = {
  createClaim,
  getMyClaims,
  getItemClaims,
  updateClaimStatus,
  getDashboardStats,
  getAllUsers,
  updateUserRole,
};

export default claimService;
