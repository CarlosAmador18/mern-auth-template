import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { REFRESH_TOKEN_SECRET } from "../../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("No refresh token cookie found");
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Definir opciones de limpieza de cookies una vez
  const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
  };

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const userFound = await User.findById(payload.id);
    if (!userFound) {
      console.log("User for refresh token not found");
      res.clearCookie('refreshToken', clearCookieOptions);
      res.clearCookie('isLoggedIn', { ...clearCookieOptions, httpOnly: false });
      return res.status(403).json({ message: "User not found" }); 
    }

    const newAccessToken = await createAccessToken({ id: userFound._id });

    // Nota: No estamos implementando rotación de RT en esta versión básica

    console.log("Refresh token successful, new Access Token generated for user:", userFound._id);
    res.json({
      accessToken: newAccessToken,
      // Podrías añadir datos básicos si el frontend los necesita al refrescar
      // id: userFound._id, username: userFound.username, email: userFound.email
    });

  } catch (error) {
    console.error("Error verifying refresh token:", error.message);
    // Limpiar cookies si el RT es inválido/expirado
    res.clearCookie('refreshToken', clearCookieOptions);
    res.clearCookie('isLoggedIn', { ...clearCookieOptions, httpOnly: false });
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    } else {
      return res.status(500).json({ message: "Internal server error during token refresh" });
    }
  }
}; 