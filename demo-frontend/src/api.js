import axios from "axios";

// Base URL dynamically configured from environment variable or defaults to local port 5000
const BASE_HOST = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE_URL = `${BASE_HOST}/dmo`;
const AUTH_BASE_URL = `${BASE_HOST}/auth`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // GET: All records
  getAll: async () => {
    const res = await api.get("/get");
    return res.data;
  },

  // GET: Record by ID
  getById: async (id) => {
    const res = await api.get(`/getid/${id}`);
    return res.data;
  },

  // POST: Add new record
  create: async (data) => {
    const res = await api.post("/add", data);
    return res.data;
  },

  // PUT: Update all details
  update: async (id, data) => {
    const res = await api.put(`/update/${id}`, data);
    return res.data;
  },

  // PATCH: Update name only
  updateName: async (id, name) => {
    const res = await api.patch(`/updatename/${id}`, { name });
    return res.data;
  },

  // DELETE: Delete record
  remove: async (id) => {
    const res = await api.delete(`/delete/${id}`);
    return res.data;
  },

  // Health check
  checkHealth: async () => {
    try {
      await api.get("/get");
      return true;
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        return false;
      }
      return true;
    }
  }
};

export const authService = {
  // POST: Register
  register: async (userData) => {
    const res = await authApi.post("/register", userData);
    return res.data;
  },

  // POST: Login
  login: async (credentials) => {
    const res = await authApi.post("/login", credentials);
    return res.data;
  },

  // GET: Profile
  getProfile: async (id) => {
    const res = await authApi.get(`/me/${id}`);
    return res.data;
  }
};

export default api;
