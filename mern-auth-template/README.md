# MERN Auth Template con Refresh Tokens

Este es un proyecto base que implementa un sistema de autenticación seguro usando el stack MERN (MongoDB, Express, React, Node.js) con el patrón de Refresh Tokens.

## Características Principales

*   **Backend (Node.js/Express/MongoDB):**
    *   Registro de usuarios (con hashing de contraseña bcryptjs).
    *   Login de usuarios.
    *   Logout (invalidando cookies).
    *   Generación de Access Tokens (JWT, corta duración).
    *   Generación de Refresh Tokens (JWT, larga duración).
    *   Almacenamiento seguro de Refresh Tokens en cookies `HttpOnly`.
    *   Endpoint `/api/refresh_token` para renovar Access Tokens.
    *   Middleware `authRequired` para proteger rutas usando Access Tokens del header `Authorization: Bearer`.
    *   Configuración CORS para permitir credenciales.
    *   Uso de variables de entorno (`.env`).
*   **Frontend (React/Vite):**
    *   Formularios de Login y Registro.
    *   Contexto de Autenticación (`AuthContext`) para manejar el estado global.
    *   Almacenamiento de Access Tokens en memoria JavaScript.
    *   Uso de cookie `isLoggedIn` (no-HttpOnly) para detectar sesión inicial.
    *   Llamada automática a `/refresh_token` al cargar la aplicación si `isLoggedIn` existe.
    *   Interceptores Axios para:
        *   Inyectar automáticamente el Access Token en los headers.
        *   Manejar errores 401 (token expirado), llamar a `/refresh_token` y reintentar la petición original.
        *   Manejar cola de peticiones mientras se refresca el token.
        *   Ejecutar logout si el refresh falla o el token es inválido.
    *   Rutas protegidas (`ProtectedRoute`) que redirigen si no estás autenticado.
    *   Componente Navbar básico con estado condicional.

## Requisitos Previos

*   Node.js (v16 o superior recomendado)
*   npm (o yarn/pnpm)
*   MongoDB (Instalado localmente o una instancia en la nube como MongoDB Atlas)

## Instalación

1.  **Clonar el Repositorio (si no lo tienes ya):**
    ```bash
    git clone <url-del-repositorio> mern-auth-template
    cd mern-auth-template
    ```

2.  **Configurar Variables de Entorno (Backend):**
    *   Ve a la carpeta `backend`.
    *   Copia el archivo `.env.example` a un nuevo archivo llamado `.env`.
      ```bash
      cd backend
      cp .env.example .env
      ```
    *   Edita el archivo `.env` y configura tus valores:
        *   `MONGO_URI`: Tu cadena de conexión a MongoDB.
        *   `TOKEN_SECRET`: Una cadena secreta larga y aleatoria.
        *   `REFRESH_TOKEN_SECRET`: OTRA cadena secreta larga, aleatoria y DIFERENTE a la anterior.
        *   `FRONTEND_URL`: La URL donde correrá tu frontend (por defecto `http://localhost:5173`).
        *   `PORT`: El puerto para el backend (por defecto `5000`).
    *   Vuelve a la carpeta raíz del proyecto:
      ```bash
      cd ..
      ```

3.  **Instalar Dependencias (Root, Backend y Frontend):**
    Desde la carpeta **raíz** (`mern-auth-template`), ejecuta:
    ```bash
    npm run install:all
    ```
    Esto instalará `concurrently` en la raíz y luego instalará las dependencias de `backend` y `frontend`.

## Uso

1.  **Iniciar Backend y Frontend Concurrentemente:**
    Desde la carpeta **raíz** (`mern-auth-template`), ejecuta:
    ```bash
    npm run dev
    ```
    Esto iniciará el servidor backend (normalmente en `http://localhost:5000`) y el servidor de desarrollo del frontend (normalmente en `http://localhost:5173`).

2.  **Abrir la Aplicación:**
    Abre tu navegador y ve a la URL del frontend (ej. `http://localhost:5173`).

3.  **Probar:**
    *   Regístrate con un nuevo usuario.
    *   Inicia sesión.
    *   Navega a la página de perfil (ruta protegida).
    *   Recarga la página (deberías seguir logueado).
    *   Espera a que el Access Token expire (o redúcelo temporalmente en `backend/src/libs/jwt.js` a, por ejemplo, `10s` para probar) e intenta navegar o recargar la página de perfil. Deberías ver el proceso de refresh en la consola o Network.
    *   Cierra sesión.

## Notas Adicionales

*   **Seguridad:** Recuerda implementar HTTPS en producción y considera añadir protección CSRF si usas `SameSite=None`.
*   **Errores:** La gestión de errores es básica, puedes mejorarla mostrando mensajes más específicos al usuario.
*   **Estilos:** Se usan estilos inline y un `index.css` muy básico. Puedes reemplazarlo con Tailwind, Material UI, Styled Components, etc.
*   **Validación:** Se incluye validación mínima en el backend. Considera usar librerías como Zod o express-validator para validaciones más robustas. 