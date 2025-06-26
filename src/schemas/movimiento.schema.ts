import { z } from 'zod';

export const movimientoSchema = z.object({
  usuario_id: z.coerce.number()
    .int('El ID de usuario debe ser un número entero')
    .positive('El ID de usuario debe ser un número positivo'),
  tipo_movimiento_id: z.coerce.number()
    .int('El ID de tipo de movimiento debe ser un número entero')
    .positive('El ID de tipo de movimiento debe ser un número positivo'),
  material_id: z.coerce.number()
    .int('El ID de material debe ser un número entero')
    .positive('El ID de material debe ser un número positivo'),
  cantidad: z.coerce.number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser un número positivo'),
  fecha_creacion: z.string().optional()
    .refine(val => !val || !isNaN(Date.parse(val)), { message: 'La fecha de creación debe ser una fecha válida' }),
  fecha_modificacion: z.string().optional()
    .refine(val => !val || !isNaN(Date.parse(val)), { message: 'La fecha de modificación debe ser una fecha válida' }),
  estado: z.boolean().optional(),
});

export type MovimientoSchema = z.infer<typeof movimientoSchema>;
