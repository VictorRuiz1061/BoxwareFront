export interface Material {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  stock: number;
  unidad_medida: string;
  producto_perecedero: boolean;
  fecha_vencimiento: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  // Campos con nombres actualizados para coincidir con el backend
  id_categoria?: number;
  id_tipo_material?: number;
  id_sitio?: number;
  // Mantener los nombres anteriores para compatibilidad
  categoria_id?: number;
  tipo_material_id?: number;
  sitio_id?: number;
  // Estado puede ser string o boolean
  estado: string | boolean;
  // Imagen puede ser img o imagen
  img?: string;
  imagen?: string;
}