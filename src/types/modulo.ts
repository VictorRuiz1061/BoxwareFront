export interface Modulo {
  id_modulo: number;
  fecha_accion: string;
  rutas: string;
  descripcion_ruta: string;
  mensaje_cambio: string;
  imagen: string;
  estado: boolean;
  fecha_creacion: string;
  es_submenu: boolean;
  modulo_padre_id?: number;
  submodulos?: Modulo[];
}
