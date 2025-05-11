import { z } from 'zod';

export const tipoMovimientoSchema = z.object({
  tipo_movimiento: z.string()
    .min(3, 'El tipo de movimiento debe tener al menos 3 caracteres')
    .max(50, 'El tipo de movimiento no puede tener más de 50 caracteres'),
  fecha_creacion: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'La fecha de creación debe ser una fecha válida' }),
  fecha_modificacion: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'La fecha de modificación debe ser una fecha válida' }),
  estado: z.boolean().optional(),
});
