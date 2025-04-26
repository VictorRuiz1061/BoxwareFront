export interface Material {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  stock: number;
  unidad_medida: string;
  fecha_vencimiento: string;
  producto_perecedero: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  categoria_id: number;
  tipo_material_id: number;
  sitio_id: number;
}
