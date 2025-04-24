import axios from "axios";
import { refreshTokenRequest } from "./auth";

// Variable global para cola de peticiones (simplificación)
let failedQueue = [];
let isRefreshing = false;

// Funciones para acceder al contexto (se establecerán desde fuera)
let getAccessTokenFunc = () => null;
let setTokenFunc = (token) => {};
let logoutFunc = async () => {};

export const setAuthAccessors = (getAccessToken, setToken, logout) => {
  getAccessTokenFunc = getAccessToken;
  setTokenFunc = setToken;
  logoutFunc = logout;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const instance = axios.create({
  // La URL base apunta al backend (asegúrate que coincida con tu config)
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, // ¡Esencial para cookies!
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor --- 
instance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFunc();
    const noAuthRoutes = ['/login', '/register', '/refresh_token'];
    if (token && !noAuthRoutes.some(route => config.url.endsWith(route))) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log("Sending:", config.method.toUpperCase(), config.url, config.headers.Authorization ? "with AT" : "no AT");
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor --- 
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // console.error("Axios Response Error Status:", error.response?.status);

    // Si es 401 + código específico + no es reintento + no es la ruta refresh
    if (error.response?.status === 401 && 
        error.response?.data?.code === "TOKEN_EXPIRED" && 
        !originalRequest._retry && 
        !originalRequest.url.endsWith('/refresh_token')) {
      
      if (isRefreshing) {
        // Poner en cola si ya se está refrescando
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return instance(originalRequest); 
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      console.log("AT expired. Refreshing...");
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshTokenRequest();
        const newAccessToken = refreshResponse.data.accessToken;
        console.log("Refresh OK. New AT obtained.");
        setTokenFunc(newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest); // Reintentar original

      } catch (refreshError) {
        console.error("Refresh failed:", refreshError.response?.data || refreshError.message);
        processQueue(refreshError, null);
        await logoutFunc(); // Logout si refresh falla
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }

    } else if (error.response?.status === 401 || error.response?.status === 403) {
        // Logout para otros 401/403 (token inválido, fallo de refresh, etc.)
        // Evitar logout si el error vino del propio refresh (ya se maneja arriba)
        if (!originalRequest.url.endsWith('/refresh_token') && !originalRequest._retry) {
             console.log(`Auth error (${error.response.status}). Logging out.`);
             await logoutFunc();
        }
    }

    return Promise.reject(error);
  }
);

export default instance; 