import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Si aún está cargando la verificación inicial, mostrar un indicador
  //    (App.jsx ya muestra uno global, pero podríamos tener uno específico aquí si quisiéramos)
  // if (loading) {
  //   return <div>Checking authentication...</div>;
  // }

  // 2. Si terminó de cargar y NO está autenticado, redirigir a login
  //    Guardamos la ruta original para poder volver después del login
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si terminó de cargar y SÍ está autenticado, renderizar la ruta hija
  return <Outlet />;
};

export default ProtectedRoute; 