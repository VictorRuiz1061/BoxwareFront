import { z } from 'zod';

export const centroSchema = z.object({
  nombre_centro: z.string()
    .min(3, 'El nombre del centro debe tener al menos 5 caracteres')
    .max(50, 'El nombre del centro no puede tener más de 50 caracteres'),
  id_municipio: z.string().min(1, 'Debe seleccionar un municipio'),
  estado: z.boolean().optional(), // Opcional para creación
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(), // Opcional para creación
});

export type CentroSchema = z.infer<typeof centroSchema>;
