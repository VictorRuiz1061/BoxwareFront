import { Modulo } from './modulo';
import { Rol } from './rol';

export interface Permiso {
  id_permiso: number;
  nombre: string;
  estado: boolean;
  fecha_creacion: string;
  modulo_id: Array<number | Modulo>;
  rol_id: number | Rol;
  modulo?: Modulo[];
  rol?: Rol;
  puede_ver?: boolean;
  puede_crear?: boolean;
  puede_actualizar?: boolean;
  puede_eliminar?: boolean;
}