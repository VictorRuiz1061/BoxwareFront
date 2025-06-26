// Información del usuario autenticado
export interface UserAuth {
  id_usuario: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol_id: number;
  imagen?: string;
}

// Credenciales para inicio de sesión (API)
export interface LoginCredentials {
  email: string;
  contrasena: string;
}

// Formulario de inicio de sesión (Frontend)
export interface LoginFormValues {
  email: string;
  password: string;
}

// Datos para registro de usuario (API)
export interface RegisterData {
  nombre: string;
  apellido?: string;
  edad?: number | null;
  cedula?: string;
  email: string;
  contrasena: string;
  telefono?: string;
}

// Formulario de registro (Frontend)
export interface RegisterFormValues {
  nombre: string;
  apellido?: string;
  edad?: number;
  cedula?: string;
  email: string;
  telefono?: string;
  password: string;
  confirmPassword: string;
}

// Respuesta de la API de autenticación
// Actualizado para reflejar la estructura real de la respuesta del backend
export interface AuthResponse {
  message: string;
  token: string;
  user: UserAuth;
}

// Estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  user: UserAuth | null;
  loading: boolean;
  error: string | null;
}
