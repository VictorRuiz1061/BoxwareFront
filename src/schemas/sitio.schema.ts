import { z } from 'zod';

export const sitioSchema = z.object({
  nombre_sitio: z.string()
    .min(3, 'El nombre del sitio debe tener al menos 3 caracteres')
    .max(50, 'El nombre del sitio no puede tener más de 50 caracteres'),
  ubicacion: z.string()
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(100, 'La ubicación no puede tener más de 100 caracteres'),
  ficha_tecnica: z.string()
    .min(3, 'La ficha técnica debe tener al menos 3 caracteres')
    .max(200, 'La ficha técnica no puede tener más de 200 caracteres'),
  estado: z.boolean().optional(), // Opcional para creación
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(),
});

export type SitioSchema = z.infer<typeof sitioSchema>;