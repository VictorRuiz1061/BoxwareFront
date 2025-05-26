import { CategoriaElemento } from "./categoriaElemento";
import { TipoMaterial } from "./tipoMaterial";
import { Sitio } from "./sitio";

export interface Material {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  stock: number;
  unidad_medida: string;
  imagen: string;
  estado: boolean;
  producto_perecedero: boolean;
  fecha_vencimiento: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  categoria_id: number;
  tipo_material_id: number;
  sitio_id: number;
  categoria?: CategoriaElemento;
  tipo_material?: TipoMaterial;
  sitio?: Sitio;
}
