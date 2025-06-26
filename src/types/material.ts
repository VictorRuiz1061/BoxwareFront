import { CategoriaElemento } from "./Elemento";
import { TipoMaterial } from "./tipoMaterial";

export interface Material {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  unidad_medida: string;
  producto_perecedero: boolean;
  estado: boolean;
  fecha_vencimiento: string;
  imagen: string;
  categoria_id: number;
  tipo_material_id: number;
  categoria?: CategoriaElemento;
  tipo_material?: TipoMaterial;
}
