export interface Ficha {
  id_ficha: number;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  usuario_id: number;
  programa_id: number | null;
}
