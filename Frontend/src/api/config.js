// API configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  CUSTOMER_SIGNUP: `${BASE_URL}/api/auth/customer/signup`,
  CUSTOMER_LOGIN: `${BASE_URL}/api/auth/customer/login`,
  FARMER_SIGNUP: `${BASE_URL}/api/auth/farmer/signup`,
  FARMER_LOGIN: `${BASE_URL}/api/auth/farmer/login`,
  
  // Product endpoints
  PRODUCTS: `${BASE_URL}/api/products`,
  PRODUCTS_BY_CATEGORY: `${BASE_URL}/api/products/category`,
  
  // Cart endpoints
  CART: `${BASE_URL}/api/cart`,
  
  // Order endpoints
  ORDERS: `${BASE_URL}/api/orders`,
  
  // Feedback endpoint
  FEEDBACK: `${BASE_URL}/api/feedback`,
  
  // Health check
  HEALTH: `${BASE_URL}/api/health`
};

// Helper function for making API requests
export const apiRequest = async (url, options = {}) => {
  try {
    const tokenRaw = localStorage.getItem('token');
    const token = tokenRaw && tokenRaw !== 'null' && tokenRaw !== 'undefined' ? tokenRaw : null;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default BASE_URL;