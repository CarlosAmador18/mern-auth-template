import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar'; // Asumiendo un Navbar básico
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  // Opcional: Mostrar un spinner global mientras carga la verificación inicial
  if (loading) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <h1>Loading App...</h1>
          </div>
      );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: '20px' }}> {/* Añadir algo de padding */}
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              {/* Añade aquí otras rutas protegidas */}
            </Route>

            {/* Ruta Catch-all para 404 (opcional) */}
            <Route path="*" element={<div><h1>404 Not Found</h1></div>} />
          </Routes>
        </main>
    </>
  );
}

export default App; 