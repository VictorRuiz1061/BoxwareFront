import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues, RegisterFormValues, AuthResponse } from '../types/auth';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (values: LoginFormValues) => {
    const { email, password } = values;

    if (!email || !password) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Here you would typically make an API call to authenticate
    console.log('Iniciando sesión con:', values);
    navigate('/dashboard');
  };

  const register = async (values: RegisterFormValues) => {
    const {
      nombre,
      apellido,
      edad,
      cedula,
      email,
      telefono,
      password,
      confirmPassword,
    } = values;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          edad: edad ? parseInt(String(edad)) : null,
          cedula,
          email,
          contrasena: password,
          telefono,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al registrar usuario.');
        return;
      }

      console.log('Usuario registrado exitosamente:', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Ocurrió un error al intentar registrar el usuario. Por favor, intenta nuevamente.');
    }
  };

  return {
    error,
    setError,
    login,
    register,
  };
};
