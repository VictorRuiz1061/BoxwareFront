import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

// Datos de ejemplo para usar cuando la API no está disponible
const materialesEjemplo: Material[] = [
  {
    id_material: 1,
    codigo_sena: 'M001',
    nombre_material: 'Acero Inoxidable',
    descripcion_material: 'Acero inoxidable de alta calidad',
    stock: 100,
    unidad_medida: 'kg',
    producto_perecedero: false,
    fecha_vencimiento: new Date().toISOString(),
    fecha_creacion: new Date().toISOString(),
    fecha_modificacion: new Date().toISOString(),
    categoria_id: 1,
    tipo_material_id: 1,
    sitio_id: 1,
    estado: 'Activo',
    img: 'https://via.placeholder.com/150/0000FF/FFFFFF'
  },
  {
    id_material: 2,
    codigo_sena: 'M002',
    nombre_material: 'Madera',
    descripcion_material: 'Madera de pino',
    stock: 50,
    unidad_medida: 'unidad',
    producto_perecedero: false,
    fecha_vencimiento: new Date().toISOString(),
    fecha_creacion: new Date().toISOString(),
    fecha_modificacion: new Date().toISOString(),
    categoria_id: 2,
    tipo_material_id: 2,
    sitio_id: 1,
    estado: 'Activo',
    img: 'https://via.placeholder.com/150/00FF00/000000'
  },
  {
    id_material: 3,
    codigo_sena: 'M003',
    nombre_material: 'Plástico',
    descripcion_material: 'Plástico ABS',
    stock: 200,
    unidad_medida: 'kg',
    producto_perecedero: false,
    fecha_vencimiento: new Date().toISOString(),
    fecha_creacion: new Date().toISOString(),
    fecha_modificacion: new Date().toISOString(),
    categoria_id: 3,
    tipo_material_id: 3,
    sitio_id: 2,
    estado: 'Activo',
    img: 'https://via.placeholder.com/150/FF0000/FFFFFF'
  }
];

export async function getMateriales(): Promise<Material[]> {
  try {
    const response = await axiosInstance.get<Material[]>('/materiales');
    return response.data;
  } catch (error) {
    console.error('Error al obtener materiales, usando datos de ejemplo:', error);
    return materialesEjemplo;
  }
}

export function useGetMateriales() {
  return useQuery({
    queryKey: ["materiales"],
    queryFn: getMateriales
  });
}
