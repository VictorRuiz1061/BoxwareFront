// Define types for alerts/notifications in the system

export interface Alerta {
  id?: number;
  mensaje: string;
  tipo: AlertaTipo;
  duracion?: number; // Duration in milliseconds
  timestamp?: string;
}

export enum AlertaTipo {
  EXITO = 'exito',
  ERROR = 'error',
  INFO = 'info',
  ADVERTENCIA = 'advertencia'
}
