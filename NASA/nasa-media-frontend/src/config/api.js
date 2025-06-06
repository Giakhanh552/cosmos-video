const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default API_BASE_URL;

// Helper function for making authenticated API calls
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 