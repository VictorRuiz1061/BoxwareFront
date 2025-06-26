import { z } from 'zod';

export const sedeSchema = z.object({
  nombre_sede: z.string()
    .min(5, 'El nombre de la sede debe tener al menos 5 caracteres')
    .max(50, 'El nombre de la sede no puede tener más de 50 caracteres'),
  direccion_sede: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(100, 'La dirección no puede tener más de 100 caracteres'),
  centro_id: z.string().min(1, 'Debe seleccionar un centro'),
  estado: z.boolean().optional(),
  fecha_creacion: z.string().optional(),
  fecha_modificacion: z.string().optional(),
});

export type SedeSchema = z.infer<typeof sedeSchema>; 
