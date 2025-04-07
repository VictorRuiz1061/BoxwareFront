export interface LoginFormValues {
  email: string;
  password: string;
}

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

export interface AuthResponse {
  message: string;
  // Add any other fields that your API returns
}
