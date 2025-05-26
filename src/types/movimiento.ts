export interface Movimiento {
  id_movimiento: number;
  estado: boolean;
  cantidad: number;
  material_id: number;
  usuario_id: number;
  tipo_movimiento_id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
}
