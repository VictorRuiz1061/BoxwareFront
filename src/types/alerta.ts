// Interfaz principal de Alerta
export interface Alerta {
  id_alerta: number;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  estado: EstadoAlerta;
  titulo: string;
  mensaje: string;
  datos_adicionales?: any;
  material_id?: number;
  sitio_id?: number;
  movimiento_id?: number;
  usuario_id?: number;
  fecha_creacion: string;
  fecha_lectura?: string;
  enviada_websocket: boolean;
}

// Alerta con relaciones (usuario, material, sitio)
export interface AlertaConRelaciones extends Alerta {
  usuario?: {
    id_usuario: number;
    nombre: string;
    email: string;
    cedula: string;
  };
  material?: {
    id_material: number;
    nombre_material: string;
    descripcion?: string;
  };
  sitio?: {
    id_sitio: number;
    nombre_sitio: string;
    descripcion?: string;
  };
}

// Payload para crear alerta
export interface CreateAlertaDto {
  tipo: TipoAlerta;
  nivel?: NivelAlerta;
  titulo: string;
  mensaje: string;
  datos_adicionales?: any;
  material_id?: number;
  sitio_id?: number;
  movimiento_id?: number;
  usuario_id?: number;
}

// Payload para actualizar alerta
export interface UpdateAlertaDto extends Partial<CreateAlertaDto> {}

// Payload para marcar como leída
export interface MarcarLeidaDto {
  alerta_id: number;
}





// Tipos de alerta
export enum TipoAlerta {
  STOCK_BAJO = 'stock_bajo',
  PRESTAMO = 'prestamo',
  DEVOLUCION = 'devolucion',
  TRANSFERENCIA = 'transferencia',
  MATERIAL_NUEVO = 'material_nuevo',
  MOVIMIENTO_CRITICO = 'movimiento_critico',
  SISTEMA = 'sistema'
}

// Niveles de alerta
export enum NivelAlerta {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Estados de alerta
export enum EstadoAlerta {
  PENDIENTE = 'pendiente',
  LEIDA = 'leida',
  ARCHIVADA = 'archivada'
}