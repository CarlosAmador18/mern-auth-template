import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios'; // Importar instancia de axios configurada

function ProfilePage() {
  const { user: contextUser } = useAuth(); // User del contexto puede estar vacío inicialmente
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Llamar a la ruta protegida del backend
        const response = await axios.get('/profile');
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch profile');
        // El interceptor de axios debería manejar el logout si el token es inválido/expirado
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // Ejecutar solo una vez al montar

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Usar contextUser como fallback si la carga falla o es lenta
  const displayUser = profileData || contextUser;

  return (
    <div>
      <h2>Profile Page (Protected)</h2>
      {displayUser ? (
        <div>
          <p><strong>ID:</strong> {displayUser.id}</p>
          <p><strong>Username:</strong> {displayUser.username}</p>
          <p><strong>Email:</strong> {displayUser.email}</p>
          {profileData && (
              <> {/* Mostrar datos adicionales si vienen de la API */}
                <p><strong>Registrado:</strong> {new Date(displayUser.createdAt).toLocaleDateString()}</p>
                <p><strong>Última Actualización:</strong> {new Date(displayUser.updatedAt).toLocaleDateString()}</p>
              </>
          )}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default ProfilePage; 