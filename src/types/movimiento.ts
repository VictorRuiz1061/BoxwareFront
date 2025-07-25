import { Material } from "./material";
import { Usuario } from "./usuario";
import { Sitio } from "./sitio";
import { TipoMovimiento } from "./tipoMovimiento";

export interface Movimiento {
  id_movimiento?: number;
  estado: boolean | number;
  cantidad: number;
  material_id: number;
  usuario_id: number;
  usuario_movimiento_id?: number;
  sitio_id?: number;
  sitio_origen_id: number;
  sitio_destino_id: number;
  responsable_id?: number;
  observaciones?: string;
  tipo_movimiento: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  material?: Material;
  usuario?: Usuario;
  sitio?: Sitio;
  tipo_movimiento_id?: TipoMovimiento;
}
