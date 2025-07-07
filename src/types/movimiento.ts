<<<<<<< HEAD
export interface Movimiento {
  id_movimiento: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  usuario_movimiento_id: number;
  tipo_movimiento_id: number;
=======
import { Material } from "./material";
import { Usuario } from "./usuario";
import { Sitio } from "./sitio";
import { TipoMovimiento } from "./tipoMovimiento";

export interface Movimiento {
  id_movimiento?: number;
  estado: boolean;
  cantidad: number;
  material_id: number;
  usuario_id: number;
  sitio_id: number;
  tipo_movimiento: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  material?: Material;
  usuario?: Usuario;
  sitio?: Sitio;
  tipo_movimiento_id?: TipoMovimiento;
>>>>>>> main
}
