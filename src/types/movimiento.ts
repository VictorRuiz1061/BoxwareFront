import { Material } from "./material";
import { Usuario } from "./usuario";
import { Sitio } from "./sitio";
import { TipoMovimiento } from "./tipoMovimiento";

export interface Movimiento {
  id_movimiento: number;
  estado: boolean | number;
  cantidad: number;
  sitio_origen_id?: number;
  sitio_destino_id?: number;
  sitio_id?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  // Campos que espera el backend
  usuario_id?: number;
  tipo_movimiento?: number;
  material_id?: number;
  // Relaciones para mostrar datos
  usuario_movimiento_id?: number;
  usuario_responsable_id?: number;
  tipo_movimiento_id?: number;
  usuario?: Usuario;
  tipo_movimiento_id_obj?: TipoMovimiento;
  material?: Material;
  sitio?: Sitio;
}
