export interface Programa {
  id_programa: number;
  nombre_programa: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  area_id: number;
}

export interface CreateProgramaRequest {
  nombre_programa: string;
  estado: boolean;
  area_id: number;
}

export interface UpdateProgramaRequest {
  id: number;
  nombre_programa: string;
  estado: boolean;
  area_id: number;
  fecha_creacion: string;
}
