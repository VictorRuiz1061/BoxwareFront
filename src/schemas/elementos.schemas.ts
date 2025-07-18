import { z } from 'zod';

export const categoriaElementoSchema = z.object({
  codigo_unpsc: z.string()
    .min(5, 'El nombre del centro debe tener al menos 5 caracteres')
    .max(50, 'El nombre del centro no puede tener más de 50 caracteres'),
  nombre_categoria: z.string().min(1, 'Debe seleccionar un municipio'),
  estado: z.boolean().optional(), // Opcional para creación
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación').optional(),
  fecha_modificacion: z.string().min(4, 'Debe ingresar una fecha de modificación').optional(), // Opcional para creación
});

export type CategoriaElementoSchema = z.infer<typeof categoriaElementoSchema>;
