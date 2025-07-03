import { z } from 'zod';

export const permisoSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  estado: z.boolean().optional(),
  modulo_id: z.string().min(1, 'Debe seleccionar un módulo'),
  rol_id: z.string().min(1, 'Debe seleccionar un rol'),
  puede_ver: z.boolean().optional().default(false),
  puede_crear: z.boolean().optional().default(false),
  puede_actualizar: z.boolean().optional().default(false),
  puede_eliminar: z.boolean().optional().default(false),
});

export type PermisoSchema = z.infer<typeof permisoSchema>;
