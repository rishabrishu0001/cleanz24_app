// In development, Vite proxies '/api' to local backend (http://localhost:5000).
// In production / APK, points directly to the live Render backend.
const API_ORIGIN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : (import.meta.env?.PROD ? 'https://cleanz24-app.onrender.com' : '');
const BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

async function fetchJSON(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // ── Auth & Users ──
  auth: {
    quickLogin: (data) => fetchJSON('/auth/quick-login', { method: 'POST', body: JSON.stringify(data) }),
    sendWhatsAppOtp: (phone) => fetchJSON('/auth/send-whatsapp-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
    verifyWhatsAppOtp: (data) => fetchJSON('/auth/verify-whatsapp-otp', { method: 'POST', body: JSON.stringify(data) }),
    sendSmsOtp: (phone) => fetchJSON('/auth/send-sms-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
    verifySmsOtp: (data) => fetchJSON('/auth/verify-sms-otp', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getMe: (userId) => fetchJSON(`/auth/me?userId=${encodeURIComponent(userId || '')}`),
    updateProfile: (data) => fetchJSON('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getAddresses: (userId) => fetchJSON(`/auth/addresses?userId=${encodeURIComponent(userId || '')}`),
    saveAddress: (data) => fetchJSON('/auth/addresses', { method: 'POST', body: JSON.stringify(data) })
  },

  // ── Orders ──
  orders: {
    getActive: (userId) => fetchJSON(`/orders/active?userId=${encodeURIComponent(userId || '')}`),
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/orders?${q}`);
    },
    getById: (id) => fetchJSON(`/orders/${id}`),
    create: (data) => fetchJSON('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, data) => fetchJSON(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) })
  },

  // ── Stores ──
  stores: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/stores?${q}`);
    },
    getNearby: (lat, lng) => fetchJSON(`/stores/nearby?lat=${lat}&lng=${lng}`),
    getById: (id) => fetchJSON(`/stores/${id}`),
    create: (data) => fetchJSON('/stores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchJSON(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJSON(`/stores/${id}`, { method: 'DELETE' }),
    getPriceList: (id) => fetchJSON(`/stores/${id}/price-list`),
    updatePriceList: (id, priceList) => fetchJSON(`/stores/${id}/price-list`, { method: 'PUT', body: JSON.stringify({ priceList }) })
  },

  // ── Admin ──
  admin: {
    getStats: (studioId) => fetchJSON(`/admin/stats?studioId=${encodeURIComponent(studioId || 'all')}`),
    getOrders: (studioId) => fetchJSON(`/admin/orders?studioId=${encodeURIComponent(studioId || 'all')}`),
    assignValet: (orderId, valetId) => fetchJSON(`/admin/orders/${orderId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ valetId })
    }),
    getValets: () => fetchJSON('/admin/valets')
  },

  // ── Wallet ──
  wallet: {
    getBalance: (userId) => fetchJSON(`/wallet/balance?userId=${encodeURIComponent(userId || '')}`),
    topup: (data) => fetchJSON('/wallet/topup', { method: 'POST', body: JSON.stringify(data) }),
    getTransactions: (userId) => fetchJSON(`/wallet/transactions?userId=${encodeURIComponent(userId || '')}`)
  },

  // ── Services Catalog ──
  services: {
    getAll: () => fetchJSON('/services')
  }
};

export default api;