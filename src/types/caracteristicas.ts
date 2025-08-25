import { Material } from './material';

export type Caracteristica = {
    id_caracteristica: number;
    placa_sena: boolean;
    descripcion: boolean;
    material_id: number;
    material?: Material; // Material relacionado (opcional)
}