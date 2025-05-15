import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Area } from "@/types/area";

export interface NuevaArea {
  id_area?: number; // Opcional para creación, el backend podría generarlo
  nombre_area: string;
  estado: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  sede_id: number | null;
}

export async function postArea(data: NuevaArea): Promise<Area> {
  try {
    console.log('Enviando datos a /areas:', data);
    // Verificar que el token JWT esté presente en los headers
    const token = localStorage.getItem('token');
    console.log('Token JWT disponible:', !!token);
    
    // Asegurar que axiosInstance tenga el token en los headers
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Asegurar que todos los campos requeridos estén presentes
    if (!data.nombre_area) {
      throw new Error('El nombre del área es obligatorio');
    }
    
    // Asegurar que estado esté presente (true por defecto si no se proporciona)
    const dataWithDefaults = {
      ...data,
      estado: data.estado !== undefined ? data.estado : true,
      fecha_creacion: data.fecha_creacion || new Date().toISOString(),
      fecha_modificacion: data.fecha_modificacion || new Date().toISOString(),
      // Asegurar que id_area esté presente (0 por defecto para nuevos registros)
      id_area: data.id_area || 0
    };
    
    console.log('Datos finales enviados a /areas:', dataWithDefaults);
    const response = await axiosInstance.post("/areas", dataWithDefaults);
    console.log('Respuesta exitosa del servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error detallado al crear área:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
}

export function usePostArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
} 