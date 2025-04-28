import { z } from 'zod';

export const areaSchema = z.object({
  nombre_area: z.string()
    .min(3, 'El nombre del área debe tener al menos 3 caracteres')
    .max(50, 'El nombre del área no puede tener más de 50 caracteres'),
  sede_id: z.string().min(1, 'Debe seleccionar una sede'),
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación'),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación'),
});

export type AreaSchema = z.infer<typeof areaSchema>; 