import { z } from 'zod';

export const centroSchema = z.object({
  nombre_centro: z.string()
    .min(5, 'El nombre del centro debe tener al menos 5 caracteres')
    .max(50, 'El nombre del centro no puede tener más de 50 caracteres'),
  municipio_id: z.string().min(1, 'Debe seleccionar un municipio'),
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación'),
});

export type CentroSchema = z.infer<typeof centroSchema>; 
