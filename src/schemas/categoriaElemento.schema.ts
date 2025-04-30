
import { z } from 'zod';

export const categoriaElementoSchema = z.object({
  id_categoria_elemento: z.number({ required_error: 'El id es requerido' }),
  codigo_unpsc: z.string().min(1, 'El código UNPSC es requerido'),
  nombre_categoria: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'El nombre no puede tener más de 50 caracteres'),
  fecha_creacion: z.string().min(1, 'La fecha de creación es requerida'),
  fecha_modificacion: z.string().min(1, 'La fecha de modificación es requerida'),
});

export type CategoriaElementoSchema = z.infer<typeof categoriaElementoSchema>;
