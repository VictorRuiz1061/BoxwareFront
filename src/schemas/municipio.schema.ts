import { z } from 'zod';

export const municipioSchema = z.object({
  nombre_municipio: z.string()
    .min(4, 'El nombre del municipio debe tener al menos 5 caracteres')
    .max(50, 'El nombre del municipio no puede tener más de 50 caracteres'),
  estado: z.boolean().optional(), // Opcional para creación
  fecha_creacion: z.string().optional(),
  fecha_modificacion: z.string().optional(),
});

export type MunicipioSchema = z.infer<typeof municipioSchema>;
