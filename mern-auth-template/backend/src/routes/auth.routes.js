import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  profile // Importar la ruta de perfil de ejemplo
} from "../controllers/user.controller.js";
import { handleRefreshToken } from "../controllers/refreshToken.controller.js";
import { authRequired } from "../middlewares/validateToken.js"; // Middleware para proteger rutas

// Podrías añadir validación de esquemas aquí si lo deseas (con Zod, express-validator, etc.)
// import { validateSchema } from "../middlewares/validator.middleware.js";
// import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = express.Router();

// --- Rutas de Autenticación Públicas ---
router.post("/register", /* validateSchema(registerSchema), */ registerUser);
router.post("/login", /* validateSchema(loginSchema), */ loginUser);
router.post("/logout", logoutUser);
router.post("/refresh_token", handleRefreshToken);

// --- Rutas Protegidas ---
// Ejemplo: Obtener perfil del usuario logueado
router.get("/profile", authRequired, profile);

export default router; 