import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users', formData);
export const fetchOwnersByArea = (area) => API.get(`/users/owners/${area}`);




export const fetchProducts = (ownerId) => API.get('/products', { params: { ownerId } });
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const createOrder = (orderData) => API.post('/orders', orderData);
export const fetchMyOrders = () => API.get('/orders/myorders');
export const fetchAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

export const fetchFinanceSummary = () => API.get('/finance/summary');
export const fetchExpenses = () => API.get('/finance/expenses');
export const addExpense = (expenseData) => API.post('/finance/expenses', expenseData);
