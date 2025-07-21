import { z } from 'zod';

export const fichaSchema = z.object({
  id_ficha: z.string()
    .min(4, 'El ID de la ficha debe tener al menos 4 caracteres')
    .max(50, 'El ID de la ficha no puede tener más de 50 caracteres')
    .optional(), // Opcional para edición
  usuario_id: z.string().min(1, 'Debe seleccionar un usuario'),
  programa_id: z.string().min(1, 'Debe seleccionar un programa'),
  estado: z.boolean().optional(), // Opcional para creación
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(), // Opcional para creación
});

export type FichaSchema = z.infer<typeof fichaSchema>;