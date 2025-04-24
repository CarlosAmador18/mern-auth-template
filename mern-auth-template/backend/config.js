// Este archivo podría cargar variables de .env o tener valores por defecto
import dotenv from 'dotenv';
dotenv.config(); // Carga variables desde .env

// Asegúrate de tener estos secretos en tu archivo .env
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret_key_access_123';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secret_key_refresh_456_diff';

export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/mern-auth-template";
export const PORT = process.env.PORT || 5000;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; 