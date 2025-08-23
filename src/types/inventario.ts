import { Sitio } from "./sitio";
import { Material } from "./material";

export type Inventario = {
    id_inventario: number;
    stock: number;
    sitio_id: number;
    material_id: number;
    placa_sena?: string;
    descripcion?: string;
    sitio?: Sitio;
    material?: Material;
}
