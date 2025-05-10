import { z } from 'zod';

export const moduloSchema = z.object({
  rutas: z.string()
    .min(5, 'La ruta debe tener al menos 5 caracteres')
    .max(100, 'La ruta no puede tener más de 100 caracteres'),
  descripcion_ruta: z.string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(200, 'La descripción no puede tener más de 200 caracteres'),
  mensaje_cambio: z.string()
    .min(5, 'El mensaje debe tener al menos 5 caracteres')
    .max(200, 'El mensaje no puede tener más de 200 caracteres'),
  fecha_accion: z.string().min(4, 'Debe ingresar una fecha'),
  bandera_accion: z.string().optional(),
});

export type ModuloSchema = z.infer<typeof moduloSchema>;
