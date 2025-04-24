import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir a la página original o al perfil si viene de una ruta protegida
      const from = location.state?.from?.pathname || "/profile";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <div>
      <h2>Login</h2>
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
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
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

export default LoginPage; 