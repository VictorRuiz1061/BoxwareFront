import { z } from 'zod';

export const programaSchema = z.object({
  nombre_programa: z.string()
    .min(3, 'El nombre del programa debe tener al menos 3 caracteres')
    .max(50, 'El nombre del programa no puede tener más de 50 caracteres'),
  area_id: z.string().min(1, 'Debe seleccionar un área'),
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(),
});

export type ProgramaSchema = z.infer<typeof programaSchema>; 