export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  edad: number;
  cedula: string;
  email: string;
  contrasena: string;
  telefono: string;
  esta_activo: boolean;
  fecha_registro: string;
  rol_id: number;
}

export type NuevoUsuario = Omit<Usuario, 'id_usuario' | 'esta_activo' | 'fecha_registro'>;
