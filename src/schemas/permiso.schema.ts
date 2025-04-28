import { z } from 'zod';

export const permisoSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  codigo_nombre: z.string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(50, 'El código no puede tener más de 50 caracteres'),
  modulo_id: z.string().min(1, 'Debe seleccionar un módulo'),
  rol_id: z.string().min(1, 'Debe seleccionar un rol'),
});

export type PermisoSchema = z.infer<typeof permisoSchema>;
