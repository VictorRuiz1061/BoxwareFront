import { z } from 'zod';

export const permisoSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  estado: z.boolean().optional(),
  modulo_id: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return val.map(v => Number(v));
      }
      return [Number(val)];
    },
    z.array(z.number()).min(1, 'Debe seleccionar al menos un módulo')
  ),
  rol_id: z.preprocess(
    (val) => Number(val),
    z.number()
  ),
  puede_ver: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  ).default(false),
  puede_crear: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  ).default(false),
  puede_actualizar: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  ).default(false),
  puede_eliminar: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  ).default(false),
});

export type PermisoSchema = z.infer<typeof permisoSchema>;
