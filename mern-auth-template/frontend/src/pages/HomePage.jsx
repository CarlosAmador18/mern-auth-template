import React from 'react';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Página de Inicio</h1>
      {isAuthenticated ? (
        <p>¡Estás logueado!</p>
      ) : (
        <p>Bienvenido. Por favor, inicia sesión o regístrate.</p>
      )}
    </div>
  );
}

export default HomePage; 