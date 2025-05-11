import { z } from 'zod';

export const movimientoSchema = z.object({
  usuario_id: z.number()
    .int('El ID de usuario debe ser un número entero')
    .positive('El ID de usuario debe ser un número positivo'),
  tipo_movimiento: z.number()
    .int('El ID de tipo de movimiento debe ser un número entero')
    .positive('El ID de tipo de movimiento debe ser un número positivo'),
  fecha_creacion: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'La fecha de creación debe ser una fecha válida' }),
  fecha_modificacion: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'La fecha de modificación debe ser una fecha válida' }),
  estado: z.boolean().optional(),
});
