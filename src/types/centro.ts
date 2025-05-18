import { Municipio } from './municipio';

export interface Centro {
  id_centro: number;
  nombre_centro: string;
  codigo_centro: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  id_municipio: number;
  municipio?: Municipio;
}
