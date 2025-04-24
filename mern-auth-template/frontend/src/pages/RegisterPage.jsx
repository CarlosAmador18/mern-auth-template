import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp({ username, email, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir al perfil después de registrarse
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h2>Register</h2>
      {/* Mostrar errores de autenticación */}
      {authErrors && authErrors.length > 0 && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {authErrors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username">Username:</label><br/>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label><br/>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label><br/>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} // Añadir validación básica
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem',
  width: 'calc(100% - 1rem)',
  maxWidth: '300px'
};

const buttonStyle = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#333',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};

export default RegisterPage; 