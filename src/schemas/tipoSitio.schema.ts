import { z } from 'zod';

export const tipoSitioSchema = z.object({
  nombre_tipo_sitio: z.string()
    .min(3, 'El nombre del tipo de sitio debe tener al menos 3 caracteres')
    .max(50, 'El nombre del tipo de sitio no puede tener más de 50 caracteres'),
  fecha_creacion: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'La fecha de creación debe ser una fecha válida' }),
  fecha_modificacion: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'La fecha de modificación debe ser una fecha válida' }),
  estado: z.boolean().optional(),
});
