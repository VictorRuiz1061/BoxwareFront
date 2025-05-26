import { z } from 'zod';

export const fichaSchema = z.object({
  id_ficha: z.coerce.number().positive('El ID de la ficha debe ser un número positivo'),
  usuario_id: z.coerce.number().positive('Debe seleccionar un usuario válido'),
  programa_id: z.coerce.number().positive('Debe seleccionar un programa válido'),
  estado: z.boolean().optional(),
  fecha_creacion: z.string().optional(),
  fecha_modificacion: z.string().optional(),
});

export type FichaSchema = z.infer<typeof fichaSchema>;
