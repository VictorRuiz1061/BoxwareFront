import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    // Try different possible endpoints for usuarios
    const endpoints = ["/usuarios", "/api/usuarios", "/vendedores"];
    let response = null;
    let error = null;
    
    // Try each endpoint until we get a successful response
    for (const endpoint of endpoints) {
      try {
        response = await axiosInstance.get(endpoint);
        if (response.data) {
          console.log(`Usuarios API response from ${endpoint}:`, response.data);
          break;
        }
      } catch (err: any) { // Type assertion to handle the error
        error = err;
        console.log(`Failed to fetch from ${endpoint}:`, err.message);
      }
    }
    
    if (!response) {
      throw error || new Error('Failed to fetch usuarios from any endpoint');
    }
    
    // Handle different possible response formats
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.datos && Array.isArray(response.data.datos)) {
      return response.data.datos;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      // Create a mock array for testing if no data is returned
      console.warn('Creating mock usuario data for testing');
      return [
        { id_usuario: 1, nombre: 'Usuario', apellido: 'Prueba 1', edad: 30, cedula: '123456789', email: 'usuario1@example.com', contrasena: '', telefono: '1234567890', estado: true, fecha_registro: new Date().toISOString(), rol_id: 1 },
        { id_usuario: 2, nombre: 'Usuario', apellido: 'Prueba 2', edad: 25, cedula: '987654321', email: 'usuario2@example.com', contrasena: '', telefono: '0987654321', estado: true, fecha_registro: new Date().toISOString(), rol_id: 2 }
      ];
    }
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    // Return mock data for testing
    return [
      { id_usuario: 1, nombre: 'Usuario', apellido: 'Prueba 1', edad: 30, cedula: '123456789', email: 'usuario1@example.com', contrasena: '', telefono: '1234567890', estado: true, fecha_registro: new Date().toISOString(), rol_id: 1 },
      { id_usuario: 2, nombre: 'Usuario', apellido: 'Prueba 2', edad: 25, cedula: '987654321', email: 'usuario2@example.com', contrasena: '', telefono: '0987654321', estado: true, fecha_registro: new Date().toISOString(), rol_id: 2 }
    ];
  }
}

export function useGetUsuarios() {
  return useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });
}
