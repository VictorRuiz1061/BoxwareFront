import { z } from 'zod';

export const movimientoSchema = z.object({
  usuario_id: z.string().min(1, 'Debe seleccionar un usuario'),
  tipo_movimiento: z.string().min(1, 'Debe seleccionar un tipo de movimiento'),
  material_id: z.string().min(1, 'Debe seleccionar un material'),
  sitio_origen_id: z.string().min(1, 'Debe seleccionar un sitio de origen'),
  sitio_destino_id: z.string().min(1, 'Debe seleccionar un sitio de destino'),
  sitio_id: z.string().optional(),
  cantidad: z.string().min(1, 'Debe ingresar una cantidad'),
  estado: z.number().optional(),
  fecha_creacion: z.string().optional(),
  fecha_modificacion: z.string().optional(),
});

export type MovimientoSchema = z.infer<typeof movimientoSchema>;
