import jwt from "jsonwebtoken";
import { TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config.js";

// Función para crear Access Tokens (corta duración)
export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET, // Secreto para Access Token
      { expiresIn: "15m" }, // Corta duración (ej: 15 minutos)
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

// Función para crear Refresh Tokens (larga duración)
export function createRefreshToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      REFRESH_TOKEN_SECRET, // Secreto DIFERENTE para Refresh Token
      { expiresIn: "7d" }, // Larga duración (ej: 7 días)
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
} 