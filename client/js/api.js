/**
 * API Client
 * Handles all API communication with the backend
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

class API {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.auth !== false)
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            auth: false,
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            auth: false,
            body: JSON.stringify(userData)
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    isAuthenticated() {
        return !!this.token;
    }

    // Product endpoints
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`, { auth: false });
    }

    async getProduct(id) {
        return this.request(`/products/${id}`, { auth: false });
    }

    // Cart endpoints
    async getCart() {
        return this.request('/cart');
    }

    async addToCart(productId, quantity = 1) {
        return this.request('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }

    async updateCartItem(productId, quantity) {
        return this.request(`/cart/items/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }

    async removeFromCart(productId) {
        return this.request(`/cart/items/${productId}`, {
            method: 'DELETE'
        });
    }

    async clearCart() {
        return this.request('/cart', {
            method: 'DELETE'
        });
    }

    // Order endpoints
    async getOrders() {
        return this.request('/orders');
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }
}

// Create global API instance
const api = new API();

// Update auth link based on login status
function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        if (api.isAuthenticated()) {
            authLink.textContent = 'Logout';
            authLink.href = '#';
            authLink.onclick = (e) => {
                e.preventDefault();
                api.logout();
                window.location.href = 'index.html';
            };
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', updateAuthLink);
