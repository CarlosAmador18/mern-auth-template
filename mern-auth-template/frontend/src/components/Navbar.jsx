import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Llama a la función logout del contexto
    // La navegación ya no es necesaria aquí si logout limpia el estado
    // y ProtectedRoute redirige automáticamente.
    // navigate('/login'); 
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        <h1>AuthApp</h1>
      </Link>
      <ul style={ulStyle}>
        {isAuthenticated ? (
          <>
            <li style={liStyle}>Bienvenido, {user?.username || 'Usuario'}!</li>
            <li style={liStyle}>
              <Link to="/profile" style={linkStyle}>Perfil</Link>
            </li>
            <li style={liStyle}>
              <button onClick={handleLogout} style={buttonStyle}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={liStyle}>
              <Link to="/login" style={linkStyle}>Login</Link>
            </li>
            <li style={liStyle}>
              <Link to="/register" style={linkStyle}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

// Estilos básicos inline para simplicidad
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#333',
  color: 'white'
};

const ulStyle = {
  listStyle: 'none',
  display: 'flex',
  gap: '1rem',
  margin: 0,
  padding: 0,
};

const liStyle = {
  display: 'inline'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  color: '#f0a500', // Un color para destacar
  cursor: 'pointer',
  fontSize: 'inherit',
  padding: 0,
  textDecoration: 'underline'
};

export default Navbar; 