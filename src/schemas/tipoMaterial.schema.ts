import { z } from 'zod';

export const tipoMaterialSchema = z.object({
  tipo_elemento: z.string()
    .min(5, 'El nombre del centro debe tener al menos 5 caracteres')
    .max(50, 'El nombre del centro no puede tener más de 50 caracteres'),
  estado: z.boolean().optional(), // Opcional para creación
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(), // Opcional para creación
});

export type TipoMaterialSchema = z.infer<typeof tipoMaterialSchema>; 