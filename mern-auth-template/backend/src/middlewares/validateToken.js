import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config.js";

// Middleware para proteger rutas que requieren un Access Token válido
export const authRequired = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("AuthRequired: No auth header or Bearer scheme");
      return res.status(401).json({ message: "No token provided or invalid format" });
    }
    
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log("AuthRequired: No token after Bearer");
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, TOKEN_SECRET, (error, userPayload) => {
      if (error) {
        console.log("AuthRequired: Error verifying Access Token:", error.name);
        if (error.name === 'TokenExpiredError') {
          // Devolver 401 con código específico para que el interceptor intente refrescar
          return res.status(401).json({ message: "Access Token expired", code: "TOKEN_EXPIRED" });
        } else {
          // Para otros errores (token inválido), devolver 403
          return res.status(403).json({ message: "Invalid Access Token" });
        }
      }
      
      // Guardar el payload del token (que usualmente contiene el ID del usuario)
      req.user = userPayload; 
      console.log("AuthRequired: Access Token validated for user:", req.user.id);
      next(); // Token válido, continuar a la ruta protegida
    });

  } catch (error) {
    console.error("AuthRequired: Internal error:", error);
    return res.status(500).json({ message: "Internal server error in authentication middleware" });
  }
}; 