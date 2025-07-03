import { z } from 'zod';

export const tipoMovimientoSchema = z.object({
  tipo_movimiento: z.string()
    .min(3, 'El tipo de movimiento debe tener al menos 3 caracteres')
    .max(50, 'El tipo de movimiento no puede tener más de 50 caracteres'),
    estado: z.boolean().optional(), // Opcional para creación
    fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
    fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(), // Opcional para creación
  });
