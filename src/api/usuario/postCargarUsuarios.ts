import axiosInstance from "@/api/axiosConfig";

export async function postCargarUsuarios(archivo: File, rol_id: number) {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("rol_id", rol_id.toString());

  // Configuración específica para este endpoint que maneja archivos
  const response = await axiosInstance.post("/usuarios/carga-masiva", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}