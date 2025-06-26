export interface Area {
  id_area: number;
  nombre_area: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  id_sede: number;
  sede?: {
    id_sede?: number;
    nombre_sede?: string;
  };
}
