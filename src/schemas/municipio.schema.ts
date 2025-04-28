import { z } from 'zod';

export const municipioSchema = z.object({
  nombre_municipio: z.string()
    .min(5, 'El nombre del municipio debe tener al menos 5 caracteres')
    .max(50, 'El nombre del municipio no puede tener más de 50 caracteres'),
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación'),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación'),
});

export type MunicipioSchema = z.infer<typeof municipioSchema>; 