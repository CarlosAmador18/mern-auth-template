import axios from "./axios"; // Importar la instancia configurada

export const registerRequest = async (user) => axios.post(`/register`, user);

export const loginRequest = async (user) => axios.post(`/login`, user);

export const refreshTokenRequest = async () => axios.post(`/refresh_token`);

export const logoutRequest = async () => axios.post(`/logout`);

// Ejemplo: Si necesitaras obtener datos del perfil después de refrescar
// export const getProfileRequest = async () => axios.get(`/profile`); 