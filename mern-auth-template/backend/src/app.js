import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan'; // Logger para peticiones HTTP

import { connectDB } from './config/db.js';
import { PORT, FRONTEND_URL } from '../config.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// --- Middlewares ---
// CORS
app.use(cors({
  origin: FRONTEND_URL, // Origen del frontend desde config
  credentials: true,
}));

// Loggeo de Peticiones (formato dev)
app.use(morgan('dev'));

// Parsear JSON bodies
app.use(express.json());

// Parsear cookies
app.use(cookieParser());

// --- Rutas ---
app.use('/api', authRoutes); // Montar rutas de autenticación en /api

// --- Manejo de Errores Básico ---
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// --- Iniciar Servidor ---
async function main() {
  try {
    await connectDB(); // Conectar a la DB primero
    app.listen(PORT, () => {
      console.log(`>>> Server is running on port ${PORT}`);
      console.log(`>>> Accepting requests from: ${FRONTEND_URL}`)
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

main(); 