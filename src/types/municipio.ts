export interface Municipio {
  id_municipio: number;
  nombre_municipio: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export type NuevoMunicipio = Omit<Municipio, 'id_municipio'>;
