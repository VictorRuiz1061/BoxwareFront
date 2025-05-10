import { z } from 'zod';

export const fichaSchema = z.object({
  id_ficha: z.string().min(4, 'El ID de la ficha debe tener al menos 4 caracteres'),
  usuario_ficha_id: z.string().min(1, 'Debe seleccionar un usuario'),
  programa_id: z.string().min(1, 'Debe seleccionar un programa'),
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(),
});

export type FichaSchema = z.infer<typeof fichaSchema>; 