import { z } from 'zod';

export const programaSchema = z.object({
  nombre_programa: z.string()
    .min(3, 'El nombre del programa debe tener al menos 3 caracteres')
    .max(50, 'El nombre del programa no puede tener más de 50 caracteres'),
  area_id: z.string().min(1, 'Debe seleccionar un área'),
  estado: z.string().optional(),
  fecha_creacion: z.string().optional(),
  fecha_modificacion: z.string().optional(),
});

export type ProgramaSchema = z.infer<typeof programaSchema>; 
