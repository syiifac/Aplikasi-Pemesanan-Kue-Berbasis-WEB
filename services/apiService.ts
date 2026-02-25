// PHP Backend API Service
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/backend/api';

// Configure CORS headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// ============ CATEGORIES ============
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    return data.data || [];
  },

  // Get single category
  getById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    const data = await response.json();
    return data.data;
  },

  // Create category (admin only)
  create: async (categoryData: any) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  // Update category (admin only)
  update: async (id: string | number, categoryData: any) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  // Delete category (admin only)
  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });
    return response.json();
  },
};

// ============ PRODUCTS ============
export const productAPI = {
  // Get all products
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data.data || [];
  },

  // Get single product
  getById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await response.json();
    return data.data;
  },

  // Create product (admin only)
  create: async (productData: any) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  // Update product (admin only)
  update: async (id: string | number, productData: any) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  // Delete product (admin only)
  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });
    return response.json();
  },
};

// ============ AUTHENTICATION ============
export const authAPI = {
  // Register user
  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};

// ============ ORDERS ============
export const orderAPI = {
  // Get all orders (admin)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const data = await response.json();
    return data.data || [];
  },

  // Get user orders
  getByUser: async (userId: string | number) => {
    const response = await fetch(`${API_BASE_URL}/orders?user_id=${userId}`);
    const data = await response.json();
    return data.data || [];
  },

  // Get single order
  getById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    const data = await response.json();
    return data.data;
  },

  // Create order
  create: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  // Update order status
  updateStatus: async (id: string | number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// ============ USERS ============
export const userAPI = {
  // Get all users (admin)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data = await response.json();
    return data.data || [];
  },

  // Get user profile
  getById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    const data = await response.json();
    return data.data;
  },

  // Update user profile
  update: async (id: string | number, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

export default {
  categoryAPI,
  productAPI,
  authAPI,
  orderAPI,
  userAPI,
};
