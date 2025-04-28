import { ReactNode } from "react";

export interface Rol {
  nombre: ReactNode;
  id: number;
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
}
