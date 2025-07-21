import { Area } from './area';

export interface Programa {
  id_programa: number;
  nombre_programa: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  area_id: number;
  area?: Area;
}
