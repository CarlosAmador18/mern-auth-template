import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../libs/jwt.js";

// --- registerUser --- 
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación básica (podría mejorarse con Zod/express-validator)
    if (!username || !email || !password) {
        return res.status(400).json({ message: ["Username, email, and password are required"] });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: ["Password must be at least 6 characters"] });
    }

    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json({ message: ["The email is already in use"] });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: passwordHash });
    const userSaved = await newUser.save();

    // Crear ambos tokens
    const accessToken = await createAccessToken({ id: userSaved._id });
    const refreshToken = await createRefreshToken({ id: userSaved._id }); 

    // Opciones base para cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: '/',
    };
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Guardar Refresh Token en cookie HttpOnly
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      expires: refreshTokenExpiry,
    });

    // Guardar flag isLoggedIn
    res.cookie("isLoggedIn", "true", {
      ...cookieOptions,
      httpOnly: false, 
      expires: refreshTokenExpiry,
    });

    // Enviar Access Token y datos del usuario
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      accessToken: accessToken, 
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: [error.message || "Internal Server Error"] });
  }
};

// --- loginUser --- 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: ["Email and password are required"] });
    }

    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: ["Invalid credentials"] }); // Mensaje genérico

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ message: ["Invalid credentials"] }); // Mensaje genérico

    // Crear ambos tokens
    const accessToken = await createAccessToken({ id: userFound._id });
    const refreshToken = await createRefreshToken({ id: userFound._id });

    // Opciones base para cookies
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: '/',
    };
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
    // Guardar Refresh Token en cookie HttpOnly
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        expires: refreshTokenExpiry,
    });

    // Guardar flag isLoggedIn
    res.cookie("isLoggedIn", "true", {
        ...cookieOptions,
        httpOnly: false, 
        expires: refreshTokenExpiry,
    });

    // Enviar Access Token y datos del usuario
    res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        accessToken: accessToken, 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: [error.message || "Internal Server Error"] });
  }
};

// --- logoutUser --- 
export const logoutUser = async (req, res) => {
  try {
    const clearCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0),
      path: '/',
    };
    // Limpiar ambas cookies
    res.cookie("refreshToken", "", clearCookieOptions);
    res.cookie("isLoggedIn", "", { ...clearCookieOptions, httpOnly: false });
    return res.sendStatus(200);
  } catch (error) {
     console.error("Logout Error:", error);
     // Incluso si hay error, intentar responder
     return res.status(500).json({ message: ["Logout failed"]});
  }
};

// --- profile (Ejemplo de ruta protegida) ---
export const profile = async (req, res) => {
  // req.user viene del middleware authRequired
  try {
      const userFound = await User.findById(req.user.id);
      if (!userFound) return res.status(404).json({ message: "User not found" });

      return res.json({
          id: userFound._id,
          username: userFound.username,
          email: userFound.email,
          createdAt: userFound.createdAt,
          updatedAt: userFound.updatedAt,
      });
  } catch(error) {
       console.error("Profile Error:", error);
       return res.status(500).json({ message: "Error fetching profile" });
  }
}; 