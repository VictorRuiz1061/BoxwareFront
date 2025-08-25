export interface Area {
  id_area: number;
  nombre_area: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  sede_id: number;
  sede?: {
    id_sede?: number;
    nombre_sede?: string;
  };
}


export interface CreateArea {
  nombre_area: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  sede_id: number;
}

export interface UpdateArea {
  id_area?: number;
  nombre_area?: string;
  estado?: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  sede_id?: number;
}
